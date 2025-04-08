const express = require('express');
const cors = require('cors');
const router = express.Router();
const path = require('path');
const { register, login, logout, deleteAccount, getMe } = require('../controllers/authControllers');
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favControllers');
const { authenticateToken } = require('../middleware/authMiddleware');

// Use CORS middleware
router.use(cors());

// --- Authentication & User Endpoints ---
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.delete('/delete-account', authenticateToken, deleteAccount);
// router.get('/', function(req, res, next) { res.redirect('/user/me'); });
router.get('/me', authenticateToken, getMe);

// --- Favorites Endpoints (Authenticated users only) ---
router.get('/favorites', authenticateToken, getFavorites);
router.post('/favorites/:artistId', authenticateToken, addFavorite);
router.delete('/favorites/:artistId', authenticateToken, removeFavorite);

module.exports = router;