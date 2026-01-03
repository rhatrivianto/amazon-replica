import Product from '../models/product.model.js';
export const checkStockAvailability = async (items) => {
  const results = await Promise.all(items.map(async item => {
    const product = await Product.findById(item.product).select('stock name').lean();
    return { id: item.product, available: product.stock >= item.quantity, name: product.name };
  }));
  return results;
};