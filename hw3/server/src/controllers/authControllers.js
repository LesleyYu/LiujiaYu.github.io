const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');

const jwtSecret = process.env.JWT_SECRET || 'fallbackSecret';
const jwtExpiry = 3600; // 1 hour

async function register(req, res) {
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    // a. Generate Gravatar URL using sha256 hash of the trimmed, lowercased wmail
    // reference: https://nodejs.org/api/crypto.html
    //            https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options
    const hash = crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
    // reference: https://docs.gravatar.com/api/avatars/images/
    const profileImageUrl = `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`;

    // b. Hash the password using bcrypt
    // reference: https://github.com/kelektiv/node.bcrypt.js?tab=readme-ov-file#esm-import
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // c. Insert new user into the "users" collection
    // reference: https://www.mongodb.com/docs/manual/tutorial/insert-documents/
    const newUser = new User({
      fullname,
      email: email.toLowerCase(),
      password: hashedPassword,
      profileImageUrl,
      favorites: []
    });
    const savedUser = await newUser.save();

    // d. Create JWT token for the new user
    // reference: https://www.npmjs.com/package/jsonwebtoken
    const tokenPayload = { userId: savedUser._id, email: savedUser.email };
    const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: jwtExpiry });
    res.cookie('token', token, { httpOnly: true, maxAge: jwtExpiry * 1000 });
    res.json({ 
      message: 'Registration successful', 
      user: { 
        fullname: savedUser.fullname, 
        email: savedUser.email, 
        profileImageUrl: savedUser.profileImageUrl, 
        favorites: savedUser.favorites 
      }
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    // Create JWT token
    const tokenPayload = { userId: user._id, email: user.email };
    const token = jwt.sign(tokenPayload, jwtSecret, { expiresIn: jwtExpiry });
    res.cookie('token', token, { httpOnly: true, maxAge: jwtExpiry * 1000 });

    // response (Exclude password for returned user info)   // can it be written in 解构符？
    const userInfo = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      favorites: user.favorites
    };
    res.json({ message: 'Login successful', user: userInfo });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
}

async function deleteAccount(req, res) {
  try {
    const userId = req.user.userId;
    await User.findByIdAndDelete(userId);
    res.clearCookie('token');
    res.json({ message: 'Account deleted' });
  } catch (error) {
    console.error("Error in deleteAccount:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getMe(req, res) {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error("Error in getMe:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  register,
  login,
  logout,
  deleteAccount,
  getMe
};