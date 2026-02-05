import { useState, useEffect, useRef } from 'react'; // Tambah useRef
import { Search, Clock } from 'lucide-react'; // Clock untuk history (opsional)
import { useNavigate } from 'react-router-dom';
import { useGetCategoriesQuery } from '../../../services/categoryApi.js';
import { useGetProductsQuery } from '../../../services/productApi.js'; // Gunakan api produk

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCat, setSelectedCat] = useState('all');
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const { data: catData } = useGetCategoriesQuery();
  const categories = catData?.data || [];

  // Panggil API saat user mengetik (Debouncing dihandle otomatis oleh RTK Query)
const { data: suggestionData } = useGetSuggestionsQuery(keyword, {
  skip: keyword.length < 2,
});

  const suggestions = suggestionData?.data || [];

  const highlightMatch = (text, query) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <strong key={i} className="text-black font-bold">{part}</strong>
        ) : (
          <span key={i} className="text-gray-500">{part}</span>
        )
      )}
    </span>
  );
};
  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e, customKeyword) => {
    if (e) e.preventDefault();
    const finalKeyword = customKeyword || keyword;
    if (!finalKeyword.trim()) return;

    const params = new URLSearchParams();
    params.append('q', finalKeyword.trim());
    if (selectedCat !== 'all') params.append('category', selectedCat);
    
    setShowSuggestions(false);
    navigate(`/?${params.toString()}`);
  };

  return (
    <div className="flex-1 relative" ref={searchRef}>
      <form onSubmit={handleSearch} className="flex items-center h-10 min-w-0 group relative z-50">
        {/* Dropdown Kategori (Kode lama Anda tetap di sini) */}
        <select 
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="hidden md:block bg-gray-100 h-full px-3 rounded-l-md text-[11px] border-r border-gray-300 outline-none hover:bg-gray-200 cursor-pointer text-black"
        >
          <option value="all">All</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <input 
          type="text" 
          className="flex-1 h-full px-4 outline-none text-black text-sm focus:ring-2 focus:ring-[#febd69] rounded-l-md md:rounded-l-none" 
          placeholder="Search Amazon"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
        />
        
        <button type="submit" className="bg-[#febd69] hover:bg-[#f3a847] h-full px-5 rounded-r-md transition-colors shrink-0">
          <Search size={22} className="text-[#131921]" />
        </button>
      </form>

      {/* --- SUGGESTIONS DROPDOWN (Amazon Style) --- */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-xl border border-gray-200 rounded-b-md mt-[1px] py-2 z-40">
          {suggestions.map((item) => (
            <div 
              key={item._id}
              onClick={() => {
                setKeyword(item.name);
                handleSearch(null, item.name);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-sm text-gray-800"
            >
              <Search size={16} className="text-gray-400" />
              <span className="truncate">{highlightMatch(item.name, keyword)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;