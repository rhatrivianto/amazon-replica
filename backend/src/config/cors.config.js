import { env } from './env.js';

export const corsOptions = {
  origin: (origin, callback) => {
    // 1. Izinkan request tanpa origin (seperti Postman, Mobile Apps, atau Server-to-Server)
    if (!origin) return callback(null, true);

    // 2. Normalisasi URL Client (Hapus trailing slash '/' jika ada di env)
    // Contoh: 'https://myapp.com/' menjadi 'https://myapp.com'
    const normalizedClientUrl = env.clientUrl.replace(/\/$/, '');

    // 3. Daftar Origin yang Diizinkan (Whitelist)
    // Kita tambahkan localhost secara eksplisit agar Anda bisa testing local -> prod
    const allowedOrigins = [
      normalizedClientUrl,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5000'
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // LOGGING PENTING: Cek tab "Logs" di Railway jika error muncul lagi
      console.error(`🚫 [CORS BLOCKED] Origin: '${origin}' tidak ada di whitelist.`);
      console.error(`✅ [ALLOWED LIST] ${JSON.stringify(allowedOrigins)}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
};