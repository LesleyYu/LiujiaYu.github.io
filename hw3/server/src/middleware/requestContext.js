const crypto = require('crypto');

// Attaches a per-request id and a high-resolution start time so the centralized error handler
// (and any logging) can report request-scoped context. Honors an inbound X-Request-Id if a proxy
// already set one, otherwise generates a UUID. Runs first in the middleware chain.
function attachRequestContext(req, res, next) {
  const inboundId = req.headers['x-request-id'];
  req.id = inboundId && String(inboundId).trim() !== '' ? String(inboundId) : crypto.randomUUID();
  req.startTime = process.hrtime.bigint();
  res.setHeader('X-Request-Id', req.id);
  res.locals.requestId = req.id;
  next();
}

module.exports = { attachRequestContext };
