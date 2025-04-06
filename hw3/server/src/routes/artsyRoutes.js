const express = require('express');
const router = express.Router();
const cors = require('cors');

const { 
  searchArtist, 
  getArtistDetails, 
  getSimilarArtists, 
  getArtworks, 
  getGenes 
} = require('../controllers/artsyControllers');

// Use CORS middleware
router.use(cors());

router.get('/search/:query', searchArtist);
router.get('/artist/:id', getArtistDetails);
router.get('/similar/:artistId', getSimilarArtists);
router.get('/artworks/:artistId', getArtworks);
router.get('/genes/:artworkId', getGenes);

module.exports = router;