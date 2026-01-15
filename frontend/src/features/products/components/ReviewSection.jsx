import { useGetProductReviewsQuery } from '../../../services/reviewApi.js';
import ReviewSnapshot from './ReviewSnapshot';
import ReviewForm from './ReviewForm.jsx';
import { User, Check, Star } from 'lucide-react'; // Check ditambahkan di sini
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../auth/authSlice.js';

const ReviewSection = ({ productId, productRating, numReviews }) => {
  const { data, isLoading } = useGetProductReviewsQuery(productId);
  const reviews = data?.reviews || data?.data || [];
  const userInfo = useSelector(selectUserInfo);

  return (
    <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 mt-10">
      {/* KIRI: Snapshot & Form */}
      <div className="md:col-span-4 lg:col-span-3 space-y-8">
        <ReviewSnapshot rating={productRating} numReviews={numReviews} />
        
        {/* Form muncul jika user login */}
        {userInfo ? (
          <ReviewForm productId={productId} />
        ) : (
          <div className="p-4 bg-gray-50 border rounded-sm">
            <p className="text-sm">Please login to write a review.</p>
          </div>
        )}
      </div>

      {/* KANAN: Review List */}
      <div className="md:col-span-8 lg:col-span-9 space-y-8">
        <h3 className="text-xl font-bold border-b pb-4">Top reviews from Indonesia</h3>
        
        {isLoading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet.</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev._id} className="space-y-2 border-b pb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={20} className="text-gray-500" />
                </div>
                <span className="text-sm font-medium">{rev.user?.name || "Amazon Customer"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex text-[#ffa41c]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-sm font-bold">{rev.title}</span>
              </div>

              <p className="text-[12px] text-gray-500">Reviewed in Indonesia on {new Date(rev.createdAt).toLocaleDateString()}</p>
              
              <div className="flex items-center gap-1 text-[#c45500] text-[12px] font-bold">
                 <Check size={14} /> <span>Verified Purchase</span> {/* Icon Check dipakai di sini */}
              </div>

              <p className="text-sm text-gray-800 leading-relaxed">{rev.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;