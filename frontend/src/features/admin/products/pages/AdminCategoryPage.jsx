import { useState } from 'react';
import { useGetCategoriesQuery, useUpdateCategoryMutation, useCreateCategoryMutation, useDeleteCategoryMutation } from '../../../../services/categoryApi.js';
import { Plus, Tag, Trash2, Loader2, Edit2, Check, X} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminCategoryPage = () => {
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

    const handleUpdate = async (id) => {
      if (!editName.trim()) return toast.error('Name cannot be empty');
      try {
        await updateCategory({ id, name: editName }).unwrap();
        setEditingId(null);
        toast.success('Category updated!');
      } catch (err) {
        toast.error('Update failed');
        console.log(err);
      }
    };

      const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await createCategory({ name: newCategory }).unwrap();
      setNewCategory('');
      toast.success('Category added successfully!');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to add content category');
    }
  };


  const handleDelete = async (id) => {
  if (window.confirm('Delete this category?')) {
    try {
      await deleteCategory(id).unwrap();
      toast.success('Category deleted successfully');
    } catch  {
      toast.error('Failed to delete category');
    }
  }
};
  

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Tag className="text-[#e47911]" /> Category Management
        </h1>
        <p className="text-gray-500 text-sm">Manage product categories for your Amazon catalog</p>
      </header>

      {/* Form Tambah Kategori (Light Style) */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <input
            type="text"
            placeholder="Name of new category (ex: Elektronic)"
            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:border-[#e47911] focus:ring-1 focus:ring-[#e47911] outline-none transition-all"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            type="submit"
            disabled={isCreating}
            className="bg-[#ffd814] hover:bg-[#f7ca00] text-black px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 shadow-sm"
          >
            {isCreating ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            Add
          </button>
        </form>
      </div>

      {/* Daftar Kategori */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Category Name</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {isLoading ? (
              <tr><td className="p-10 text-center text-gray-400" colSpan="2">Loading category...</td></tr>
            ) : (
              categories?.data?.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {/* LOGIKA EDITING DISINI */}
                    {editingId === cat._id ? (
                      <input
                        type="text"
                        className="border border-orange-400 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-orange-200 w-full max-w-xs"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
        if (e.key === 'Enter') handleUpdate(cat._id);
        if (e.key === 'Escape') setEditingId(null);
      }}
                      />
                    ) : (
                      <span className="font-medium text-gray-800">{cat.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        {editingId === cat._id ? (
                          <>
                          <button 
                            onClick={() => handleUpdate(cat._id)}
                            className="text-green-600 hover:text-green-700 p-1"
                            title="Save Changes"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="text-gray-400 hover:text-gray-600 p-1"
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
                    setEditingId(cat._id);
                    setEditName(cat.name);
                    }}
                   className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                   title="Edit Category"
                >
                   <Edit2 size={18} />
                  </button>
                  <button 
                      onClick={() => handleDelete(cat._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      title="Delete Category"            
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

export default AdminCategoryPage;