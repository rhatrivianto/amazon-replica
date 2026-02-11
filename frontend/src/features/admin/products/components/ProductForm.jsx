import { useState, useEffect } from 'react';
import ImagePreview from './ImagePreview.jsx';
import SpecificationInput from './SpecificationInput.jsx';
import BulletPointInput from './BulletPointInput.jsx';
import { Truck, ShieldCheck } from 'lucide-react';
import { useGetCategoriesQuery } from '../../../../services/categoryApi.js';
import { useGetBrandsQuery } from '../../../../services/brandApi.js';

const ProductForm = ({ onSubmit, isLoading, initialData }) => {
  const [images, setImages] = useState([]);
  const [specifications, setSpecifications] = useState(initialData?.specifications || []);
  const [bulletPoints, setBulletPoints] = useState(initialData?.bulletPoints || []);
  
  const { data: categories } = useGetCategoriesQuery();
  const { data: brands } = useGetBrandsQuery();

  // --- FIX: Reset State saat berpindah produk (Edit Mode) ---
  useEffect(() => {
    if (initialData) {
      setSpecifications(initialData.specifications || []);
      setBulletPoints(initialData.bulletPoints || []);
      // Reset gambar baru karena kita pindah ke produk lain
      setImages([]); 
    }
  }, [initialData]);

  // Helper untuk membuat daftar kategori menjadi flat untuk dropdown
  const flattenCategories = (categories, level = 0) => {
    let flatList = [];
    if (!categories) return flatList;
    for (const category of categories) {
      flatList.push({ ...category, level });
      if (category.children && category.children.length > 0) {
        flatList = flatList.concat(flattenCategories(category.children, level + 1));
      }
    }
    return flatList;
  };

  const handleLocalSubmit = (e) => {
  e.preventDefault();
  const form = e.target;

  
  // GUNAKAN OBJECT BIASA jika tidak ada upload gambar
  // TAPI karena Anda ada ImagePreview, kita tetap pakai FormData dengan trik ini:
  const formData = new FormData();

  formData.append('name', form.name.value);
  formData.append('description', form.description.value);
  formData.append('price', Number(form.price.value));
  formData.append('stock', Number(form.stock.value));
  formData.append('category', form.category.value);
  formData.append('brand', form.brand.value);
  
  // Field Tambahan
  formData.append('asin', form.asin?.value || '');
  formData.append('modelNumber', form.modelNumber?.value || '');
  formData.append('discountPercentage', Number(form.discountPercentage?.value || 0));
  formData.append('isPrime', form.isPrime.checked);
  formData.append('isSmallBusiness', form.isSmallBusiness.checked);
  
  // PENTING: Untuk Array/Object di FormData, pastikan Backend Anda (Multer) 
  // sudah dikonfigurasi untuk mem-parse JSON.stringify, 
  // ATAU kirim satu per satu.
  formData.append('specifications', JSON.stringify(specifications));
  formData.append('bulletPoints', JSON.stringify(bulletPoints));

  // PERBAIKAN SHIPPING INFO
  const shippingData = {
    weight: form.weight?.value || '0 kg',
    dimensions: form.dimensions?.value || '0x0x0 cm',
    shipsFrom: 'Amazon Global Store',
    soldBy: form.brand.options[form.brand.selectedIndex].text 
  };
  formData.append('shippingInfo', JSON.stringify(shippingData));

  // Images
  if (images.length > 0) {
    images.forEach((img) => formData.append('images', img));
  }
  
  onSubmit(formData);
};
  return (
    <form 
      // --- FIX: Key Unik untuk Memaksa Re-render Total saat Ganti Produk ---
      key={initialData?._id || 'create-new'}
      onSubmit={handleLocalSubmit} 
      className="space-y-8 text-white bg-gray-800/50 p-6 rounded-2xl border border-gray-700"
    >
      
      {/* SECTION 1: BASIC INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-400">Product Name</label>
          <input name="name" defaultValue={initialData?.name} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2.5 focus:border-[#e47911] outline-none" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-400">Price</label>
          <div className="flex gap-4">
            <input name="price" type="number" step="0.01" placeholder="Price" defaultValue={initialData?.price} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2.5 focus:border-[#e47911] outline-none" required />
            <input name="discountPercentage" type="number" placeholder="Disc %" defaultValue={initialData?.discountPercentage} className="w-1/3 bg-gray-900 border border-gray-700 rounded-md p-2.5 focus:border-[#e47911] outline-none" />
          </div>
        </div>
      </div>

      {/* SECTION 2: INVENTORY & ASIN */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-400">Model Number</label>
          <input name="modelNumber" defaultValue={initialData?.modelNumber} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2.5 focus:border-[#e47911] outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-400">Stock Count</label>
          <input name="stock" type="number" defaultValue={initialData?.stock || 0} className="w-full bg-gray-900 border border-gray-700 rounded-md p-2.5 focus:border-[#e47911] outline-none" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-400">Brand Vendor</label>
          <select name="brand" className="w-full bg-gray-900 border border-gray-700 rounded-md p-2.5 focus:border-[#e47911] outline-none" required defaultValue={initialData?.brand?._id || initialData?.brand}>
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
        <label className="text-sm font-bold text-gray-400">Category</label>
        <select name="category" className="w-full bg-gray-900 border border-gray-700 rounded-md p-2.5 focus:border-[#e47911] outline-none mt-1" required defaultValue={initialData?.category?._id || initialData?.category}>
          <option value="">Select Category Path</option>
          {categories?.data && flattenCategories(categories.data).map(cat => (
            <option key={cat._id} value={cat._id}>
              {'—'.repeat(cat.level)} {cat.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-1">Manage categories in the &apos;Category Management&apos; page first.</p>
      </div>

      {/* SECTION 4: LOGISTICS & BADGES (NEW) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-900/30 border border-gray-700 rounded-xl">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#febd69] flex items-center gap-2">
            <Truck size={16} /> Shipping & Logistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <input name="weight" placeholder="Weight (e.g. 1.5 kg)" defaultValue={initialData?.shippingInfo?.weight} className="bg-gray-800 border border-gray-700 rounded-md p-2 text-sm outline-none focus:border-[#e47911]" />
            <input name="dimensions" placeholder="Dimensions (e.g. 10x5x2 cm)" defaultValue={initialData?.shippingInfo?.dimensions} className="bg-gray-800 border border-gray-700 rounded-md p-2 text-sm outline-none focus:border-[#e47911]" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#febd69] flex items-center gap-2">
            <ShieldCheck size={16} /> Badges & Status
          </h3>
          <div className="flex gap-6 mt-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" name="isPrime" defaultChecked={initialData?.isPrime} className="w-4 h-4 rounded border-gray-600 text-[#e47911] focus:ring-[#e47911] bg-gray-800" />
              <span className="text-sm text-gray-300 group-hover:text-white">Prime Eligible</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" name="isSmallBusiness" defaultChecked={initialData?.isSmallBusiness} className="w-4 h-4 rounded border-gray-600 text-[#e47911] focus:ring-[#e47911] bg-gray-800" />
              <span className="text-sm text-gray-300 group-hover:text-white">Small Business</span>
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 5: AMAZON SPECIFIC INPUTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BulletPointInput bulletPoints={bulletPoints} setBulletPoints={setBulletPoints} />
        <SpecificationInput specifications={specifications} setSpecifications={setSpecifications} />
      </div>

      {/* SECTION 6: DESCRIPTION & MEDIA */}
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

//test