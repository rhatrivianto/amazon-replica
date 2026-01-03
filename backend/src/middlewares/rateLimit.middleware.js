import rateLimit from 'express-rate-limit';
import AppError from '../utils/AppError.js';

/**
 * Limit umum untuk semua request API
 * Menjaga stabilitas server dari trafik bot yang berlebihan
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Maksimal 100 request per IP dalam 15 menit
  message: 'Too many requests from this IP, please try again after 15 minutes',
  handler: (req, res, next, options) => {
    next(new AppError(options.message, 429));
  },
  standardHeaders: true, // Kembalikan info limit di headers `RateLimit-*`
  legacyHeaders: false, // Matikan headers `X-RateLimit-*` yang lama
});

/**
 * Limit ketat khusus untuk Auth (Login/Register)
 * Mencegah serangan Brute Force pada akun user
 */
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 5, // Maksimal 5 percobaan gagal per jam
  message: 'Too many login attempts, please try again after an hour',
  handler: (req, res, next, options) => {
    next(new AppError(options.message, 429));
  }
});