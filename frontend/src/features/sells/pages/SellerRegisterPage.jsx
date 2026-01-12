import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterSellerMutation } from '../../../services/authApi';
import { updateUser, logout } from '../../auth/authSlice';
import { toast } from 'react-hot-toast';
import { Store, Loader2 } from 'lucide-react';

const SellerRegisterPage = () => {
  const [storeName, setStoreName] = useState('');
  const [registerSeller, { isLoading }] = useRegisterSellerMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storeName.trim()) return toast.error('Store Name is required');

    try {
      const res = await registerSeller({ storeName }).unwrap();
      
      // Update Redux state dengan role baru
      dispatch(updateUser({ role: 'seller', storeName: res.user.storeName }));
      
      toast.success('Seller account created successfully!');
      navigate('/seller/dashboard', { replace: true }); // Gunakan replace agar tidak bisa back ke form
    } catch (err) {
      const errorMessage = err?.data?.message || 'Failed to register as seller';
      toast.error(errorMessage);

      // FIX: Handle semua error 401 (sesi tidak valid) dengan lebih baik.
      // Jika backend bilang token user tidak valid, lebih aman untuk logout.
      if (err?.status === 401 && errorMessage !== 'Store Name is already taken.') {
        toast('Sesi Anda tidak valid. Silakan login kembali.', { icon: 'ℹ️' });
        dispatch(logout());
        navigate('/');
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md border">
        <h1 className="text-2xl font-bold mb-6 text-center">Create your Seller Account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Name
            </label>
            <div className="relative">
              <Store className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Enter your unique store name"
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:ring-1 focus:ring-[#e47911] focus:border-[#e47911] outline-none transition-all"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">This name will be displayed to customers on Amazon.</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#e47911] hover:bg-[#d16d0e] text-white font-bold py-2 px-4 rounded shadow-sm transition-colors flex justify-center items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Register and Start Selling'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerRegisterPage;
