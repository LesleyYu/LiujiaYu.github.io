const fetch = require('node-fetch');
const { getCached, setCached } = require('../cache');

// Artsy API credentials
const ARTSY_CLIENT_ID = "7a3721ec141b22852f02";
const ARTSY_CLIENT_SECRET = "bd9624b2469cdfd3edbf575b9fc0855b";

// Cache tuning. Artsy data (artists, artworks, genes) is low-volatility, so a modest TTL removes
// most of the repeated outbound round-trips against this rate-limited API.
const ARTSY_DATA_TTL_MS = 60 * 60 * 1000;        // 1 hour for search/detail/similar/artworks/genes
const TOKEN_CACHE_KEY = 'xapp_token';
const TOKEN_SAFETY_MARGIN_MS = 5 * 60 * 1000;    // refresh a few minutes before real expiry
const TOKEN_FALLBACK_TTL_MS = 6 * 24 * 60 * 60 * 1000; // used when the API omits expires_at

function computeTokenTtlMs(expiresAt) {
  if (!expiresAt) {
    return TOKEN_FALLBACK_TTL_MS;
  }
  const remainingMs = new Date(expiresAt).getTime() - Date.now() - TOKEN_SAFETY_MARGIN_MS;
  if (isNaN(remainingMs) || remainingMs <= 0) {
    return TOKEN_FALLBACK_TTL_MS;
  }
  return remainingMs;
}

// Obtain an Artsy XAPP token, reusing the cached one until it is near expiry.
// Previously this ran on every request, adding a full round-trip per API call.
async function getArtsyToken() {
  const cachedToken = getCached(TOKEN_CACHE_KEY);
  if (cachedToken) {
    return cachedToken;
  }

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
      setCached(TOKEN_CACHE_KEY, data.token, computeTokenTtlMs(data.expires_at));
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
  const cacheKey = `search:${query}`;
  const cachedBody = getCached(cacheKey);
  if (cachedBody) {
    return res.json(cachedBody);
  }

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
    const responseBody = { artists };
    if (artists.length > 0) {
      setCached(cacheKey, responseBody, ARTSY_DATA_TTL_MS);
    }
    res.json(responseBody);
  } catch (error) {
    console.error('Error in searchArtist:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.toString() });
  }
}

async function getArtistDetail(req, res) {
  const id = req.params.id;
  const cacheKey = `artist:${id}`;
  const cachedBody = getCached(cacheKey);
  if (cachedBody) {
    return res.json(cachedBody);
  }

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
      // console.log('In server artsy controller, getArtistDetails, bioUrl:', data._links.self.href);
      const filteredData = {
        id: data.id,
        name: data.name,
        birthday: data.birthday,
        deathday: data.deathday,
        nationality: data.nationality,
        biography: data.biography,
        bioUrl: data._links.self.href,
        imgUrl: data._links.thumbnail ? data._links.thumbnail.href : "/image/artsy_logo.svg",
        genes: data._links.genes ? data._links.genes.href : null,
        similar_artists: data._links.similar_artists ? data._links.similar_artists.href : null,
      };
      setCached(cacheKey, filteredData, ARTSY_DATA_TTL_MS);
      res.json(filteredData);
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
  const cacheKey = `similar:${artistId}`;
  const cachedBody = getCached(cacheKey);
  if (cachedBody) {
    return res.json(cachedBody);
  }

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
    const responseBody = { artists: similarArtists };
    if (similarArtists.length > 0) {
      setCached(cacheKey, responseBody, ARTSY_DATA_TTL_MS);
    }
    res.json(responseBody);
  } catch (error) {
    console.error('Error in getSimilarArtists:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.toString() });
  }
}

async function getArtworks(req, res) {
  const artistId = req.params.artistId;
  const cacheKey = `artworks:${artistId}`;
  const cachedBody = getCached(cacheKey);
  if (cachedBody) {
    return res.json(cachedBody);
  }

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
    const responseBody = { artworks };
    if (artworks.length > 0) {
      setCached(cacheKey, responseBody, ARTSY_DATA_TTL_MS);
    }
    res.json(responseBody);
  } catch (error) {
    console.error('Error in getArtworks:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.toString() });
  }
}

async function getGenes(req, res) {
  const artworkId = req.params.artworkId;
  const cacheKey = `genes:${artworkId}`;
  const cachedBody = getCached(cacheKey);
  if (cachedBody) {
    return res.json(cachedBody);
  }

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
    const responseBody = { genes };
    if (genes.length > 0) {
      setCached(cacheKey, responseBody, ARTSY_DATA_TTL_MS);
    }
    res.json(responseBody);
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