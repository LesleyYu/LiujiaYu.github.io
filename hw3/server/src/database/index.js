// test file - not in use

// reference: https://www.mongodb.com/docs/drivers/node/current/quick-start/connect-to-mongodb/

const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = "mongodb+srv://liujiay:Kes%3F%3F17kot7adf@cluster0.g6whbar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('HW3');
    const favorites = database.collection('favorites');

    // Query for a movie that has the title 'Back to the Future'
    const query = { title: 'Back to the Future' };
    const favorite = await favorites.findOne(query);

    console.log(favorite);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);