import { env } from './env.js';

export const corsOptions = {
  origin: (origin, callback) => {
    // 1. Izinkan request tanpa origin (seperti Postman, Mobile Apps, atau Server-to-Server)
    if (!origin) return callback(null, true);

    // 2. Ambil Client URL dari env dengan aman (Handle jika undefined)
    // PENTING: Jika env.clientUrl kosong, gunakan string kosong agar tidak error saat .replace()
    const clientUrl = env.clientUrl || "";
    const normalizedClientUrl = clientUrl.replace(/\/$/, '');

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
      // LOGGING DETAIL: Cek tab "Logs" di Railway untuk melihat nilai asli yang diterima server
      console.error(`🚫 [CORS ERROR] Origin '${origin}' ditolak.`);
      console.error(`ℹ️ [DEBUG] CLIENT_URL di Server terbaca: '${clientUrl}'`);
      console.error(`✅ [ALLOWED LIST] ${JSON.stringify(allowedOrigins)}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
};