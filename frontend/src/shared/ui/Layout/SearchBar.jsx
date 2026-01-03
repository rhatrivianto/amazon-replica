import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetCategoriesQuery } from '../../../services/categoryApi.js';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const navigate = useNavigate();
  const { data: catData } = useGetCategoriesQuery();
  const categories = catData?.data || [];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('q', keyword.trim());
    if (selectedCat !== 'all') params.append('category', selectedCat);
    navigate(`/?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 flex items-center h-10 min-w-[150px] group">
      <div className="relative h-full">
        <select 
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="hidden md:block bg-gray-100 h-full px-3 rounded-l-md text-[11px] border-r border-gray-300 outline-none hover:bg-gray-200 cursor-pointer text-black"
        >
          <option value="all">All Departments</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      
      <input 
        type="text" 
        className="flex-1 h-full px-4 outline-none text-black text-sm focus:ring-2 focus:ring-[#febd69] z-10" 
        placeholder="Search Amazon"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      
      <button type="submit" className="bg-[#febd69] hover:bg-[#f3a847] h-full px-5 rounded-r-md transition-colors">
        <Search size={22} className="text-[#131921]" />
      </button>
    </form>
  );
};

export default SearchBar;