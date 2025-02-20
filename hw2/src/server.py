import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

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
ARTSY_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsInN1YmplY3RfYXBwbGljYXRpb24iOiIwMmE4NWU5Zi1kNWYxLTRiOGItOTgzOS1kMmJmYTg2ODE3MTkiLCJleHAiOjE3NDAyNzI3MzEsImlhdCI6MTczOTY2NzkzMSwiYXVkIjoiMDJhODVlOWYtZDVmMS00YjhiLTk4MzktZDJiZmE4NjgxNzE5IiwiaXNzIjoiR3Jhdml0eSIsImp0aSI6IjY3YjEzOWRiYTUyMmNiMzJmMzg0MWFkYSJ9.KvKE1WOh4pzgsng0ewOL3XhnkCDEpXUZAXnda8W1YTY"

# get Artsy API access token
def get_artsy_token():
    url = "https://api.artsy.net/api/tokens/xapp_token"
    payload = {
        "client_id": ARTSY_CLIENT_ID,
        "client_secret": ARTSY_CLIENT_SECRET
    }
    response = requests.post(url, json=payload)
    
    if response.status_code == 200:
        return response.json().get("token")
    else:
        print("Error getting Artsy token:", response.text)
        return None


# search artist
@app.route('/search', methods=['GET'])
def search_artists():
    query = request.args.get("query", "").strip()   # !! this request keyword?

    artsy_token = get_artsy_token()
    artsy_token = ARTSY_TOKEN
    # make request ot Artsy API
    url = f"https://api.artsy.net/api/search?q={query}&size=10&type=artist"
    headers = {
        "X-XAPP-Token": artsy_token
    }

    response = requests.get(url, headers=headers)

    # try to handle data on back-end
    results = response.json()['_embedded']['results']
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

    artsy_token = get_artsy_token()
    artsy_token = ARTSY_TOKEN
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