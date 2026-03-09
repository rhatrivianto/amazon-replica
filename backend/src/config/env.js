import dotenv from 'dotenv';
dotenv.config();

const requiredEnvs = [
  'MONGO_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'CLIENT_URL',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
];

const missingEnvs = requiredEnvs.filter((envName) => !process.env[envName]);

if (missingEnvs.length > 0) {
  throw new Error(`❌ Missing required Environment Variables: ${missingEnvs.join(', ')}`);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT ? Number(process.env.PORT) : 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m', // FIX: Ganti nama agar konsisten
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET, // TAMBAHKAN: Refresh token secret
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d', // TAMBAHKAN: Masa berlaku refresh token
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173', 
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.trim() : undefined, // FIX: Hapus spasi tidak sengaja
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? process.env.STRIPE_WEBHOOK_SECRET.trim() : undefined,
  cloudinary: {
    name: process.env.CLOUDINARY_CLOUD_NAME,
    key: process.env.CLOUDINARY_API_KEY,
    secret: process.env.CLOUDINARY_API_SECRET
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};