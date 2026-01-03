import Brand from '../models/brand.model.js';
import  { asyncHandler } from '../utils/asyncHandler.js';

export const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({ isActive: true }).sort({ name: 1 });
  res.json({ status: 'success', data: brands });
});

export const createBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.create(req.body);
  res.status(201).json({ status: 'success', data: brand });
});