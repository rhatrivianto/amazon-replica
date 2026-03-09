import mongoose from 'mongoose';
import Product from './product.model.js';

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review can not be empty!']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Review must have a rating.']
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Review must belong to a product.']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  }
}, { timestamps: true });

// Prevent user from writing multiple reviews for the same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to calculate average ratings on a product
reviewSchema.statics.calcAverageRatings = async function(productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId }
    },
    {
      $group: {
        _id: '$product',
        numReviews: { $sum: 1 },
        ratingsAverage: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      numReviews: stats[0].numReviews,
      ratingsAverage: stats[0].ratingsAverage
    });
  } else {
    // Reset to default if no reviews are left
    await Product.findByIdAndUpdate(productId, {
      numReviews: 0,
      ratingsAverage: 0
    });
  }
};

// Call the calculator after a new review is saved
reviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.product);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;