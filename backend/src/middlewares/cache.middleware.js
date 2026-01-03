// Sederhananya menggunakan mem-cache, namun di skala Amazon nantinya ini diganti Redis
let cache = new Map();

export const cacheMiddleware = (duration) => (req, res, next) => {
  const key = req.originalUrl || req.url;
  const cachedResponse = cache.get(key);

  if (cachedResponse && cachedResponse.expires > Date.now()) {
    return res.status(200).json(cachedResponse.data);
  }

  // Override res.json untuk menyimpan data ke cache sebelum dikirim
  const originalJson = res.json;
  res.json = (body) => {
    cache.set(key, {
      data: body,
      expires: Date.now() + duration * 1000
    });
    return originalJson.call(res, body);
  };
  next();
};