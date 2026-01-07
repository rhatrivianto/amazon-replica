import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Jangan tampilkan jika hanya ada 1 halaman
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-10 mb-6">
      {/* Tombol Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-4 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#e47911] hover:border-[#e47911] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        <ChevronLeft size={16} /> Previous
      </button>
      
      {/* Indikator Halaman */}
      <span className="text-sm font-bold text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
        Page {currentPage} of {totalPages}
      </span>

      {/* Tombol Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-4 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#e47911] hover:border-[#e47911] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
