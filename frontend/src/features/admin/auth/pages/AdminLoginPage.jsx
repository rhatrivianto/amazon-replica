import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAdminLoginMutation } from '../../../../services/adminAuthApi.js';
import { useDispatch } from 'react-redux';
import { setAdminCredentials } from '../adminAuthSlice.js'; // Path disesuaikan // Pastikan file service ini sudah ada nanti

const AdminLoginPage = () => {
const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [login, { isLoading }] = useAdminLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Inisialisasi dispatc

const handleLogin = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Memverifikasi kredensial Admin...');

    try {
      const result = await login({ email, password }).unwrap();
      
      // KRUSIAL: Simpan ke Redux Store agar ProtectedRoute tahu kita sudah login
      dispatch(setAdminCredentials({ 
        admin: result.user, 
        token: result.token 
      }));
      
      toast.success(`Selamat datang, ${result.user.name}!`, { id: loadingToast });
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.data?.message || "Kredensial Admin Salah", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      {/* Container Card */}
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Dekorasi Aksen Kuning Amazon di bagian atas card */}
        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>

        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-yellow-500/10 rounded-full text-yellow-500 mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Amazon Admin Portal</h1>
          <p className="text-gray-500 text-sm mt-2">Sistem Manajemen Gudang & Inventaris</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Input Email */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-500" size={18} />
            <input 
              type="email" 
              required
              placeholder="Admin Email" 
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 pl-10 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          {/* Input Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
            <input 
              type="password" 
              required
              placeholder="Password" 
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 pl-10 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-700 disabled:text-gray-500 text-black font-extrabold py-3 rounded-xl transition-all shadow-lg shadow-yellow-500/10 flex justify-center items-center"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            ) : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-600 uppercase tracking-widest">
            Internal Use Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;