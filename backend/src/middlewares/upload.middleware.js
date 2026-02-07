import multer from 'multer';
import path from 'path';

/**
 * AMAZON STYLE: Memory Storage
 * Menghindari penulisan ke disk lokal untuk kecepatan maksimal 
 * dan arsitektur server yang stateless.
 */
const storage = multer.memoryStorage();

// backend/src/middlewares/upload.middleware.js

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  // Gunakan optional chaining untuk keamanan jika mimetype kosong
  const mimetype = allowedTypes.test(file?.mimetype);
  const extname = allowedTypes.test(path.extname(file?.originalname || '').toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Invalid file type. Only images (JPG, PNG, WEBP, GIF) are allowed.'));
};

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 5 },
    fileFilter
});

export const parseFormDataJSON = (req, res, next) => {
  const jsonFields = ['specifications', 'bulletPoints', 'shippingInfo'];
  jsonFields.forEach((field) => {
    // Pastikan req.body ada dan field tersebut berupa string JSON
    if (req.body && req.body[field] && typeof req.body[field] === 'string') {
      try {
        // Cek apakah string diawali dengan [ atau { (ciri JSON)
        if (req.body[field].startsWith('[') || req.body[field].startsWith('{')) {
          req.body[field] = JSON.parse(req.body[field]);
        }
      } catch (err) {
        console.error(`Gagal parse field ${field}:`, err);
      }
    }
  });
  next();
};