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