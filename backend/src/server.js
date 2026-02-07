import "./config/env.js"; 
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import logger from "./lib/logger.js"; 
import { testMailConnection } from './lib/mail.js'; // 1. Impor fungsi test koneksi email

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const server = http.createServer(app);

const startServer = async () => {
  try {
    // 1. Connect Database
    await connectDB();
    
    // 2. Health Check Mail Server (Amazon Scale Practice)
    // Mengecek koneksi ke Mailtrap/SMTP sebelum server benar-benar melayani user
    await testMailConnection(); 
    
    // 3. Start Listening
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// AMAZON SCALE: Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated!');
  });
});

startServer();