import { useState } from 'react';
import { 
  useGetSellerContentsQuery, 
  useCreateSellerContentMutation, 
  useDeleteSellerContentMutation 
} from '../../../../services/sellerContentApi.js';
import { Trash2, Plus, Globe, TrendingUp, CheckCircle2, Star, DollarSign, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ManageSellerContentPage = () => {
  const { data: contentData, isLoading } = useGetSellerContentsQuery();
  const [createContent, { isLoading: isCreating }] = useCreateSellerContentMutation();
  const [deleteContent, { isLoading: isDeleting }] = useDeleteSellerContentMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    iconKey: 'globe',
    section: 'guides'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createContent(formData).unwrap();
      toast.success('Konten berhasil ditambahkan!');
      setFormData({ title: '', description: '', iconKey: 'globe', section: 'guides' });
    } catch {
      toast.error('Gagal menambah konten');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus konten ini?')) {
      try {
        await deleteContent(id).unwrap();
        toast.success('Konten dihapus');
      } catch {
        toast.error('Gagal menghapus');
      }
    }
  };

  const getIcon = (key) => {
    const icons = {
      globe: <Globe size={20} />,
      trending: <TrendingUp size={20} />,
      check: <CheckCircle2 size={20} />,
      star: <Star size={20} />,
      dollar: <DollarSign size={20} />
    };
    return icons[key] || icons.globe;
  };

  if (isLoading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline" /> Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Seller Landing Page</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Input */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200 sticky top-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Plus size={20} /> Tambah Konten Baru
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-400 outline-none"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea 
                  required
                  rows="3"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-400 outline-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={formData.iconKey}
                    onChange={e => setFormData({...formData, iconKey: e.target.value})}
                  >
                    <option value="globe">Globe</option>
                    <option value="trending">Trending</option>
                    <option value="check">Checklist</option>
                    <option value="star">Star</option>
                    <option value="dollar">Dollar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={formData.section}
                    onChange={e => setFormData({...formData, section: e.target.value})}
                  >
                    <option value="guides">Guides (Grid Bawah)</option>
                    <option value="incentives">Incentives</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isCreating}
                className="w-full bg-[#e47911] hover:bg-[#d66c08] text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
              >
                {isCreating ? 'Menyimpan...' : 'Simpan Konten'}
              </button>
            </form>
          </div>
        </div>

        {/* List Content */}
        <div className="lg:col-span-2 space-y-4">
          {contentData?.data?.map((item) => (
            <div key={item._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-start justify-between group hover:border-orange-300 transition-colors">
              <div className="flex gap-4">
                <div className="p-3 bg-orange-50 rounded-full text-[#e47911] h-fit">
                  {getIcon(item.iconKey)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <span className="inline-block mt-2 text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase tracking-wider">{item.section}</span>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(item._id)}
                disabled={isDeleting}
                className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                title="Hapus"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          
          {contentData?.data?.length === 0 && (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded border border-dashed">
              Belum ada konten. Silakan tambahkan dari form di sebelah kiri.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSellerContentPage;
