import { X, Upload } from 'lucide-react';

const ImagePreview = ({ selectedImages, onRemove, onSelect }) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-gray-200">
        Product Images (Max 5)
      </label>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Slot Preview Gambar yang sudah dipilih */}
        {selectedImages.map((img, index) => (
          <div key={index} className="relative group aspect-square border-2 border-dashed border-gray-700 rounded-lg overflow-hidden bg-gray-900">
            <img 
              src={URL.createObjectURL(img)} 
              alt="preview" 
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => onRemove(index)}
              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {/* Tombol Tambah Gambar (Amazon Style) */}
        {selectedImages.length < 5 && (
          <label className="cursor-pointer aspect-square border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[#e47911] hover:text-[#e47911] transition-all">
            <Upload size={24} />
            <span className="text-[10px] mt-2 font-bold uppercase">Add Image</span>
            <input 
              type="file" 
              multiple 
              className="hidden" 
              accept="image/*"
              onChange={onSelect}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;