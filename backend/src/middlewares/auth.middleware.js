import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

/**
 * AUTHENTICATION: Mengecek apakah user sudah login (punya token valid)
 */
export const protect = asyncHandler(async (req, res, next) => {
  // 1. Ambil token
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Cek jika token tidak ada
  if (!token) return next(new AppError('Unauthorized. Please login.', 401));

  // 3. Verifikasi token (Membongkar segel digital)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 4. Cek apakah user pemilik token masih ada di database
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new AppError('User no longer exists.', 401));

  // 5. Cek apakah user ganti password setelah token ini dibuat (Keamanan Ekstra)
  if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password. Please login again.', 401));
  }

  // SIMPAN USER KE REQUEST: Ini adalah kunci agar restrictTo bisa bekerja
  req.user = currentUser;
  next();
});

/**
 * AUTHORIZATION: Mengecek jabatan (Role) user
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user didapat dari middleware 'protect' di atas
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};