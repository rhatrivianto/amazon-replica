import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import * as userController from '../controllers/user.controller.js';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

// Semua rute di bawah ini wajib login
router.use(protect);

router.patch('/update-me', userController.updateMe);
router.patch('/update-my-password', authController.updateMyPassword);

export default router;