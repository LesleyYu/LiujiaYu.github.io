const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  profileImageUrl: { type: String },
  favorites: { type: Array, default: [] }
});

module.exports = mongoose.model('User', userSchema);