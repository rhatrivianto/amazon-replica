import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

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
    console.log('✅ Mail Server: Connected');
  } catch (error) {
    console.log('❌ Mail Server: Error', error.message);
  }
};