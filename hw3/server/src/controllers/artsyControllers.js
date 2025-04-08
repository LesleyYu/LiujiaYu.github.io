const fetch = require('node-fetch');

// Artsy API credentials
const ARTSY_CLIENT_ID = "7a3721ec141b22852f02";
const ARTSY_CLIENT_SECRET = "bd9624b2469cdfd3edbf575b9fc0855b";

// Function to obtain a new Artsy token
async function getArtsyToken() {
  const url = "https://api.artsy.net/api/tokens/xapp_token";
  const payload = {
    client_id: ARTSY_CLIENT_ID,
    client_secret: ARTSY_CLIENT_SECRET
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      const data = await response.json();
      return data.token;
    } else {
      console.error('Error getting Artsy token:', response.status, await response.text());
      return null;
    }
  } catch (error) {
    console.error('Error in getArtsyToken:', error);
    return null;
  }
}

async function searchArtist(req, res) {
  const query = req.params.query;
  const token = await getArtsyToken();
  if (!token) {
    return res.status(500).json({ error: 'Failed to obtain Artsy token' });
  }

  const apiUrl = `https://api.artsy.net/api/search?q=${encodeURIComponent(query)}&size=10&type=artist`;
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'X-Xapp-Token': token,
        'Accept': 'application/json'
      }
    });
    const jsonResponse = await response.json();
    let results = [];
    if (jsonResponse._embedded && jsonResponse._embedded.results) {
      results = jsonResponse._embedded.results;
    } else {
      console.error('Unexpected response format:', jsonResponse);
    }
    const artists = results.map(result => {
      let imgUrl = result._links.thumbnail.href;
      if (imgUrl === '/assets/shared/missing_image.png') {
        imgUrl = '/image/artsy_logo.svg';
      }
      return {
        title: result.title,
        bioUrl: result._links.self.href,
        imgUrl: imgUrl,
        id: result._links.self.href.split('/')[5]
      };
    });
    res.json({ artists });
  } catch (error) {
    console.error('Error in searchArtist:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.toString() });
  }
}

async function getArtistDetail(req, res) {
  const id = req.params.id;
  const token = await getArtsyToken();
  if (!token) {
    return res.status(500).json({ error: 'Failed to obtain Artsy token' });
  }

  const apiUrl = `https://api.artsy.net/api/artists/${encodeURIComponent(id)}`;
  try {
    const response = await fetch(apiUrl, {
      headers: { 'X-Xapp-Token': token }
    });
    if (response.ok) {
      const data = await response.json();
      // const filteredData = {
      //   name: data.name,
      //   birthday: data.birthday,
      //   deathday: data.deathday,
      //   nationality: data.nationality,
      //   biography: data.biography
      //   bioUrl: ...
      // };
      // res.json(filteredData);
      res.json(data);
    } else {
      const errorText = await response.text();
      res.status(response.status).json({ error: 'Failed to fetch data', details: errorText });
    }
  } catch (error) {
    console.error('Error in getArtistDetail:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.toString() });
  }
}

async function getSimilarArtists(req, res) {
  const artistId = req.params.artistId;
  const token = await getArtsyToken();
  if (!token) {
    return res.status(500).json({ error: 'Failed to obtain Artsy token' });
  }
  const apiUrl = `https://api.artsy.net/api/artists?similar_to_artist_id=${encodeURIComponent(artistId)}`;
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'X-Xapp-Token': token,
        'Accept': 'application/json'
      }
    });
    const jsonResponse = await response.json();
    let results = [];
    if (jsonResponse._embedded && jsonResponse._embedded.artists) {
      results = jsonResponse._embedded.artists;
    } else {
      console.error('Unexpected response format:', jsonResponse);
    }
    const similarArtists = results.map(result => {
      let imgUrl = result._links.thumbnail.href;
      if (imgUrl === '/assets/shared/missing_image.png') {
        imgUrl = '/image/artsy_logo.svg';
      }
      return {
        id: result.id,
        name: result.name,
        imgUrl: imgUrl
      };
    });
    res.json({ artists: similarArtists });
  } catch (error) {
    console.error('Error in getSimilarArtists:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.toString() });
  }
}

async function getArtworks(req, res) {
  const artistId = req.params.artistId;
  const token = await getArtsyToken();
  if (!token) {
    return res.status(500).json({ error: 'Failed to obtain Artsy token' });
  }
  const apiUrl = `https://api.artsy.net/api/artworks?artist_id=${encodeURIComponent(artistId)}&size=10`;
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'X-Xapp-Token': token,
        'Accept': 'application/json'
      }
    });
    const jsonResponse = await response.json();
    let results = [];
    if (jsonResponse._embedded && jsonResponse._embedded.artworks) {
      results = jsonResponse._embedded.artworks;
    } else {
      console.error('Unexpected response format:', jsonResponse);
    }
    const artworks = results.map(result => {
      let imgUrl = result._links.thumbnail.href;
      if (imgUrl === '/assets/shared/missing_image.png') {
        imgUrl = '/image/artsy_logo.svg';
      }
      return {
        id: result.id,
        title: result.title,
        date: result.date,
        imgUrl: imgUrl
      };
    });
    res.json({ artworks });
  } catch (error) {
    console.error('Error in getArtworks:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.toString() });
  }
}

async function getGenes(req, res) {
  const artworkId = req.params.artworkId;
  const token = await getArtsyToken();
  if (!token) {
    return res.status(500).json({ error: 'Failed to obtain Artsy token' });
  }
  const apiUrl = `https://api.artsy.net/api/genes?artwork_id=${encodeURIComponent(artworkId)}`;
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'X-Xapp-Token': token,
        'Accept': 'application/json'
      }
    });
    const jsonResponse = await response.json();
    let results = [];
    if (jsonResponse._embedded && jsonResponse._embedded.genes) {
      results = jsonResponse._embedded.genes;
    } else {
      console.error('Unexpected response format:', jsonResponse);
    }
    const genes = results.map(result => {
      let imgUrl = result._links.thumbnail.href;
      if (imgUrl === '/assets/shared/missing_image.png') {
        imgUrl = '/image/artsy_logo.svg';
      }
      return {
        name: result.name,
        imgUrl: imgUrl
      };
    });
    res.json({ genes });
  } catch (error) {
    console.error('Error in getGenes:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.toString() });
  }
}

module.exports = {
  searchArtist,
  getArtistDetail,
  getSimilarArtists,
  getArtworks,
  getGenes
};