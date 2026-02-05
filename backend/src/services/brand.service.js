import Brand from '../models/brand.model.js';

/**
 * Mendapatkan semua brand yang aktif, 
 * diurutkan berdasarkan nama secara alfabetis.
 */
export const getAllBrands = () => {
    return Brand.find({ isActive: true })
        .sort({ name: 1 })
        .lean();
};

/**
 * Mendaftarkan brand baru ke registry.
 */
export const createBrand = (data) => {
    return Brand.create(data);
};

/**
 * Menghapus brand berdasarkan ID.
 * Menggunakan findByIdAndDelete untuk Hard Delete sesuai kebutuhan Anda.
 */
export const deleteBrandById = (id) => {
    return Brand.findByIdAndDelete(id);
};

/**
 * Mencari brand berdasarkan nama (Opsional: berguna untuk validasi)
 */
export const getBrandByName = (name) => {
    return Brand.findOne({ name: new RegExp(`^${name}$`, 'i') });
};

export const updateBrandById = (id, data) => {
    return Brand.findByIdAndUpdate(id, data, {
        new: true,          // Mengembalikan data setelah diupdate
        runValidators: true // Memastikan validasi model tetap jalan
    });
};