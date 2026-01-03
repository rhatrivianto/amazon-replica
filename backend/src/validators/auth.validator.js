import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Nama wajib diisi',
    'string.min': 'Nama minimal 2 karakter'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Format email tidak valid'
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.pattern.base': 'Password harus mengandung huruf besar, kecil, dan angka'
    }),
  // FIX: Sinkron dengan user.model.js (user, admin, seller)
  role: Joi.string().valid('user', 'admin', 'seller').default('user')
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required()
});