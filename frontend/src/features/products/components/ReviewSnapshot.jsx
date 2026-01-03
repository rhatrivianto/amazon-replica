import { Star } from 'lucide-react';

const ReviewSnapshot = ({ rating = 0, numReviews = 0 }) => {
  // Simulasi data bar (Amazon biasanya mengirimkan ini dari backend)
  const stats = [
    { star: 5, percentage: 75 },
    { star: 4, percentage: 15 },
    { star: 3, percentage: 5 },
    { star: 2, percentage: 3 },
    { star: 1, percentage: 2 },
  ];

  return (
    <div className="w-full md:w-64 space-y-4">
      <h3 className="text-xl font-bold">Customer Reviews</h3>
      <div className="flex items-center gap-2">
        <div className="flex text-[#ffa41c]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={18} fill={i < Math.round(rating) ? "currentColor" : "none"} />
          ))}
        </div>
        <span className="text-lg font-medium">{rating} out of 5</span>
      </div>
      <p className="text-sm text-gray-500">{numReviews.toLocaleString()} global ratings</p>

      <div className="space-y-2 mt-4">
        {stats.map((item) => (
          <div key={item.star} className="flex items-center gap-4 text-sm text-[#007185] hover:underline cursor-pointer group">
            <span className="w-12 whitespace-nowrap">{item.star} star</span>
            <div className="flex-1 h-5 bg-gray-100 border border-gray-300 rounded-sm overflow-hidden">
              <div 
                className="h-full bg-[#ffa41c] border-r border-orange-500" 
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
            <span className="w-10 text-gray-600 group-hover:no-underline">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSnapshot;