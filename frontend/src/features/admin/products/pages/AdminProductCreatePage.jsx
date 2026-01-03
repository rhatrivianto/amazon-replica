import { useProductForm } from '../hooks/useProductForm';
import ProductForm from '../components/ProductForm';
import { ArrowLeft, PackagePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminProductCreatePage = () => {
  const navigate = useNavigate();
  const { handleSubmit, isLoading } = useProductForm();

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      {/* Header Section: Amazon Seller Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-gray-400 hover:text-[#ffd814] transition-colors font-medium mb-2"
          >
            <ArrowLeft size={18} /> Back to Inventory
          </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <PackagePlus className="text-[#ffd814]" size={32} /> Add a New Product
          </h1>
        </div>
        
        <div className="bg-[#131921] border border-gray-800 p-3 rounded-lg hidden md:block">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest text-right">Marketplace Status</p>
          <p className="text-sm text-green-500 font-bold">● System Operational</p>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-[#232f3e] px-8 py-4 border-b border-gray-800">
          <h2 className="text-md font-semibold text-white">Product Listing Details</h2>
          <p className="text-xs text-gray-400">Please provide accurate information to optimize search relevance.</p>
        </div>

        <div className="p-8">
          <ProductForm 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminProductCreatePage;