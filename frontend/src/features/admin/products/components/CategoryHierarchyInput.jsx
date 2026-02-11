import { useState } from 'react';
import { X } from 'lucide-react';

/**
 * Komponen input kustom untuk membuat hierarki kategori.
 * @param {string[]} value - Array dari nama kategori (e.g., ["Electronics", "Audio"])
 * @param {function} onChange - Fungsi untuk mengupdate state di form utama
 */
const CategoryHierarchyInput = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    // Jika user menekan "Enter" dan input tidak kosong
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault(); // Mencegah form tersubmit
      // Tambahkan kategori baru ke dalam array
      onChange([...value, inputValue.trim()]);
      // Kosongkan input field
      setInputValue('');
    }
  };

  const removeCategory = (indexToRemove) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <label htmlFor="category-hierarchy" className="text-sm font-bold text-gray-400">
        Or Create New Hierarchy
      </label>
      <div className="mt-1 flex flex-wrap items-center gap-2 p-2.5 w-full bg-gray-900 border border-gray-700 rounded-md focus-within:border-[#e47911] transition-colors">
        {value.map((category, index) => (
          <div key={index} className="flex items-center gap-1.5 bg-[#febd69]/20 text-[#febd69] text-sm font-medium px-2.5 py-1 rounded-full animate-in fade-in-50">
            <span>{category}</span>
            <button type="button" onClick={() => removeCategory(index)} className="text-yellow-400 hover:text-white rounded-full"><X size={14} /></button>
          </div>
        ))}
        <input id="category-hierarchy" type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} className="flex-grow p-1 outline-none bg-transparent text-white" placeholder={value.length === 0 ? "e.g., Electronics" : "e.g., Audio"} />
      </div>
      <p className="text-xs text-gray-400 mt-1">Press Enter to add a category level.</p>
    </div>
  );
};

export default CategoryHierarchyInput;