import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAdminProductsQuery, useDeleteProductMutation } from '../../../../services/adminApi.js';
import { useProductFilter } from '../hooks/useProductFilter.js';
import ProductTable from '../components/ProductTabel.jsx'; 
import { Plus, Search, Package, AlertCircle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Pagination from '../../../../shared/ui/Pagination.jsx';

const AdminProductPage = () => {
  const [page, setPage] = useState(1);
  const { data: response, isLoading, isError, refetch } = useGetAdminProductsQuery({ page, limit: 12 });
  
  // Pastikan baris ini ada dan isDeleting tertulis benar
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  
  const products = response?.data || [];
  const pagination = response?.pagination || {};
  const { searchTerm, setSearchTerm, filteredProducts } = useProductFilter(products);
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // Gunakan deleteProduct yang dideklarasikan di atas
        await deleteProduct(id).unwrap();
        toast.success("Product deleted successfully");
      } catch {
        toast.error("Failed to delete product");
      }
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
      <p>Loading Inventory...</p>
    </div>
  );

  if (isError) return (
    <div className="bg-red-900/20 border border-red-900 text-red-400 p-6 rounded-xl flex items-center gap-4">
      <AlertCircle size={24} />
      <p>Failed to fetch data. Please check your admin login.</p>
      <button onClick={() => refetch()} className="underline ml-auto">Try again</button>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="text-yellow-500" /> Inventory Products
          </h1>
          <p className="text-gray-400 text-sm">Kelola katalog produk dan stok barang Anda</p>
        </div>
        <Link to="create" className="bg-[#febd69] hover:bg-[#f3a847] text-black px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold transition-all shadow-lg shadow-yellow-500/10">
          <Plus size={20} /> Add new Product
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder=" produk..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-yellow-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1">
              <X size={18} />
            </button>
          )}
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 flex items-center justify-center gap-3 text-gray-300">
          <span className="text-sm">Total:</span>
          <span className="text-xl font-bold text-yellow-500">{filteredProducts.length}</span>
          <span className="text-sm">Product</span>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-xl">
        {filteredProducts.length > 0 ? (
          <>
            <ProductTable 
              products={filteredProducts} 
              onDelete={handleDelete}
              isDeleting={isDeleting} // Variabel ini dilempar ke tabel
              searchTerm={searchTerm}
            />
            <div className="p-6 border-t border-gray-700 flex justify-center">
              <Pagination 
                currentPage={page}
                totalPages={pagination.pages || 1}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          </>
        ) : (
          <div className="p-20 text-center text-gray-500">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductPage;