import User from '../models/user.model.js';
export const getAdminDashboardStats = async () => {
  const [userCount, productCount] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments()
  ]);
  return { userCount, productCount };
};