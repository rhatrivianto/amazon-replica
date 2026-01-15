
import { useGetMyInventoryQuery } from '../../../services/sellerApi';
import { Loader2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

  const SellerInventoryPage = () => {
  // Cukup kirim params seperti limit atau search jika perlu
  const { data, isLoading } = useGetMyInventoryQuery({ 
    limit: 50 
    // Tidak perlu seller: userInfo._id, backend sudah tahu dari token!
  });



  const products = data?.products || data?.data || [];

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Inventory</h1>
        <Link 
          to="/seller/product/new" 
          className="bg-[#e47911] hover:bg-[#d16d0e] text-white px-4 py-2 rounded shadow-sm flex items-center gap-2 text-sm font-bold"
        >
          <Plus size={16} /> Add a Product
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="animate-spin text-[#e47911]" size={32} />
          </div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            <p>You haven&apos;t listed any products yet.</p>
            <p className="text-sm mt-2">Click &quot;Add a Product&quot; to start selling.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 border-b">
                <tr>
                  <th className="px-6 py-3 font-bold">Status</th>
                  <th className="px-6 py-3 font-bold">Image</th>
                  <th className="px-6 py-3 font-bold">Product Name</th>
                  <th className="px-6 py-3 font-bold">Date Created</th>
                  <th className="px-6 py-3 font-bold">Available</th>
                  <th className="px-6 py-3 font-bold">Price</th>
                  <th className="px-6 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.stock > 0 ? 'Active' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <img src={product.images?.[0]} alt="" className="h-10 w-10 object-contain border rounded" />
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate font-medium text-[#007185] hover:underline cursor-pointer">
                      {product.name}
                      <div className="text-xs text-gray-400 font-normal">ASIN: {product.asin || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(product.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold">{product.stock}</td>
                    <td className="px-6 py-4 font-bold text-[#b12704]">${product.price}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-500 hover:text-gray-800 mx-1">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerInventoryPage;
