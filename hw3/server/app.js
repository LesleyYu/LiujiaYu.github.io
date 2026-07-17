var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// Load environment variables
// require('dotenv').config();
require('dotenv').config({ path: path.join(__dirname, '.env') });


// ====== MongoDB Integration ======
const connectDB = require('./src/database/index');
// Connect to MongoDB before setting up the server
connectDB();
// ====== end MongoDB Integration ======


// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

// request-scoped context (request id + start time) — must run first
var { attachRequestContext } = require('./src/middleware/requestContext');
app.use(attachRequestContext);

// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// serve static files from the 'public' dir  within the server folder
app.use(express.static(path.join(__dirname, './static')));

// routers
var artsyRouter = require('./src/routes/artsyRoutes');
var apiRouter = require('./src/routes/apiRoutes');
// Mount API routes first (so these are handled before serving the SPA)
app.use('/api/user', apiRouter);
app.use('/api/', artsyRouter);

// ====== Static File Routes ===== 
// // --- Serve static files from the React app build directory ---
// app.use(express.static(path.join(__dirname, '../client/build')));

// // The "catchall" handler: for any request that doesn't match an API route, send back React's index.html file.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
// });
// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// "Catchall" route: for any request that doesn’t match an API route,
// send back React's index.html file from the "public" folder.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './static', 'index.html'));
});

// ====== Static File Routes end ===== 


// catch 404 and forward to the centralized error handler
var { notFoundHandler, centralizedErrorHandler } = require('./src/middleware/errorHandler');
app.use(notFoundHandler);

// centralized error handler — contextual logging, operational/programmer split, JSON/HTML negotiation
app.use(centralizedErrorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
