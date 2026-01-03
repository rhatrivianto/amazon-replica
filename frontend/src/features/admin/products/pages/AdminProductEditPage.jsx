import { useParams, useNavigate } from 'react-router-dom';
import { useGetAdminProductByIdQuery } from '../../../../services/adminServiceApi.js';
import { useProductForm } from '../hooks/useProductForm.js';
import ProductForm from '../components/ProductForm.jsx';
import { ArrowLeft, Edit3, Loader2 } from 'lucide-react';

const AdminProductEditPage = () => {
  const { id } = useParams(); // Ambil ID dari URL browser
  const navigate = useNavigate();

  // 1. Ambil data produk lama dari database
  const { data, isLoading: isFetching, error } = useGetAdminProductByIdQuery(id);
  const productData = data?.data;

  // 2. Gunakan Hook Form kita (Kirim productData sebagai initialData)
  const { handleSubmit, isLoading: isUpdating } = useProductForm(productData);

  if (isFetching) return (
    <div className="h-96 flex items-center justify-center text-white gap-3">
      <Loader2 className="animate-spin text-[#ffd814]" size={32} />
      <span>Mengambil detail produk dari Amazon Cloud...</span>
    </div>
  );

  if (error) return <div className="p-10 text-red-500">Produk tidak ditemukan atau terjadi kesalahan.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-400 hover:text-[#ffd814] transition-colors"
        >
          <ArrowLeft size={20} /> Batal Edit
        </button>
        
        <div className="text-right">
          <h1 className="text-2xl font-bold text-white flex items-center justify-end gap-2">
            <Edit3 className="text-[#ffd814]" size={24} /> Edit Product Listing
          </h1>
          <p className="text-xs text-gray-500 font-mono italic">ASIN: {id.toUpperCase()}</p>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Dekorasi Visual ala Amazon Seller */}
        <div className="absolute top-0 left-0 w-1 h-full bg-[#ffd814]"></div>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-200">Perbarui Informasi Produk</h2>
          <p className="text-sm text-gray-400 italic">
            * Perubahan nama akan otomatis memperbarui Slug untuk SEO.
          </p>
        </div>

        {/* Kirim data lama ke ProductForm melalui prop initialData */}
        <ProductForm 
          onSubmit={handleSubmit} 
          isLoading={isUpdating} 
          initialData={productData} 
        />
      </div>
    </div>
  );
};

export default AdminProductEditPage;