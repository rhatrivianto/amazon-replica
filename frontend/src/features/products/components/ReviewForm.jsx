import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { useCreateReviewMutation } from '../../../services/reviewApi.js';
import { toast } from 'react-hot-toast';

const ReviewForm = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [title, setTitle] = useState('');

  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a star rating");

    try {
      await createReview({ 
        productId, 
        reviewData: { rating, comment, title } 
      }).unwrap();
      
      toast.success("Review submitted! Thank you.");
      setRating(0);
      setComment('');
      setTitle('');
    } catch (err) {
      toast.error(err.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="border border-gray-300 rounded-md p-6 bg-white shadow-sm mt-6">
      <h3 className="text-lg font-bold mb-4">Review this product</h3>
      <p className="text-sm text-gray-600 mb-4">Share your thoughts with other customers</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating Selector */}
        <div>
          <label className="block text-sm font-bold mb-1">Overall rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-colors"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star 
                  size={28} 
                  className={(hover || rating) >= star ? "text-[#ffa41c]" : "text-gray-300"} 
                  fill={(hover || rating) >= star ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Add a headline</label>
          <input
            type="text"
            placeholder="What's most important to know?"
            className="w-full border border-gray-400 rounded-sm p-2 text-sm outline-none focus:border-[#e47911] focus:ring-1 focus:ring-[#e47911]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Add a written review</label>
          <textarea
            rows="4"
            placeholder="What did you like or dislike? What did you use this product for?"
            className="w-full border border-gray-400 rounded-sm p-2 text-sm outline-none focus:border-[#e47911] focus:ring-1 focus:ring-[#e47911]"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-white border border-gray-400 hover:bg-gray-50 text-gray-800 text-xs font-medium py-1.5 px-6 rounded-full shadow-sm"
        >
          {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;