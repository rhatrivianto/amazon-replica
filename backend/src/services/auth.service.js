import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import crypto from 'crypto';

export const registerUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) throw new Error('User already exists');
  
  return await User.create(userData);
};

export const loginUser = async (email, password) => {
  // Sertakan password secara eksplisit jika di model di-set select: false
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid credentials');
  }

  const tokens = generateTokens(user);
  return { user, ...tokens };
};

export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn || '15m' }
  );
  
  const refreshToken = jwt.sign(
    { id: user._id },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshExpiresIn || '7d' }
  );
  
  return { accessToken, refreshToken };
};

export const refreshUserToken = async (token) => {
  const decoded = jwt.verify(token, env.jwtRefreshSecret);
  const user = await User.findById(decoded.id);
  if (!user) throw new Error('User not found');
  
  return generateTokens(user);
};

/**
 * Service murni untuk mencari user dan generate token
 */
export const validateForgotPasswordRequest = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  
  return { user, resetToken };
};

/**
 * Service murni untuk reset password
 */
export const resetUserPassword = async (token, newPassword) => {
  // 1. Hash token dari URL untuk dicocokkan dengan yang ada di DB
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // 2. Cari user yang memiliki token valid dan belum expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 3. Jika tidak ditemukan, kembalikan null
  if (!user) return null;

  // 4. Update password (middleware 'pre-save' di model akan otomatis melakukan hashing)
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  
  await user.save();
  
  return user;
};