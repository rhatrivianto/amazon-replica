import { useState, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { useGetCategoriesQuery } from '../../../services/categoryApi.js';
import Breadcrumbs from '../../../shared/ui/Breadcrumbs/Breadcrumbs.jsx';
import { Star } from 'lucide-react';
import ProductGrid from '../components/ProductGrid.jsx'; // Import komponen Grid yang sudah ada Pagination


const ProductBrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { openAuthModal } = useOutletContext();
  
  const query = searchParams.get('q') || '';
  const categoryIdFromUrl = searchParams.get('category');

  const { data: catData } = useGetCategoriesQuery();
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
        </div>

        {/* Ganti manual grid dengan ProductGrid yang sudah ada Pagination */}
        <ProductGrid 
          categoryId={selectedCategory}
          searchQuery={query}
          onOpenAuth={openAuthModal}
        />
      </main>
    </div>
  );
};

export default ProductBrowsePage;