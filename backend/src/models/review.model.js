import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, // Judul ulasan (e.g. "Barang Bagus!")
  comment: { type: String, required: true }, // Isi ulasan
  rating: { type: Number, min: 1, max: 5, required: true },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true,
    index: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

// INDEX MAJEMUK: Mencegah satu user memberikan review berkali-kali pada satu produk
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// --- STATIC METHOD: Hitung Rata-rata Rating ---
reviewSchema.statics.calcAverageRatings = async function(productId) {
  // Aggregation pipeline yang lebih canggih untuk menghitung semua statistik dalam satu query
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $facet: {
        // Cabang 1: Menghitung rata-rata dan jumlah total ulasan
        overallStats: [
          {
            $group: {
              _id: null,
              ratingsAverage: { $avg: '$rating' },
              numReviews: { $sum: 1 }
            }
          }
        ],
        // Cabang 2: Menghitung distribusi (jumlah ulasan per bintang)
        distribution: [
          { $group: { _id: '$rating', count: { $sum: 1 } } },
          { $sort: { _id: -1 } }, // Urutkan dari bintang 5 ke 1
          { $project: { _id: 0, rating: '$_id', count: '$count' } }
        ]
      }
    }
  ]);

  // --- CONSOLE LOG UNTUK VERIFIKASI (Sesuai Permintaan Anda) ---
  console.log("📊 [Review Stats Recalculated]:", JSON.stringify(stats, null, 2));

  if (stats[0].overallStats.length > 0) {
    // Jika ada ulasan, update produk dengan statistik baru
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      ratingsAverage: stats[0].overallStats[0].ratingsAverage,
      numReviews: stats[0].overallStats[0].numReviews,
      ratingsDistribution: stats[0].distribution // <-- SIMPAN DATA DISTRIBUSI BARU
    });
  } else {
    // Jika tidak ada ulasan sama sekali (misal ulasan terakhir dihapus)
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      numReviews: 0,
      ratingsDistribution: [] // Kosongkan distribusi
    });
  }
};

// Middleware: Jalankan perhitungan setelah review disimpan
reviewSchema.post('save', function() {
  // this.constructor menunjuk ke Model Review
  this.constructor.calcAverageRatings(this.product);
});

export default mongoose.model('Review', reviewSchema);