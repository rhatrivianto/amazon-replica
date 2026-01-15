import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from './logger.js';


dotenv.config();

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Port 587 menggunakan STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS?.replace(/\s+/g, ''), // Hapus spasi otomatis
  },
  pool: true, // Gunakan koneksi pool untuk efisiensi
});

export const testMailConnection = async () => {
  transporter.verify((error, success) => {
    if (error) {
      logger.error('❌ Mail Server: Connection Error (Skipped to avoid 502) - ' + error.message);
    } else {
      logger.info('✅ Mail Server: Connected and Ready');
    }
  });
};
