// Minimal in-process TTL cache.
// Stores key -> { value, expiresAt }. On read, expired entries are evicted and treated as a miss.
// Insertion order is used as an approximate-LRU bound via maxEntries. This cache is per-process:
// it does not survive a restart and is not shared across instances, which is acceptable for the
// low-volatility, rate-limited Artsy data it fronts.

const store = new Map();
const maxEntries = 500;

let hitCount = 0;
let missCount = 0;

function getCached(key) {
  const entry = store.get(key);
  if (!entry) {
    missCount += 1;
    return undefined;
  }
  if (Date.now() >= entry.expiresAt) {
    store.delete(key);
    missCount += 1;
    return undefined;
  }
  // touch for approximate-LRU ordering
  store.delete(key);
  store.set(key, entry);
  hitCount += 1;
  return entry.value;
}

function setCached(key, value, ttlMs) {
  if (store.has(key)) {
    store.delete(key);
  }
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
  while (store.size > maxEntries) {
    const oldestKey = store.keys().next().value;
    store.delete(oldestKey);
  }
}

function deleteCached(key) {
  return store.delete(key);
}

function clearCache() {
  store.clear();
  hitCount = 0;
  missCount = 0;
}

function getCacheStats() {
  const total = hitCount + missCount;
  return {
    size: store.size,
    hits: hitCount,
    misses: missCount,
    hitRate: total === 0 ? 0 : hitCount / total
  };
}

module.exports = {
  getCached,
  setCached,
  deleteCached,
  clearCache,
  getCacheStats
};
