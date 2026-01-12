import helmet from 'helmet';
import cors from 'cors';

export const securityMiddleware = [
  helmet(), // Mengamankan header HTTP
  cors({
    origin: (origin, callback) => {
      // 1. Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'];
      
      // 2. Allow specific domains or Local Network IPs (for Mobile Testing via WiFi)
      // Regex matches: http://192.168.x.x, http://10.x.x.x, etc.
      const isLocalNetwork = /^(http|https):\/\/(192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.)\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin);

      if (allowedOrigins.includes(origin) || isLocalNetwork) {
        return callback(null, true);
      }
      
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true
  })
];