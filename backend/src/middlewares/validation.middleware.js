import AppError from '../utils/AppError.js';

export const validate = (schema) => (req, res, next) => {
  // CLOUDINARY/MULTER SYNC: 
  // Jika ada file yang diupload, masukkan ke req.body agar Joi bisa memvalidasinya
  if (req.files && req.files.length > 0) {
    // Kita buat array dummy string agar Joi createProductSchema.images tidak error
    // URL asli akan diupdate oleh Controller setelah upload Cloudinary sukses
    req.body.images = req.files.map(file => file.originalname);
  } else if (req.file) {
    req.body.image = req.file.originalname;
  }

  // --- FIX: Parse JSON strings dari FormData ---
  // Frontend mengirim object/array sebagai JSON string saat pakai FormData.
  // Kita harus parse manual agar Joi membacanya sebagai Object/Array, bukan String.
  const jsonFields = ['specifications', 'bulletPoints', 'shippingInfo'];
  jsonFields.forEach(field => {
    if (req.body[field] && typeof req.body[field] === 'string') {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (err) {
        console.error(`⚠️ Gagal mem-parse field ${field}:`, err.message);
      }
    }
  });

  const { error, value } = schema.validate(req.body, { 
    abortEarly: false, 
    allowUnknown: true, 
    stripUnknown: true 
  });

  if (error) {
    const errorMessage = error.details.map((el) => el.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }

  // Update req.body dengan hasil yang sudah di-strip (bersih)
  req.body = value;
  next();
};