import { X, UploadCloud, Image as ImageIcon } from 'lucide-react';

const ImagePreview = ({
  existingImages = [],
  newImages = [],
  onRemoveExisting,
  onRemoveNew,
  onSelect,
}) => {
  const totalImages = existingImages.length + newImages.length;

  return (
    <div className="space-y-4 p-4 bg-gray-900/50 border border-gray-700 rounded-xl">
      <label className="text-sm font-bold text-gray-400">Product Images (Max 5)</label>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
        {/* Render Existing Images (from DB) */}
        {existingImages.map((url, index) => (
          <div key={`existing-${index}`} className="relative group aspect-square">
            <img src={url} alt={`Existing product image ${index + 1}`} className="w-full h-full object-cover rounded-md border-2 border-green-500" />
            <button
              type="button"
              onClick={() => onRemoveExisting(index)}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-green-900/80 text-white text-[10px] text-center py-0.5 rounded-b-md">
              Saved
            </div>
          </div>
        ))}

        {/* Render New Images (to be uploaded) */}
        {newImages.map((file, index) => (
          <div key={`new-${index}`} className="relative group aspect-square">
            <img src={URL.createObjectURL(file)} alt={`New product image ${index + 1}`} className="w-full h-full object-cover rounded-md border-2 border-yellow-500" />
            <button
              type="button"
              onClick={() => onRemoveNew(index)}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-yellow-900/80 text-white text-[10px] text-center py-0.5 rounded-b-md">
              New
            </div>
          </div>
        ))}

        {/* Upload Slot */}
        {totalImages < 5 && (
          <label className="relative flex flex-col items-center justify-center w-full h-full aspect-square bg-gray-800 border-2 border-dashed border-gray-600 rounded-md cursor-pointer hover:bg-gray-700 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
              <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
              <p className="mb-1 text-xs text-gray-400">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-[10px] text-gray-500">{5 - totalImages} slots left</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={onSelect}
              disabled={totalImages >= 5}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;