import AppError from '../utils/AppError.js';
import logger from '../lib/logger.js';


// Handler: Error MongoDB Nilai Duplikat (11000)
const handleDuplicateFieldsDB = (err) => {
  // Mengambil nilai di dalam tanda kutip dari pesan error MongoDB
  const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : 'Unknown';
  const message = `Nilai duplikat: ${value}. Silakan gunakan nilai lain!`;
  return new AppError(message, 400);
};

// Handler: Error Validasi Mongoose
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Data tidak valid: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Handler: Error Cast (ID Salah Format)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    // DEV: Kirim detail lengkap untuk debugging
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    // PROD: Kirim pesan yang aman dan user-friendly
    let error = { ...err };
    error.message = err.message;

    // Deteksi Error Spesifik Database
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'CastError') error = handleCastErrorDB(error);

    // Kirim Response
    res.status(error.statusCode || 500).json({
      status: error.status || 'error',
      message: error.isOperational ? error.message : 'Terjadi kesalahan sistem yang tidak terduga',
    });
    // --- BAGIAN PENTING: CATAT KE BUKU LOG JIKA RUSAK PARAH ---
    if (!err.isOperational) {
      logger.error({
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method
      });
  };
}};