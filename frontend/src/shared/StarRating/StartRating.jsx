import { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({
  count = 5,
  rating = 0,
  onRatingChange,
  size = 24,
  color = { filled: "text-yellow-400", unfilled: "text-gray-300" },
  isEditable = false
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index) => {
    if (!isEditable) return;
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!isEditable) return;
    setHoverRating(0);
  };

  const handleClick = (index) => {
    if (!isEditable) return;
    onRatingChange(index);
  };

  const stars = Array.from({ length: count }, (_, i) => i + 1).map(index => (
    <Star
      key={index}
      size={size}
      className={`${isEditable ? 'cursor-pointer' : ''} ${ (hoverRating || rating) >= index ? color.filled : color.unfilled }`}
      onMouseEnter={() => handleMouseEnter(index)}
      onMouseLeave={handleMouseLeave}
      onClick={() => handleClick(index)}
      style={{ fill: 'currentColor' }}
    />
  ));

  return <div className="flex items-center">{stars}</div>;
};

export default StarRating;

