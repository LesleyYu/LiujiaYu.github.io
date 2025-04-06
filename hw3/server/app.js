var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// Load environment variables
require('dotenv').config();

// Import configuration
var config = require('./config');



// ====== MongoDB Integration ======
// set up your connection URI.
// web address: https://cloud.mongodb.com/v2/67f07136e671d5222fab19b9#/metrics/replicaSet/67f0716dee8b3c6ee0d25d2f/explorer/HW3/users/find

// ------ 1. Native MongoDB Client (removed) ------
// const { MongoClient } = require('mongodb');

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

// Define the MongoDB URI.  (Removed. Now imported thru the config.js and .env)
// If process.env.MONGO_URI is set (e.g., in production), it will be used.
// Otherwise, fallback to a local MongoDB instance for development.
// const localUri = 'mongodb://localhost:27017/HW3';
// const mongoUri = process.env.MONGO_URI || localUri;
mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`Connected to MongoDB at ${config.mongoUri}`);
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

// ====== end MongoDB Integration ======



// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// serve static files from the 'public' dir
app.use(express.static(path.join(__dirname, 'public')));

// routers
var artsyRouter = require('./src/routes/artsyRoutes');
var apiRouter = require('./src/routes/apiRoutes');
app.use('/artsy', artsyRouter);
app.use('/api', apiRouter);

// ----- Static File Routes ----- 
// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../client/build')));

// The "catchall" handler: for any request that doesn't match an API route, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
