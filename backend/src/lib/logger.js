import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Simpan error ke file terpisah
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Simpan semua log ke combined.log
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Selalu log ke Console (agar muncul di Dashboard Railway/Vercel)
logger.add(new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
}));

export default logger;