
import { Edit, Trash2, Package, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Komponen Helper untuk Highlight (Amazon Style)
  const HighlightText = ({ text, highlight }) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-yellow-500/30 text-yellow-200 rounded-sm px-0.5">{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };


const ProductTable = ({ products, onDelete, searchTerm }) => {
  const navigate = useNavigate();

  // Amazon Style Helper: Mempercantik tampilan kategori BTG
  const renderCategoryPath = (category) => {
    if (!category) return <span className="text-gray-600 italic">Uncategorized</span>;
    
    // Jika data category dari backend sudah menyertakan populated parent
    if (typeof category === 'object' && category.parent) {
      return (
        <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider">
          <span className="text-gray-500">{category.parent.name}</span>
          <ChevronRight size={10} className="text-gray-600" />
          <span className="text-blue-400 font-bold">{category.name}</span>
        </div>
      );
    }
    
    return <span className="text-blue-400 font-bold text-xs uppercase">{category.name || category}</span>;
  };

  if (!products || products.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-10 text-center border border-gray-700">
        <Package className="mx-auto text-gray-500 mb-4" size={48} />
        <p className="text-gray-400">Belum ada produk di gudang Amazon-mu.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-gray-800 rounded-xl border border-gray-700 shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-900/50 text-gray-400 text-sm uppercase">
            <th className="p-4 font-semibold">Produk & ID</th>
            <th className="p-4 font-semibold">Browse Tree (Category)</th>
            <th className="p-4 font-semibold">Price</th>
            <th className="p-4 font-semibold">Stock</th>
            <th className="p-4 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-700/30 transition-colors group">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden border border-gray-600">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full" />
                    ) : (
                      <Package className="text-gray-500" size={20} />
                    )}
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm line-clamp-1">
                      {/* 2. GUNAKAN HIGHLIGHT DI SINI */}
                      <HighlightText text={product.name} highlight={searchTerm} />
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono tracking-tighter uppercase">
                      ASIN: {product.asin || product._id.slice(-10)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="bg-gray-900/40 p-2 rounded border border-gray-700 inline-block">
                   {renderCategoryPath(product.category)}
                </div>
              </td>
              <td className="p-4 text-yellow-500 font-bold">
                Rp {Number(product.price).toLocaleString('id-ID')}
              </td>
              <td className="p-4">
                <div className="flex flex-col">
                   <span className={`text-sm font-bold ${product.stock < 10 ? 'text-red-400' : 'text-green-400'}`}>
                    {product.stock} in stock
                  </span>
                  {product.stock < 10 && <span className="text-[10px] text-red-500 animate-pulse">Low Stock Alert</span>}
                </div>
              </td>
              <td className="p-4 text-center">
                <div className="flex justify-center gap-1">
                  <button onClick={() => navigate(`edit/${product._id}`)} className="p-2 text-gray-400 hover:text-[#ffd814] hover:bg-gray-700 rounded-md transition-all">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => onDelete(product._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;