import Category from '../models/category.model.js';

export const createCategory = async (data) => {
  return await Category.create(data);
};

/**
 * Mengambil Kategori dalam bentuk Pohon (Tree Structure)
 * Level 1 (Root) -> Level 2 (Children) -> Level 3 (Grandchildren)
 * Amazon biasanya memiliki kedalaman 3-4 level.
 */
export const getAllCategories = async () => {
  try {
    // 1. Ambil hanya kategori yang TIDAK punya parent (Root Categories)
    const result = await Category.find({ parent: null })
      // 2. Populate Anak (Level 2)
      .populate({
        path: 'children', // Level 2
        strictPopulate: false,
        populate: { 
          path: 'children', // Level 3
          strictPopulate: false,
          populate: {
            path: 'children', // Level 4
            strictPopulate: false,
            populate: {
              path: 'children', // Level 5
              strictPopulate: false
            }
          }
        }
      })
      .sort({ name: 1 }) // Urutkan A-Z
      .lean();
      
    return result;
  } catch (err) {
    console.error("SERVICE ERROR:", err);
    throw err;
  }
};

export const getCategoryById = async (id) => {
  return await Category.findById(id).lean();
};

export const getCategoryWithAllDescendants = async (categoryId) => {
  // Ambil kategori ini dan semua sub-kategorinya
  const categories = await Category.find({ 
    $or: [{ _id: categoryId }, { parent: categoryId }] 
  }).select('_id');
  
  const categoryIds = categories.map(cat => cat._id);
  return categoryIds; // Gunakan array ini untuk Product.find({ category: { $in: categoryIds } })
};

export const updateCategory = async (id, data) => {
  return await Category.findByIdAndUpdate(id, data, { new: true }).lean();
};

export const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};