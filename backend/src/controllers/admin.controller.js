// controllers/admin.controller.js
import { asyncHandler } from '../utils/asyncHandler.js';
import * as userService from '../services/user.service.js';
import * as productService from '../services/product.service.js';
import * as orderService from '../services/order.service.js';
import databaseOrchestrator from '../scripts/databaseOrchestrator.js';

// 1. Dashboard Summary (Statistik Skala Amazon)
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [userStats, salesStats, inventoryAlerts] = await Promise.all([
    userService.getUserStats(),
    orderService.getSalesStats(),
    productService.getInventoryAlerts()
  ]);

  res.status(200).json({ 
    status: 'success', 
    data: {
      users: userStats,
      sales: salesStats[0] || { totalRevenue: 0, totalOrders: 0 },
      inventory: inventoryAlerts
    } 
  });
});

// 2. Statistik Umum untuk rute /stats
export const getStats = asyncHandler(async (req, res) => {
  const stats = await orderService.getSalesStats();
  
  res.status(200).json({
    status: 'success',
    data: stats[0] || { totalRevenue: 0, totalOrders: 0 }
  });
});

// 3. Database Health Check
export const getDatabaseHealth = asyncHandler(async (req, res) => {
  const health = await databaseOrchestrator.getSystemStatus();
  res.status(200).json({ status: 'success', data: health });
});

// 4. Database Backup
export const runBackup = asyncHandler(async (req, res) => {
  const backup = await databaseOrchestrator.backup.createBackup();
  res.status(200).json({ status: 'success', message: 'Backup created', file: backup });
});
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  const user = await User.findOne({ email });

  if (!user || user.role !== 'admin') {
    return res.status(401).json({ message: 'Admin tidak ditemukan' });
  }

  if (!user.isVerified) {
    return res.status(401).json({ message: 'Akun belum diverifikasi' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Password salah' });
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user._id, role: user.role },
    env.jwtSecret,
    { expiresIn: '1d' }
  );

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role
    }
  });
});