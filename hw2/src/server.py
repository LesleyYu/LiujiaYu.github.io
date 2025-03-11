import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='static')
CORS(app)

@app.route('/')
def homepage():
    try:
        return app.send_static_file("index.html")
    except:
        return "Welcome to the Artist Search API"

@app.route('/<path:name>')
def get_files(name):
    try:
        return send_from_directory('static', name)
    except:
        return jsonify({"error": "File not found"}), 404


# @app.route('/')
# # test
# # def home():
# #     return "Welcome to the Artist Search API. Use /search?query=artist_name"
# def homepage():
#     return app.send_static_file("index.html")

# @app.route('/<path:name>')
# def get_files(name):
#     return send_from_directory('static', name)


ARTSY_CLIENT_ID	= "7a3721ec141b22852f02"
ARTSY_CLIENT_SECRET = "bd9624b2469cdfd3edbf575b9fc0855b"
ARTSY_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsInN1YmplY3RfYXBwbGljYXRpb24iOiIwMmE4NWU5Zi1kNWYxLTRiOGItOTgzOS1kMmJmYTg2ODE3MTkiLCJleHAiOjE3NDIyODk5ODAsImlhdCI6MTc0MTY4NTE4MCwiYXVkIjoiMDJhODVlOWYtZDVmMS00YjhiLTk4MzktZDJiZmE4NjgxNzE5IiwiaXNzIjoiR3Jhdml0eSIsImp0aSI6IjY3ZDAwMWJjN2I3ZTVhMDAwZjRjOWFjYyJ9.W2M5wteXp2d06NGJQ1pbWwAqc-GQOqR48qJyw7YUyok"

# get Artsy API access token
def get_artsy_token():
    url = "https://api.artsy.net/api/tokens/xapp_token"
    payload = {
        "client_id": ARTSY_CLIENT_ID,
        "client_secret": ARTSY_CLIENT_SECRET
    }
    response = requests.post(url, json=payload)
    
    if response.status_code in [200, 201]:
        token = response.json().get("token")
        # print("New Artsy Token:", token)  # Debugging
        return token
    else:
        print("Error getting Artsy token:", response.status_code, response.text)
        return None


# search artist
@app.route('/search/<query>', methods=['GET'])
def search_artists(query):
    # query = request.args.get("query", "").strip()   # !! this request keyword?

    artsy_token = get_artsy_token()
    # artsy_token = ARTSY_TOKEN
    # make request ot Artsy API
    url = f"https://api.artsy.net/api/search?q={query}&size=10&type=artist"
    headers = {
        "X-Xapp-Token": artsy_token,
        "Accept": "application/json"
    }

    response = requests.get(url, headers=headers)

    # try to handle data on back-end
    # results = response.json()['_embedded']['results']

    # # Debugging: Print full response status and content
    # print("Response Status Code:", response.status_code)
    # print("Response Content:", response.text)

    try:
        json_response = response.json()
        if '_embedded' in json_response and 'results' in json_response['_embedded']:
            results = json_response['_embedded']['results']
        else:
            print("Unexpected response format:", json_response)
            results = []
    except Exception as e:
        print("Error parsing JSON:", e)
        results = []

    artists = []
    for result in results:
        artist = {
            'title': result['title'],
            'bioUrl': result['_links']['self']['href']
        }
        
        # Check thumbnail and set imgUrl
        if result['_links']['thumbnail']['href'] == "/assets/shared/missing_image.png":
            artist['imgUrl'] = "./image/artsy_logo.svg"
        else:
            artist['imgUrl'] = result['_links']['thumbnail']['href']
        
        artists.append(artist)

    return jsonify({"artists": artists})

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Failed to fetch data", "details": response.text}), response.status_code

@app.route('/artist/<id>', methods=['GET'])     # if param not passed as in syntax like (?id=..), it should add a "/<id>"
def search_artist_bio(id):
    # id = request.args.get("id", "").strip()

    # artsy_token = ARTSY_TOKEN
    artsy_token = get_artsy_token()
    # make request ot Artsy API
    url = f"https://api.artsy.net/api/artists/{id}"
    headers = {
        "X-XAPP-Token": artsy_token
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Failed to fetch data", "details": response.text}), response.status_code



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)