import { Star, StarHalf } from 'lucide-react';

const ProductRating = ({ rating = 0, reviewsCount = 0, size = 16 }) => {
  // Logika menghitung bintang
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex text-[#ffa41c]">
        {/* Bintang Penuh */}
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={size} fill="currentColor" />
        ))}
        
        {/* Bintang Setengah */}
        {hasHalfStar && <StarHalf size={size} fill="currentColor" />}
        
        {/* Bintang Kosong */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-gray-300" />
        ))}
      </div>
      
      {reviewsCount > 0 && (
        <span className="text-sm text-blue-600 hover:text-[#e47911] cursor-pointer ml-1">
          {reviewsCount.toLocaleString()}
        </span>
      )}
    </div>
  );
};

export default ProductRating;