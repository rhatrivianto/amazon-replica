import Coupon from '../models/coupon.model.js';

export const validateCoupon = async (code) => {
  return await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    expiryDate: { $gt: new Date() } // Cek kadaluarsa langsung di DB
  }).lean();
};

export const useCouponAtomic = async (code) => {
  return await Coupon.findOneAndUpdate(
    { code: code, usageLimit: { $gt: 0 } },
    { $inc: { usageLimit: -1 } },
    { new: true }
  );
};