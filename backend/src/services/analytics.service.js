import Order from '../models/order.model.js';
import User from '../models/user.model.js';

export const getSalesStats = async () => {
  const stats = await Order.aggregate([
    { $match: { status: 'paid' } }, // Hanya hitung yang sudah bayar
    {
      $group: {
        _id: { $month: "$createdAt" }, // Kelompokkan per bulan
        totalRevenue: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
        avgOrderValue: { $avg: "$totalAmount" }
      }
    },
    { $sort: { "_id": 1 } }
  ]);
  return stats;
};

export const getDashboardSummary = async () => {
  const [orderStats, userCount] = await Promise.all([
    getSalesStats(),
    User.countDocuments()
  ]);

  return {
    revenueByMonth: orderStats,
    totalUsers: userCount,
    timestamp: new Date()
  };
};