import Voucher from '../models/voucher.model.js';

export const applyVoucher = async (code, orderAmount) => {
  // Atomic: Cari voucher yang aktif, belum expired, dan limit masih ada
  const voucher = await Voucher.findOneAndUpdate(
    { 
      code: code.toUpperCase(), 
      isActive: true, 
      usageLimit: { $gt: 0 },
      expiryDate: { $gt: new Date() },
      minOrderAmount: { $lte: orderAmount }
    },
    { $inc: { usageLimit: -1 } }, // Kurangi jatah secara langsung
    { new: true }
  ).lean();

  if (!voucher) throw new Error('Voucher invalid or expired');
  return voucher;
};