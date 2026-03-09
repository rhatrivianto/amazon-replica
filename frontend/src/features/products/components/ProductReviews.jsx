import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetProductReviewsQuery, useCreateReviewMutation } from '../../../services/reviewApi';
import { selectUserInfo } from '../../auth/authSlice';
import StarRating from '../../../shared/StarRating/StartRating';
import { Loader2 } from 'lucide-react';

const ProductReviews = ({ productId }) => {
  const { data: reviewsData, isLoading, error } = useGetProductReviewsQuery(productId);
  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();
  const userInfo = useSelector(selectUserInfo);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const reviews = reviewsData?.data || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !reviewText) {
      alert('Please provide a rating and a review.');
      return;
    }
    try {
      await createReview({
        productId,
        reviewData: { rating, review: reviewText }
      }).unwrap();
      setRating(0);
      setReviewText('');
    } catch (err) {
      console.error('Failed to submit review:', err);
      alert(err.data?.message || 'Failed to submit review. You may have already reviewed this product.');
    }
  };

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      
      {userInfo && (
        <div className="mb-8 p-6 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Write a review</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-medium mb-2">Your Rating</label>
              <StarRating rating={rating} onRatingChange={setRating} isEditable={true} />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Your Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows="4"
                className="w-full p-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                placeholder="What did you like or dislike?"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg px-4 py-2 text-sm shadow-sm font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {isLoading && <p>Loading reviews...</p>}
      {error && <p className="text-red-500">Could not load reviews.</p>}
      
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="border-b pb-6">
              <div className="flex items-center mb-2 gap-4">
                <div className="font-bold">{review.user?.name || 'Anonymous'}</div>
                <StarRating rating={review.rating} size={16} isEditable={false} />
              </div>
              <p className="text-gray-500 text-sm mb-2">Reviewed on {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-gray-800 whitespace-pre-wrap">{review.review}</p>
            </div>
          ))
        ) : (
          !isLoading && <p>No reviews yet. Be the first to review this product!</p>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
