import { useParams, useOutletContext, useSearchParams } from 'react-router-dom';
import CategorySidebar from '../../../shared/ui/Layout/CategorySidebar.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import { useGetCategoryByIdQuery } from '../../../services/categoryApi.js';

const CategoryBrowsePage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categoryData, isLoading } = useGetCategoryByIdQuery(id);
  const { openAuthModal } = useOutletContext();
  
  const page = parseInt(searchParams.get('page')) || 1;

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString() });
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col md:flex-row max-w-[1500px] mx-auto bg-gray-100 min-h-screen">
      <CategorySidebar />

      <main className="flex-1 p-4">
        <div className="bg-white p-4 mb-4 shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <h1 className="text-xl font-bold">
              Results for <span className="text-[#e47911]">"{categoryData?.data?.name}"</span>
            </h1>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Price and other details may vary based on product size and color.
          </p>
        </div>

        <ProductGrid 
          categoryId={id} 
          page={page}
          onPageChange={handlePageChange}
          onOpenAuth={openAuthModal} 
        />
      </main>
    </div>
  );
};

export default CategoryBrowsePage;