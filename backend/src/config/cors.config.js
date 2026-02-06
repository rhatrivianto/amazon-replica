import { env } from './env.js';

export const corsOptions = {
  origin: (origin, callback) => {
    // 1. Izinkan request tanpa origin (seperti Postman atau mobile)
    if (!origin) return callback(null, true);

    const clientUrl = env.clientUrl || "";
    let normalizedClientUrl = clientUrl.replace(/\/$/, '');
    if (normalizedClientUrl && !normalizedClientUrl.startsWith('http')) {
      normalizedClientUrl = `https://${normalizedClientUrl}`;
    }

    const allowedOrigins = [
      normalizedClientUrl,
      'https://amazon-replica-n713.vercel.app', // Domain Utama Anda
      'http://localhost:5173',
      'http://localhost:3000'
    ];

    // 2. LOGIKA AMAZON STYLE: Izinkan semua subdomain Vercel milik proyek Anda
    // Ini mencakup URL panjang yang tadi muncul di error log
    const vercelPreviewPattern = /^https:\/\/amazon-replica-n713-.*-rully-hatriviantos-projects\.vercel\.app$/;
    const isVercelPreview = vercelPreviewPattern.test(origin);

    if (allowedOrigins.includes(origin) || isVercelPreview || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      console.error(`🚫 [CORS ERROR] Origin '${origin}' ditolak.`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
};