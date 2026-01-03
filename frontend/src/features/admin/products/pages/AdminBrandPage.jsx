import { useState } from 'react';
import { useGetBrandsQuery, useCreateBrandMutation, useDeleteBrandMutation } from '../../../../services/brandApi.js';
import { Plus, Award, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminBrandPage = () => {
  const [newBrand, setNewBrand] = useState('');
  const { data: brands, isLoading } = useGetBrandsQuery();
  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();
  
  const handleAddBrand = async (e) => {
    e.preventDefault();
    if (!newBrand.trim()) return;
    try {
      await createBrand({ name: newBrand }).unwrap();
      setNewBrand('');
      toast.success('Brand resmi terdaftar!');
    } catch (err) {
      toast.error(err.data?.message || 'Gagal mendaftarkan brand');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus brand ini dari registry?')) {
      try {
        await deleteBrand(id).unwrap();
        toast.success('Brand dihapus');
      } catch {
        toast.error('Gagal menghapus');
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Award className="text-[#e47911]" /> Brand Registry
        </h1>
        <p className="text-gray-500 text-sm">Kelola merk dagang yang tersedia di katalog Anda</p>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <form onSubmit={handleAddBrand} className="flex gap-4">
          <input
            type="text"
            placeholder="Nama Brand Baru (Contoh: Samsung, Nike)"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-[#e47911]"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
          />
          <button
            type="submit"
            disabled={isCreating}
            className="bg-[#ffd814] hover:bg-[#f7ca00] text-black px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
          >
            {isCreating ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            Daftarkan
          </button>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Nama Merk</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td className="p-10 text-center" colSpan="2">Memuat data brand...</td></tr>
            ) : (
              brands?.data?.map((brand) => (
                <tr key={brand._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{brand.name}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(brand._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBrandPage;