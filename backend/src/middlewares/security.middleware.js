import helmet from 'helmet';
import cors from 'cors';

export const securityMiddleware = [
  helmet(), // Mengamankan header HTTP
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true
  })
];