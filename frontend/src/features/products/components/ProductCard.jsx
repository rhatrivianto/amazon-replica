import { Link } from 'react-router-dom';
import ProductBadge from './ProductBadge';
import ProductRating from './ProductRating';
import PriceTag from './PriceTag';
import LazyImage from './LazyImage';

const ProductCard = ({ product, onAddToCart }) => {
  if (!product) return null;

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  // Logika diskon dummy untuk demonstrasi, bisa disesuaikan
  const discountPercentage = product.discountPercentage || (product.stock < 10 ? 15 : 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col hover:shadow-lg transition-shadow duration-300 relative h-full">
      
      {/* Badge System */}
      <div className="min-h-[24px]">
        {product.isFeatured && <ProductBadge type="amazonsChoice" />}
        {discountPercentage > 10 && <ProductBadge type="limitedDeal" />}
      </div>

      <Link to={`/product/${product._id}`} className="group flex-1 flex flex-col">
        <div className="h-48 flex items-center justify-center mb-4 bg-gray-50 rounded-md p-2">
          <LazyImage
            src={product.images?.[0]}
            alt={product.name}
            className="max-h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h4 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-orange-600 h-10">
          {product.name}
        </h4>
      </Link>

      {/* Bagian bawah kartu yang berisi harga dan tombol */}
      <div className="mt-auto">
        <ProductRating
          rating={product.rating || 4.5}
          reviewsCount={product.numReviews || 0}
        />
        <div className="my-2">
          <PriceTag
            price={product.price}
            discountPercentage={discountPercentage}
          />
          <p className="text-xs text-gray-500 mt-1">FREE delivery Tomorrow</p>
        </div>

        <button
          onClick={handleAddToCartClick}
          disabled={product.stock === 0}
          className={`mt-2 w-full text-sm font-bold py-2 px-4 rounded-full shadow-sm transition-all active:scale-95 ${
            product.stock === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-[#ffd814] hover:bg-[#f7ca00] text-black'
          }`}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;