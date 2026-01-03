import User from '../models/user.model.js';
import AppError  from '../utils/AppError.js';

// Menemukan semua user dengan pagination (Penting untuk data besar)
export const findAllUsers = async (query) => {
  const users = await User.find().select('-password'); 
  return users;
};

// Memberi sanksi/Banned user (Fitur Amazon Admin)
export const updateUserStatus = async (userId, status) => {
  const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

// Statistik untuk Dashboard
export const getUserStats = async () => {
  return await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);
};