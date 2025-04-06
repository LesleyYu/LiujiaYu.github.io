
require('dotenv').config();
module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'Lesley',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/HW3'
};