import Brand from '../models/brand.model.js';
export const getAllBrands = () => Brand.find().lean();
export const createBrand = (data) => Brand.create(data);