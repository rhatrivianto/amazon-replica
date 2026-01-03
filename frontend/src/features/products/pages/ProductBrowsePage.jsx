import { useState, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { useGetAdminProductsQuery } from '../../../services/adminServiceApi.js';
import { useGetCategoriesQuery } from '../../../services/categoryApi.js';
import Breadcrumbs from '../../../shared/ui/Breadcrumbs/Breadcrumbs.jsx';
import { Star, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../auth/authSlice.js';
import ProductCard from '../components/ProductCard.jsx';
import { useAddToCartMutation } from '../../../services/cartApi.js';
import { toast } from 'react-hot-toast';

const ProductBrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { openAuthModal } = useOutletContext();
  const userInfo = useSelector(selectUserInfo);
  
  const query = searchParams.get('q') || '';
  const categoryIdFromUrl = searchParams.get('category');

  const { data: prodData, isLoading: prodsLoading } = useGetAdminProductsQuery();
  const { data: catData } = useGetCategoriesQuery();
  const [addToCart] = useAddToCartMutation();

  const products = prodData?.data || [];
  const categories = catData?.data || [];

  // Sinkronisasi URL ke State Sidebar
  useEffect(() => {
    setSelectedCategory(categoryIdFromUrl || null);
  }, [categoryIdFromUrl]);

  const handleCategoryClick = (id) => {
    const newParams = new URLSearchParams(searchParams);
    if (id) {
      newParams.set('category', id);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory ? p.category?._id === selectedCategory : true;
    const matchesSearch = p.name.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = async (product) => {
    if (!userInfo) {
      openAuthModal();
      return;
    }

    try {
      await addToCart({ productId: product._id, quantity: 1 }).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add to cart');
    }
  };

  if (prodsLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-[#e47911] mb-2" size={40} />
      <p className="text-gray-500 font-medium">Fetching Amazon Catalog...</p>
    </div>
  );

  return (
    <div className="bg-white min-h-screen flex flex-col md:flex-row">
      {/* Sidebar Filter */}
      <aside className="w-full md:w-64 p-6 border-r border-gray-200 shrink-0">
        <h3 className="font-bold text-sm mb-3 text-black">Department</h3>
        <ul className="space-y-2 text-sm">
          <li 
            onClick={() => handleCategoryClick(null)}
            className={`cursor-pointer hover:text-[#e47911] transition-colors ${!selectedCategory ? 'font-bold text-black' : 'text-gray-700'}`}
          >
            All Departments
          </li>
          {categories.map((cat) => (
            <li 
              key={cat._id}
              onClick={() => handleCategoryClick(cat._id)}
              className={`cursor-pointer hover:text-[#e47911] transition-colors pl-2 ${selectedCategory === cat._id ? 'font-bold text-[#e47911]' : 'text-gray-700'}`}
            >
              {cat.name}
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="font-bold text-sm mb-3 text-black">Customer Reviews</h3>
          <div className="space-y-2 text-xs text-gray-700">
            {[4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-1 cursor-pointer hover:text-[#e47911] group">
                <div className="flex text-[#ffa41c]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < star ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="group-hover:underline">& Up</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 bg-gray-50">
        <div className="mb-4">
          {selectedCategory && <Breadcrumbs activeCategoryId={selectedCategory} />}
          <p className="text-sm text-gray-600 mt-2">
            {filteredProducts.length} results 
            {query && <span> for <span className="text-[#c45500] font-bold">&quot;{query}&quot;</span></span>}
            {selectedCategory && (
               <span className="ml-1">in <span className="font-bold">&quot;{categories.find(c => c._id === selectedCategory)?.name}&quot;</span></span>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onAddToCart={handleAddToCart} 
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white border border-dashed rounded-lg">
            <p className="text-lg font-medium text-gray-600">No products found matches your search.</p>
            <button 
              onClick={() => handleCategoryClick(null)} 
              className="text-[#007185] hover:underline text-sm font-bold mt-2"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductBrowsePage;