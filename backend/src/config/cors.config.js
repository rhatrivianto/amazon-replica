import { env } from './env.js';

export const corsOptions = {
  origin: (origin, callback) => {
    // 1. Izinkan request tanpa origin (Postman, Mobile, dll)
    if (!origin) return callback(null, true);

    const clientUrl = env.clientUrl || "";
    let normalizedClientUrl = clientUrl.replace(/\/$/, '');

    if (normalizedClientUrl && !normalizedClientUrl.startsWith('http')) {
      normalizedClientUrl = `https://${normalizedClientUrl}`;
    }

    const allowedOrigins = [
      normalizedClientUrl,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000'
    ];

    // LOGIKA DINAMIS: Izinkan jika ada di list ATAU berasal dari domain vercel.app milik Anda
    const isAllowedVercel = origin.endsWith('.vercel.app') && origin.includes('rully-hatriviantos-projects');

    if (allowedOrigins.includes(origin) || isAllowedVercel) {
      callback(null, true);
    } else {
      console.error(`🚫 [CORS ERROR] Origin '${origin}' ditolak.`);
      console.error(`✅ [DEBUG] Hanya mengizinkan: ${JSON.stringify(allowedOrigins)} dan subdomain Vercel Anda.`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
};