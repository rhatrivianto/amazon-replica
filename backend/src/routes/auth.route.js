import express from 'express';
import { 
  register, 
  verifyEmail, 
  login, 
  registerSeller, 
  forgotPassword, 
  resetPassword 
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authLimiter } from '../middlewares/rateLimit.middleware.js'; // Import limiter

const router = express.Router();

// Gunakan authLimiter pada rute yang rawan serangan brute force
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.patch('/reset-password/:token', authLimiter, resetPassword);

// Rute ini tidak butuh limiter ketat (cukup globalLimiter dari app.js)
router.get('/verify-email', verifyEmail);
router.post('/register-seller', protect, registerSeller);


export default router;