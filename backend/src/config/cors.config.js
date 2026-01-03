import { env } from './env.js';

export const corsOptions = {
  origin: (origin, callback) => {
    // Gunakan Ternary Operator (? :) untuk menentukan whitelist
    const allowedOrigins = env.nodeEnv === 'production'
      ? [env.clientUrl] // Production: Ketat (Hanya URL Vercel)
      : [env.clientUrl, 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000']; // Dev: Longgar (Boleh Localhost)
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};