import "./config/env.js"; // Pastikan nama file env.js konsisten
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import logger from "./lib/logger.js"; // Gunakan logger Winston kita

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const server = http.createServer(app);

const startServer = async () => {
  try {
    // 1. Connect Database
    await connectDB();
    
    // 2. Start Listening
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// AMAZON SCALE: Graceful Shutdown
// Jika ada sinyal stop (dari PM2 atau Docker), tutup koneksi dengan rapi
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated!');
  });
});

startServer();

