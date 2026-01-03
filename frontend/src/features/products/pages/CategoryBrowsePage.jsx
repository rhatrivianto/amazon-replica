
import { useParams, useOutletContext } from 'react-router-dom';
import CategorySidebar from '../../../shared/ui/Layout/CategorySidebar.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
// Asumsi: Kamu punya api untuk ambil detail kategori berdasarkan ID
import { useGetCategoryByIdQuery } from '../../../services/categoryApi.js';

const CategoryBrowsePage = () => {
  const { id } = useParams(); // Mengambil ID kategori dari URL
  const { data: categoryData, isLoading } = useGetCategoryByIdQuery(id);
  const { openAuthModal } = useOutletContext();

  return (
    <div className="flex flex-col md:flex-row max-w-[1500px] mx-auto bg-gray-100 min-h-screen">
      {/* Sidebar tetap muncul di kiri */}
      <CategorySidebar />

      <main className="flex-1 p-4">
        {/* Header Kategori */}
        <div className="bg-white p-4 mb-4 shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <h1 className="text-xl font-bold">
              Results for <span className="text-[#e47911]">&quot;{categoryData?.data?.name}&quot;</span>
            </h1>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Price and other details may vary based on product size and color.
          </p>
        </div>

        {/* Menampilkan Grid Produk difilter berdasarkan categoryId */}
        <ProductGrid categoryId={id} onOpenAuth={openAuthModal} />
      </main>
    </div>
  );
};

export default CategoryBrowsePage;