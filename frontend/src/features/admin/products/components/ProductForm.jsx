import { useState } from 'react';
import ImagePreview from './ImagePreview.jsx';
import SpecificationInput from './SpecificationInput.jsx';
import BulletPointInput from './BulletPointInput.jsx';
import { useGetCategoriesQuery } from '../../../../services/categoryApi.js';
import { useGetBrandsQuery } from '../../../../services/brandApi.js';

const ProductForm = ({ onSubmit, isLoading, initialData }) => {
  const [images, setImages] = useState([]);
  const [specifications, setSpecifications] = useState(initialData?.specifications || []);
  const [bulletPoints, setBulletPoints] = useState(initialData?.bulletPoints || []);
  
  const { data: categories } = useGetCategoriesQuery();
  const { data: brands } = useGetBrandsQuery();

  const handleLocalSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    
    // Gunakan FormData karena ada Upload Gambar & Data Kompleks
    const formData = new FormData();
    formData.append('name', form.name.value);
    formData.append('price', form.price.value);
    formData.append('stock', form.stock.value);
    formData.append('category', form.category.value);
    formData.append('brand', form.brand.value);
    formData.append('description', form.description.value);
    formData.append('asin', form.asin?.value || '');
    
    // Mengirim Object/Array sebagai JSON string (Akan di-parse di Backend)
    formData.append('specifications', JSON.stringify(specifications));
    formData.append('bulletPoints', JSON.stringify(bulletPoints));
    
    // Tambahkan pengiriman shippingInfo dasar ala Amazon
    formData.append('shippingInfo', JSON.stringify({
      soldBy: form.brand.options[form.brand.selectedIndex].text,
      shipsFrom: 'Amazon Global Store'
    }));

    images.forEach((img) => formData.append('images', img));
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleLocalSubmit} className="space-y-8 text-white bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
      
      {/* SECTION 1: BASIC INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-400">Product Name</label>
          <input name="name" defaultValue={initialData?.name} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2.5 focus:border-[#e47911] outline-none" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-400">Price (IDR/USD)</label>
          <input name="price" type="number" step="0.01" defaultValue={initialData?.price} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2.5 focus:border-[#e47911] outline-none" required />
        </div>
      </div>

      {/* SECTION 2: INVENTORY & ASIN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-400">Stock Count</label>
          <input name="stock" type="number" defaultValue={initialData?.stock || 0} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2.5 focus:border-[#e47911] outline-none" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-400">Brand Vendor</label>
          <select name="brand" className="w-full bg-gray-900 border border-gray-700 rounded-md p-2.5 focus:border-[#e47911] outline-none" required defaultValue={initialData?.brand?._id}>
            <option value="">Select Brand</option>
            {brands?.data?.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-400">ASIN (Optional)</label>
          <input name="asin" placeholder="Auto-generated if empty" defaultValue={initialData?.asin} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2.5 focus:border-[#e47911] outline-none" />
        </div>
      </div>

      {/* SECTION 3: CATEGORY BTG */}
      <div className="space-y-1">
        <label className="text-sm font-bold text-gray-400">Category (Browse Tree Guide)</label>
        <select name="category" className="w-full bg-gray-900 border border-gray-700 rounded-md p-2.5 focus:border-[#e47911] outline-none" required defaultValue={initialData?.category?._id}>
          <option value="">Select Category Path</option>
          {categories?.data?.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.parent ? `${cat.parent.name} › ${cat.name}` : cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* SECTION 4: AMAZON SPECIFIC INPUTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BulletPointInput bulletPoints={bulletPoints} setBulletPoints={setBulletPoints} />
        <SpecificationInput specifications={specifications} setSpecifications={setSpecifications} />
      </div>

      {/* SECTION 5: DESCRIPTION & MEDIA */}
      <div className="space-y-1">
        <label className="text-sm font-bold text-gray-400">Full Product Description</label>
        <textarea name="description" defaultValue={initialData?.description} rows="4" className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 focus:border-[#e47911] outline-none" required></textarea>
      </div>

      <ImagePreview 
        selectedImages={images} 
        onRemove={(index) => setImages(images.filter((_, i) => i !== index))} 
        onSelect={(e) => setImages([...images, ...Array.from(e.target.files)].slice(0, 5))}
      />

      <button type="submit" disabled={isLoading} className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black font-bold py-4 rounded-xl shadow-lg shadow-yellow-600/20 transition-all transform active:scale-[0.98]">
        {isLoading ? 'Syncing with Amazon Servers...' : 'Confirm & Publish to Global Catalog'}
      </button>
    </form>
  );
};

export default ProductForm;