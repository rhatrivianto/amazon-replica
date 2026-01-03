import Category from '../models/category.model.js';

export const createCategory = async (data) => {
  return await Category.create(data);
};

// export const getAllCategories = async () => {
//   // Hanya ambil kategori level teratas (parent: null)
//   // Lalu populate 'children' untuk mendapatkan sub-kategori
//   return await Category.find({ parent: null })
//     .populate({
//       path: 'children',
//       populate: { path: 'children' } // Ini untuk mengambil sub-sub-category (Level 3)
//     })
//     .sort({ name: 1 })
//     .lean({ virtuals: true });
// };

export const getAllCategories = async () => {
  try {
    // Gunakan find biasa dulu tanpa populate untuk ngetes apakah error hilang
    const result = await Category.find({ parent: null })
      .populate({
        path: 'children',
        strictPopulate: false, // Tambahkan ini langsung di objek path
        populate: { 
          path: 'children',
          strictPopulate: false 
        }
      })
      .sort({ name: 1 })
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