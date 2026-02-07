import { useState } from 'react';
import { useGetBrandsQuery, useUpdateBrandMutation, useCreateBrandMutation, useDeleteBrandMutation } from '../../../../services/brandApi.js';
// Tambahkan Edit2, Check, dan X di import lucide-react
import { Plus, Award, Trash2, Loader2, Edit2, Check, X } from 'lucide-react'; 
import { toast } from 'react-hot-toast';

const AdminBrandPage = () => {
  const [newBrand, setNewBrand] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const { data: brands, isLoading } = useGetBrandsQuery();
  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  const handleUpdate = async (id) => {
    if (!editName.trim()) return toast.error('Name cannot be empty');
    try {
      await updateBrand({ id, name: editName }).unwrap();
      setEditingId(null);
      toast.success('Brand updated!');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    if (!newBrand.trim()) return;
    try {
      await createBrand({ name: newBrand }).unwrap();
      setNewBrand('');
      toast.success('Official Brand registered!');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to register brand');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this brand from registry?')) {
      try {
        await deleteBrand(id).unwrap();
        toast.success('Brand deleted');
      } catch {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Award className="text-[#e47911]" /> Brand Registry
        </h1>
        <p className="text-gray-500 text-sm">Manage trademarks available in your registered catalog!</p>
      </header>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <form onSubmit={handleAddBrand} className="flex gap-4">
          <input
            type="text"
            placeholder="Name of new brand (Contoh: Samsung, Nike)"
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
            Signup
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
                  <td className="px-6 py-4">
                    {/* LOGIKA EDITING DISINI */}
                    {editingId === brand._id ? (
                      <input
                        type="text"
                        className="border border-orange-400 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-orange-200 w-full max-w-xs"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
        if (e.key === 'Enter') handleUpdate(brand._id);
        if (e.key === 'Escape') setEditingId(null);
      }}
                      />
                    ) : (
                      <span className="font-medium text-gray-800">{brand.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      {editingId === brand._id ? (
                        <>
                          <button 
                            onClick={() => handleUpdate(brand._id)}
                            className="text-green-600 hover:text-green-700 p-1"
                            title="Save Changes"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                            title="Cancel"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => {
                              setEditingId(brand._id);
                              setEditName(brand.name);
                            }}
                            className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                            title="Edit Brand"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(brand._id)} 
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Delete Brand"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
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