const User = require('../models/User');

// get current user's favorites
async function getFavorites(req, res) {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('favorites');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites', details: error.toString() });
  }
}

// add an artist to favorites
async function addFavorite(req, res) {
  const { artistId } = req.params;
  const { title, bioUrl, imgUrl } = req.body;
  if (!artistId || !title) {
    return res.status(400).json({ error: 'Missing required artist information' });
  }
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Only add if the artist is not already in the favorites array
    // reference: https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#updateOne
    const alreadyFavorite = user.favorites.some(fav => fav.artistId === artistId);
    if (alreadyFavorite) {
      return res.status(400).json({ error: 'Artist already in favorites' });
    }
    user.favorites.push({ artistId, title, bioUrl, imgUrl, addedAt: new Date() });
    await user.save();
    res.json({ message: 'Added to favorites', favorites: user.favorites });
  } catch (error) {
    console.error('Error in addFavorite:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// remove an artist from favorites
async function removeFavorite(req, res) {
  const { artistId } = req.params;
  if (!artistId) {
    return res.status(400).json({ error: 'Missing artist id' });
  }
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.favorites = user.favorites.filter(fav => fav.artistId !== artistId);
    await user.save();
    res.json({ message: 'Removed from favorites', favorites: user.favorites });
  } catch (error) {
    console.error('Error in removeFavorite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite
};