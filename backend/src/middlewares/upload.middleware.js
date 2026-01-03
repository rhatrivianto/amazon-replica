import multer from 'multer';

/**
 * AMAZON STYLE: Memory Storage
 * Menghindari penulisan ke disk lokal untuk kecepatan maksimal 
 * dan arsitektur server yang stateless.
 */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Validasi tipe file secara ketat
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
};

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Amazon Standard: 5MB limit
        files: 5 // Maksimal 5 gambar per produk
    },
    fileFilter
});