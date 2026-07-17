const createError = require('http-errors');

// Wrap an async route handler so a rejected promise is forwarded to the centralized error handler
// instead of crashing the process. Lets handlers `throw` instead of writing error responses inline.
function asyncHandler(handlerFn) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(handlerFn(req, res, next)).catch(next);
  };
}

// Catch-all for unmatched routes: turn into a 404 that flows through the error handler.
function notFoundHandler(req, res, next) {
  next(createError(404));
}

// Operational error = expected and safe to surface (validation, 4xx, http-errors with `expose`).
// Programmer error = unexpected bug/exception → treated as 500 and logged with a stack trace.
function isOperationalError(err) {
  if (err.expose === true) {
    return true;
  }
  const status = err.status || err.statusCode;
  return typeof status === 'number' && status >= 400 && status < 500;
}

function resolveUserId(req) {
  if (!req.user) {
    return null;
  }
  return req.user.id || req.user._id || req.user.userId || null;
}

function logError(req, err, status, operational) {
  const durationMs = req.startTime
    ? Number(Number(process.hrtime.bigint() - req.startTime) / 1e6).toFixed(1)
    : null;
  const logPayload = {
    ts: new Date().toISOString(),
    level: operational ? 'warn' : 'error',
    type: operational ? 'operational' : 'programmer',
    requestId: req.id || null,
    method: req.method,
    path: req.originalUrl,
    status,
    durationMs: durationMs !== null ? Number(durationMs) : null,
    userId: resolveUserId(req),
    message: err.message
  };
  if (operational) {
    console.warn('[error]', JSON.stringify(logPayload));
    return;
  }
  console.error('[error]', JSON.stringify(logPayload));
  console.error(err.stack);
}

// Centralized Express error handler (registered last). Logs request-scoped context, distinguishes
// operational vs programmer errors, and negotiates the response: JSON for API/JSON clients, the pug
// error page otherwise. Never leaks internal messages/stacks for programmer errors in production.
function centralizedErrorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const operational = isOperationalError(err);
  logError(req, err, status, operational);

  const isDevelopment = req.app.get('env') === 'development';
  const wantsJson = req.originalUrl.startsWith('/api') || req.accepts(['html', 'json']) === 'json';

  if (wantsJson) {
    const clientMessage = operational ? err.message : 'Internal Server Error';
    const errorBody = { message: clientMessage, requestId: req.id || null };
    if (isDevelopment && !operational) {
      errorBody.details = err.stack;
    }
    return res.status(status).json({ error: errorBody });
  }

  res.locals.message = err.message;
  res.locals.error = isDevelopment ? err : {};
  res.status(status);
  res.render('error');
}

module.exports = {
  asyncHandler,
  notFoundHandler,
  centralizedErrorHandler,
  isOperationalError
};
