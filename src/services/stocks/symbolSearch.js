/**
 * Ticker / company type-ahead for the Trade Journal, backed by the
 * /api/symbol-search Vercel function (Yahoo Finance search). Results are
 * memoised per query for the page's lifetime.
 */
const cache = new Map();

export async function searchSymbols(q) {
  const key = q.trim().toLowerCase();
  if (!key) return [];
  if (!cache.has(key)) {
    const p = fetch(`/api/symbol-search?q=${encodeURIComponent(key)}`)
      .then(r => (r.ok ? r.json() : { results: [] }))
      .then(d => (Array.isArray(d.results) ? d.results : []))
      .catch(() => []);
    cache.set(key, p);
    p.then(list => {
      if (!list.length) cache.delete(key); // retry failures / empties later
    });
  }
  return cache.get(key);
}
