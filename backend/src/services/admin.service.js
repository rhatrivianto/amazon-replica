// backend/src/services/admin.service.js
import User from '../models/user.model.js';
import Product from '../models/product.model.js'; // Pastikan diimport

export const getAdminDashboardStats = async () => {
  const [userCount, productCount, totalSales] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    // Contoh tambahan: Menghitung total produk out of stock untuk dashboard admin
    Product.countDocuments({ stock: 0 }) 
  ]);

  return { 
    userCount, 
    productCount,
    outOfStockCount: totalSales // Admin butuh info ini untuk restock
  };
};