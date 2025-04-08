const express = require('express');
const router = express.Router();
const cors = require('cors');
const path = require('path');

const { 
  searchArtist, 
  getArtistDetail, 
  getSimilarArtists, 
  getArtworks, 
  getGenes 
} = require('../controllers/artsyControllers');

// Use CORS middleware
router.use(cors());

router.get('/search/:query', searchArtist);
router.get('/artist/:id', getArtistDetail);
router.get('/similar/:artistId', getSimilarArtists);
router.get('/artworks/:artistId', getArtworks);
router.get('/genes/:artworkId', getGenes);

// ----- Static File Routes -----   // Originally in routes_depr/index.js. Now removed.

// // Homepage route - serve index.html from public folder
// router.get('/', (req, res) => {
//   const options = { root: path.join(__dirname, '../../public') };
//   res.sendFile('index.html', options, (err) => {
//     if (err) {
//       console.error(err);
//       res.send('Welcome to the Artist Search API');
//     }
//   });
// });

// // Catch-all for static files in the public directory
// // (This come after the API routes to avoid conflicts)
// router.get('/*', (req, res) => {
//   const fileName = req.params[0];
//   const options = { root: path.join(__dirname, '../../public') };
//   res.sendFile(fileName, options, (err) => {
//     if (err) {
//       res.status(404).json({ error: 'File not found' });
//     }
//   });
// });

module.exports = router;