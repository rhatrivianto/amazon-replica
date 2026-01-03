import Product from '../models/product.model.js';
export const searchProducts = async (term) => {
  return await Product.find({
    $or: [
      { name: { $regex: term, $options: 'i' } },
      { description: { $regex: term, $options: 'i' } }
    ]
  }).limit(20).lean();
};