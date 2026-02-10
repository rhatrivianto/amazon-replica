import AppError from '../utils/AppError.js';
import logger from '../lib/logger.js';


// Handler: Error MongoDB Nilai Duplikat (11000)
const handleDuplicateFieldsDB = (err) => {
  // 1. Coba ambil dari err.keyValue (Cara Modern & Lebih Akurat)
  if (err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    // Handle jika value adalah null (misal slug gagal generate)
    const displayValue = value === null ? 'null' : value === '' ? 'String Kosong' : value;
    const message = `Duplicate value for field '${field}': ${displayValue}. Please use another value.`;
    return new AppError(message, 400);
  }

  // 2. Fallback: Parsing pesan error string (Cara Lama)
  const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/) : null;
  if (value) {
    const message = `Duplicate value: ${value[0]}. Please use another value.`;
    return new AppError(message, 400);
  }

  // 3. Fallback Terakhir: Tebak field dari pesan error index
  // Contoh: "... index: slug_1 dup key: { slug: null }"
  const fieldMatch = err.message ? err.message.match(/index: (\w+)_\d+/) : null;
  const fieldName = fieldMatch ? fieldMatch[1] : 'Unknown Field';
  return new AppError(`Duplicate value detected on field '${fieldName}'.`, 400);
};

// Handler: Error Validasi Mongoose
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
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

  // --- FIX: Deteksi Error DB di Development & Production ---
  // Kita proses errornya dulu agar statusCode-nya benar (misal: Duplicate jadi 400, bukan 500)
  let error = { ...err };
  error.message = err.message;

  // Deteksi Error Spesifik Database
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'CastError') error = handleCastErrorDB(error);

  // --- FIX: Deteksi Error dari Stripe ---
  // Izinkan pesan error Stripe lolos ke frontend (Operational Error)
  if (err.type && err.type.startsWith('Stripe')) {
    error.isOperational = true;
  }

  if (process.env.NODE_ENV === 'development') {
    // DEV: Kirim detail lengkap untuk debugging
    // Gunakan statusCode dari error yang sudah diproses (error.statusCode)
    res.status(error.statusCode || 500).json({
      status: error.status || 'error',
      message: error.message, // Pesan yang sudah diperjelas (misal: "Nilai duplikat...")
      error: err,
      stack: err.stack,
    });
  } else {
    // PROD: Kirim pesan yang aman dan user-friendly

    // Kirim Response
    res.status(error.statusCode || 500).json({
      status: error.status || 'error',
      message: error.isOperational ? error.message : 'An unexpected failure occurred. Please try again later.',
    });
    // --- BAGIAN PENTING: CATAT KE BUKU LOG JIKA RUSAK PARAH ---
    if (!err.isOperational) {
      logger.error({
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method
      });
    }
  }
};