import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { loginLimiter, accountActionLimiter } from '../middlewares/rateLimit.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Terapkan limiter yang sesuai untuk setiap endpoint
router.post('/register', accountActionLimiter, authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/forgot-password', accountActionLimiter, authController.forgotPassword);
router.patch('/reset-password/:token', accountActionLimiter, authController.resetPassword);

// Endpoint ini tidak terlalu sensitif terhadap brute-force, bisa tanpa limiter spesifik
router.get('/verify-email', authController.verifyEmail);

// Endpoint untuk refresh access token menggunakan refresh token dari cookie
router.post('/refresh-token', authController.refreshToken);

router.post('/register-seller', protect, authController.registerSeller);

export default router;