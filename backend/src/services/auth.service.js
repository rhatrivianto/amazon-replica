import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

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
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

export const refreshUserToken = async (token) => {
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) throw new Error('User not found');
  
  return generateTokens(user);
};