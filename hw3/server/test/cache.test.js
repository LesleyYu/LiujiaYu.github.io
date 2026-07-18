const test = require('node:test');
const assert = require('node:assert');
const { getCached, setCached, deleteCached, clearCache, getCacheStats } = require('../src/cache');

test('setCached then getCached returns the value (hit)', () => {
  clearCache();
  setCached('k1', { a: 1 }, 1000);
  assert.deepStrictEqual(getCached('k1'), { a: 1 });
});

test('missing key returns undefined (miss)', () => {
  clearCache();
  assert.strictEqual(getCached('absent'), undefined);
});

test('entry expires after its TTL', async () => {
  clearCache();
  setCached('k2', 'v', 20);
  assert.strictEqual(getCached('k2'), 'v');
  await new Promise((resolve) => setTimeout(resolve, 40));
  assert.strictEqual(getCached('k2'), undefined);
});

test('deleteCached removes an entry', () => {
  clearCache();
  setCached('k3', 'v', 1000);
  assert.strictEqual(deleteCached('k3'), true);
  assert.strictEqual(getCached('k3'), undefined);
});

test('getCacheStats tracks hits and misses', () => {
  clearCache();
  setCached('k4', 'v', 1000);
  getCached('k4');
  getCached('absent');
  const stats = getCacheStats();
  assert.strictEqual(stats.hits, 1);
  assert.strictEqual(stats.misses, 1);
  assert.ok(stats.hitRate > 0 && stats.hitRate < 1);
});
