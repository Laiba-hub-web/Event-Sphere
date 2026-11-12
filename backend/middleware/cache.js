/**
 * Fast in-memory GET response cache middleware.
 * Eliminates sluggish MongoDB Atlas round-trip delays when navigating pages.
 * Automatically invalidates whenever any write (POST/PUT/PATCH/DELETE) occurs.
 */
const apiCache = new Map();
const DEFAULT_TTL = 45 * 1000; // 45 seconds

const cacheMiddleware = (req, res, next) => {
  // Any mutating request immediately clears the cache so data is always fresh
  if (req.method !== 'GET') {
    apiCache.clear();
    return next();
  }

  // Do not cache auth/me or health checks
  if (req.originalUrl.startsWith('/api/auth/me') || req.originalUrl.startsWith('/api/health')) {
    return next();
  }

  const authHeader = req.headers.authorization || 'public';
  const cacheKey = `${authHeader}:${req.originalUrl}`;

  const cachedEntry = apiCache.get(cacheKey);
  if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
    return res.status(200).json(cachedEntry.body);
  }

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode === 200 && body && body.success !== false) {
      apiCache.set(cacheKey, {
        body,
        expiresAt: Date.now() + DEFAULT_TTL,
      });
    }
    return originalJson(body);
  };

  next();
};

const clearApiCache = () => apiCache.clear();

module.exports = { cacheMiddleware, clearApiCache };

