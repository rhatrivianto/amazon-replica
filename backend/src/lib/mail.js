import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from './logger.js';


dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const testMailConnection = async () => {
  try {
    await transporter.verify();
    logger.info('✅ Mail Server: Connected and Ready'); // Menggunakan Winston
  } catch (error) {
    logger.error('❌ Mail Server: Connection Error - ' + error.message);
  }
};
