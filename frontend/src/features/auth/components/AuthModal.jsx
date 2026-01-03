import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserCredentials } from '../../../features/auth/authSlice.js';
import { useLoginMutation, useRegisterMutation } from '../../../services/authApi.js';
import { toast } from 'react-hot-toast';
import { X, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('signin');
  const [isWaitingVerify, setIsWaitingVerify] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // Hook dari RTK Query
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'signin') {
        // Proses LOGIN
        const userData = await login({ 
          email: formData.email, 
          password: formData.password 
        }).unwrap();
        
        dispatch(setUserCredentials({ 
          user: userData.user, 
          token: userData.token 
        }));
        toast.success(`Selamat datang kembali, ${userData.user.name}!`);
        onClose();
      } else {
        // Proses REGISTER
        await register(formData).unwrap();
        setIsWaitingVerify(true); 
        toast.success('Email verifikasi dikirim ke Mailtrap');
      }
    } catch (err) {
      // Menangkap error 403 (Admin dilarang atau Belum Verifikasi)
      const errorMessage = err.data?.message || 'Terjadi kesalahan sistem';
      toast.error(errorMessage, { duration: 5000 });
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 text-gray-400 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
             <h2 className="text-2xl font-bold text-gray-900">
               {isWaitingVerify ? 'Check Your Email' : activeTab === 'signin' ? 'Sign-In' : 'Create Account'}
             </h2>
          </div>

          {!isWaitingVerify && (
            <div className="flex border-b mb-6">
              <button 
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-2 font-bold transition-all ${activeTab === 'signin' ? 'border-b-2 border-[#e47911] text-[#e47911]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Sign-In
              </button>
              <button 
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2 font-bold transition-all ${activeTab === 'signup' ? 'border-b-2 border-[#e47911] text-[#e47911]' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Create Account
              </button>
            </div>
          )}

          {isWaitingVerify ? (
            /* TAMPILAN SETELAH REGISTER (MENUNGGU VERIFIKASI) */
            <div className="text-center py-6">
              <div className="bg-blue-50 p-4 rounded-md mb-6 border border-blue-100 shadow-sm">
                 <p className="text-sm text-blue-800 leading-relaxed">
                   Kami telah mengirimkan link aktivasi ke <br/>
                   <span className="font-bold">{formData.email}</span>. <br/>
                   <span className="mt-2 block italic text-xs text-blue-600">(Silakan cek inbox Mailtrap Anda)</span>
                 </p>
              </div>
              <button 
                onClick={() => { setIsWaitingVerify(false); setActiveTab('signin'); }}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black font-medium py-2 rounded-md shadow-sm transition-colors"
              >
                Sudah Verifikasi? Sign-In Sekarang
              </button>
            </div>
          ) : (
            /* FORM SIGN-IN / SIGN-UP */
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'signup' && (
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    required
                    className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:ring-1 focus:ring-[#e47911] focus:border-[#e47911] outline-none transition-all"
                    onChange={handleChange}
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  required
                  className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:ring-1 focus:ring-[#e47911] focus:border-[#e47911] outline-none transition-all"
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:ring-1 focus:ring-[#e47911] focus:border-[#e47911] outline-none transition-all"
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn || isRegistering}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] disabled:bg-gray-200 disabled:cursor-not-allowed text-black font-medium py-2 rounded-md shadow-sm flex items-center justify-center gap-2 transition-all mt-2"
              >
                {isLoggingIn || isRegistering ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {activeTab === 'signin' ? 'Sign-In' : 'Continue'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="text-[11px] text-gray-600 mt-4 leading-tight">
                By continuing, you agree to Amazon Clone&apos;s <span className="text-blue-600 hover:underline cursor-pointer">Conditions of Use</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Notice</span>.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;