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
       toast.error("Failed to logout:", error || "Unexpected failure")
    } finally {
      localStorage.removeItem('adminToken');
      toast.success("Successfully logged out from Dashboard");
      navigate('/admin/login');
    }
  };

  return {
    isAuthenticated,
    token,
    logout
  };
};
