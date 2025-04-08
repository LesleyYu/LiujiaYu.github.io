// web address: https://cloud.mongodb.com/v2/67f07136e671d5222fab19b9#/metrics/replicaSet/67f0716dee8b3c6ee0d25d2f/explorer/HW3/users/find

// ------ 1. Native MongoDB Client (removed) ------
// const { MongoClient } = require('mongodb');

// // Define your MongoDB connection URI
// const mongoUri = "mongodb+srv://liujiay:Kes%3F%3F17kot7adf@cluster0.g6whbar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

// // connect to MongoDB and store the DB connection in app.locals for use in routes
// client.connect()
//   .then(() => {
//     console.log("Connected to MongoDB");
//     const db = client.db("HW3");
//     app.locals.db = db;
//   })
//   .catch(err => console.error("Error connecting to MongoDB", err));

// ------ 2. connected using mongoose ------
const mongoose = require('mongoose');
const config = require('../../config');

// // Define the MongoDB connection URI.  (Removed. Now imported thru the config.js and .env)
// const localUri = 'mongodb://localhost:27017/HW3';
// const mongoUri = process.env.MONGO_URI || localUri;
// // Explanation: If process.env.MONGO_URI is set (e.g., in production), it will be used.
// // Otherwise, fallback to a local MongoDB instance for development.

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri
      // , {
      // useNewUrlParser: true,
      // useUnifiedTopology: true
      // }
    );
    console.log(`Connected to MongoDB at ${config.mongoUri}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;




// // ==== toy example ====
// // reference: https://www.mongodb.com/docs/drivers/node/current/quick-start/connect-to-mongodb/

// const { MongoClient } = require("mongodb");

// // Replace the uri string with your connection string.
// const uri = "mongodb+srv://liujiay:Kes%3F%3F17kot7adf@cluster0.g6whbar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// const client = new MongoClient(uri);

// async function run() {
//   try {
//     const database = client.db('HW3');
//     const favorites = database.collection('favorites');

//     // Query for a movie that has the title 'Back to the Future'
//     const query = { title: 'Back to the Future' };
//     const favorite = await favorites.findOne(query);

//     console.log(favorite);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);