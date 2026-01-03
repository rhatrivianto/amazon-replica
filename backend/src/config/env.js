import dotenv from 'dotenv';
dotenv.config();

const requiredEnvs = [
  'MONGO_URI',
  'JWT_SECRET',
  'CLIENT_URL',
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
  jwtExpires: process.env.JWT_EXPIRES || '1d',
  // TAMBAHKAN INI agar bisa dipanggil di controller
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173', 
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