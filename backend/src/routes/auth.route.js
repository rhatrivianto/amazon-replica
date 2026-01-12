// backend/routes/auth.route.js
import express from 'express';
import { register, verifyEmail, login, registerSeller } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login); // Tambahkan baris ini
router.post('/register-seller', protect, registerSeller);

export default router;