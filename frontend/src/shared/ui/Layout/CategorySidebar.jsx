import { useState } from 'react';
import { useGetCategoriesQuery } from '../../../services/categoryApi.js';
import { X, UserCircle, ChevronRight, ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUserInfo } from '../../../features/auth/authSlice';

const CategorySidebar = ({ isOpen, onClose }) => {
  // 1. Tambahkan error handling dari query
  const { data: response, isLoading, error } = useGetCategoriesQuery();
  
  // 2. Gunakan optional chaining dan default array yang aman
  const categories = response?.data || [];
  const userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();

  const [openSubId, setOpenSubId] = useState(null);

  const handleNavigate = (catId) => {
    navigate(`/?category=${catId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 transition-opacity" onClick={onClose} />
      
      <aside className="relative w-80 bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
        {/* User Header */}
        <div className="bg-[#232f3e] text-white p-4 flex items-center gap-3">
          <UserCircle size={30} />
          <span className="font-bold text-lg">Hello, {userInfo ? userInfo.name : 'Sign In'}</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <h2 className="font-bold text-gray-900 text-lg px-6 mb-2">Shop By Category</h2>
          
          {isLoading ? (
            <div className="px-6 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-100 animate-pulse rounded w-full" />
              ))}
            </div>
          ) : error ? (
            /* 3. Guard Clause: Jika API Error 500, tampilkan pesan ramah, bukan crash */
            <div className="px-6 py-4 text-sm text-red-500 bg-red-50 mx-4 rounded">
              Unable to load categories. Please try again later.
            </div>
          ) : (
            <ul className="text-sm">
              {/* 4. Pastikan categories adalah array sebelum map */}
              {Array.isArray(categories) && categories.map((cat) => (
                <li key={cat._id} className="flex flex-col border-b last:border-0 border-gray-100">
                  <div className="flex items-center justify-between hover:bg-gray-100 px-6 py-3 cursor-pointer group">
                    <span onClick={() => handleNavigate(cat._id)} className="flex-1 font-medium group-hover:text-orange-600">
                      {cat.name}
                    </span>
                    {cat.children?.length > 0 && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Mencegah navigasi saat klik arrow
                          setOpenSubId(openSubId === cat._id ? null : cat._id);
                        }} 
                        className="p-1 hover:bg-gray-200 rounded text-gray-400"
                      >
                        {openSubId === cat._id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>
                    )}
                  </div>

                  {/* Sub-categories level 2 */}
                  {openSubId === cat._id && cat.children?.length > 0 && (
                    <ul className="bg-gray-50 py-1">
                      {cat.children.map((sub) => (
                        <li 
                          key={sub._id} 
                          onClick={() => handleNavigate(sub._id)} 
                          className="pl-12 pr-6 py-2 hover:bg-gray-200 cursor-pointer text-gray-600"
                        >
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="absolute -right-12 top-2 text-white hover:rotate-90 transition-transform">
          <X size={35} />
        </button>
      </aside>
    </div>
  );
};

export default CategorySidebar;