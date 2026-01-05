import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { login } from '../controllers/auth.controller.js'; // Import fungsi login
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

// 1. RUTE PUBLIK (Bisa diakses tanpa token)
// Harus di atas router.use(protect)
router.post('/login', login); 

// 2. PROTEKSI (Mulai dari sini ke bawah butuh token & role admin)
router.use(protect, restrictTo('admin'));

// 3. RUTE PRIVATE ADMIN
router.get('/dashboard', adminController.getDashboardStats);
router.get('/stats', adminController.getStats);
router.get('/db-health', adminController.getDatabaseHealth);
router.post('/db-backup', adminController.runBackup);

export default router;