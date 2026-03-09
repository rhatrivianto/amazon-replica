import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PriceTag from './PriceTag';

const BrowsingHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Ambil data dari localStorage saat komponen dimuat
    const storedHistory = JSON.parse(localStorage.getItem('browsingHistory') || '[]');
    setHistory(storedHistory);
  }, []);

  if (history.length === 0) return null;

  return (
    <div className="mt-10 border-t border-gray-200 pt-6">
      <h3 className="text-xl font-bold mb-4 text-gray-900">Your Browsing History</h3>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {history.map((item) => (
          <Link 
            key={item._id} 
            to={`/product/${item._id}`}
            className="min-w-[160px] max-w-[160px] p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white flex flex-col"
          >
            <div className="h-32 flex items-center justify-center mb-3">
              <img 
                src={item.image} 
                alt={item.name} 
                className="max-h-full max-w-full object-contain" 
              />
            </div>
            <div className="text-sm text-[#007185] hover:underline hover:text-[#c45500] line-clamp-2 h-10 mb-1 leading-snug">
              {item.name}
            </div>
            <div className="mt-auto">
                <PriceTag price={item.price} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BrowsingHistory;
