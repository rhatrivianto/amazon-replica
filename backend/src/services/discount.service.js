import AppError from '../utils/AppError.js';
// Nantinya import Discount dari Models
// import Discount from '../models/discount.model.js';

export const calculateDiscount = async (price, discountCode) => {
  // Skala Amazon: Cek ke Database (Dummy logic for now)
  const promo = { code: 'PROMO2025', rate: 0.1, expiry: new Date('2026-01-01'), active: true };

  if (discountCode !== promo.code) throw new AppError('Invalid discount code', 400);
  if (new Date() > promo.expiry) throw new AppError('Code expired', 400);

  const discountAmount = price * promo.rate;
  return {
    originalPrice: price,
    discountAmount: discountAmount,
    finalPrice: price - discountAmount
  };
};

export const createDiscountRule = async (data) => {
  // Validasi data input sebelum simpan
  if (!data.code || !data.rate) throw new AppError('Code and Rate are required', 400);
  return { ...data, createdAt: new Date() };
};

export const getActivePromotions = async () => {
  // Logika filter promo yang isActive: true
  return [
    { name: "Year End Sale", code: "YES2025", active: true },
    { name: "New User Promo", code: "HELLO", active: true }
  ];
};