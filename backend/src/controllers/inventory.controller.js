import * as inventoryService from '../services/inventory.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const checkStock = asyncHandler(async (req, res) => {
  const availability = await inventoryService.checkStockAvailability(req.body.items);
  res.status(200).json({ status: 'success', data: availability });
});
export const getInventoryDashboard = asyncHandler(async (req, res, next) => {
  // 1. Menghitung total produk, total nilai stok, dan produk yang hampir habis
  const stats = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalStockValue: { $sum: { $multiply: ['$price', '$stock'] } },
        lowStockItems: {
          $sum: { $cond: [{ $lte: ['$stock', 10] }, 1, 0] }
        }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats: stats[0] || { totalProducts: 0, totalStockValue: 0, lowStockItems: 0 }
    }
  });
});
export const getAuditLogs = asyncHandler(async (req, res, next) => {
  // 1. Mengambil catatan aktivitas terbaru
  // 2. Populate 'user' untuk melihat siapa admin yang melakukan aksi tersebut
  const logs = await AuditLog.find()
    .populate('user', 'name email')
    .sort('-createdAt')
    .limit(100); // Batasi 100 log terbaru

  res.status(200).json({
    status: 'success',
    results: logs.length,
    data: { logs }
  });
});;
