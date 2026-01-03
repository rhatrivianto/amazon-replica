// backend/routes/auth.route.js
import express from 'express';
import { register, verifyEmail, login } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.get('/verify-email', verifyEmail);
router.post('/login', login); // Tambahkan baris ini

export default router;