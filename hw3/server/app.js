var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// Load environment variables
require('dotenv').config();


// ====== MongoDB Integration ======
const connectDB = require('./src/database/index');
// Connect to MongoDB before setting up the server
connectDB();
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
app.use('/', artsyRouter);
app.use('/user', apiRouter);

// ====== Static File Routes ===== 
// --- a. Serve static files from the view directory (Removed) (Originally in routes_depr/index.js.) ---

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

// // --- b. Serve static files from the React app build directory ---
// app.use(express.static(path.join(__dirname, '../client/build')));

// // The "catchall" handler: for any request that doesn't match an API route, send back React's index.html file.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
// });
// ====== Static File Routes end ===== 


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
