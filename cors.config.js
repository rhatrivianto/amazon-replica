import { env } from './env.js';

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowedOrigins = [env.clientUrl, 'http://localhost:5173', 'http://localhost:3000'];
    const isLocalNetwork = /^(http|https):\/\/(192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin);

    if (allowedOrigins.includes(origin) || isLocalNetwork) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
