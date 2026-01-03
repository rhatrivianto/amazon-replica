import { useNavigate } from 'react-router-dom';
import { useAdminLogoutMutation } from '../../../../services/adminAuthApi.js';
import { toast } from 'react-hot-toast';

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const [logoutApi] = useAdminLogoutMutation();

  // 1. Cek apakah ada token di storage
  const token = localStorage.getItem('adminToken');
  const isAuthenticated = !!token;

  // 2. Fungsi Logout yang bersih
  const logout = async () => {
    try {
      // Panggil API logout jika diperlukan
      await logoutApi().unwrap();
    } catch (error) {
       toast.error("Gagal logout:", error || "Terjadi kesalahan tak terduga")
    } finally {
      localStorage.removeItem('adminToken');
      toast.success("Berhasil keluar dari Dashboard");
      navigate('/admin/login');
    }
  };

  return {
    isAuthenticated,
    token,
    logout
  };
};