/**
 * Middleware untuk memproses data dari Multipart/Form-Data (Multer)
 * agar field JSON string dikonversi kembali menjadi Object/Array.
 */
export const parseProductData = (req, res, next) => {
    try {
        // Daftar field yang dikirim sebagai JSON string dari Frontend
        const jsonFields = ['specifications', 'bulletPoints', 'shippingInfo'];

        jsonFields.forEach(field => {
            if (req.body[field] && typeof req.body[field] === 'string') {
                req.body[field] = JSON.parse(req.body[field]);
            }
        });

        // Pastikan angka tidak dikirim sebagai string
        if (req.body.price) req.body.price = Number(req.body.price);
        if (req.body.stock) req.body.stock = Number(req.body.stock);
        if (req.body.discountPercentage) {
            req.body.discountPercentage = Number(req.body.discountPercentage);
        }

        next();
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message: `Format data pada field ${error.message.split(' ')[0]} tidak valid.`
        });
    }
};