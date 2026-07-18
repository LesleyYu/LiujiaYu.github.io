const test = require('node:test');
const assert = require('node:assert');
const createError = require('http-errors');
const { isOperationalError } = require('../src/middleware/errorHandler');

test('4xx http-errors are operational', () => {
  assert.strictEqual(isOperationalError(createError(404)), true);
  assert.strictEqual(isOperationalError(createError(400, 'bad request')), true);
});

test('5xx and plain errors are programmer errors', () => {
  assert.strictEqual(isOperationalError(createError(500)), false);
  assert.strictEqual(isOperationalError(new Error('boom')), false);
});

test('explicit expose flag marks an error operational', () => {
  const err = new Error('surface me');
  err.expose = true;
  assert.strictEqual(isOperationalError(err), true);
});
