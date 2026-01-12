import { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../auth/authSlice';
import SellerLandingPage from '../components/SellerLandingPage';

const SellPage = () => {
  const navigate = useNavigate();
  const context = useOutletContext();
  const openAuthModal = context?.openAuthModal || (() => console.warn('AuthModal context missing'));
  const userInfo = useSelector(selectUserInfo);
  const hasStoreName = !!userInfo?.storeName;


  // Cek apakah user memiliki role/status seller
  const isSeller = userInfo?.role === 'seller';

  useEffect(() => {
    if (isSeller) {
      if (hasStoreName) {
        navigate('/seller/dashboard', { replace: true });
      } else {
        // KASUS USTMAN: Sudah role seller tapi belum ada nama toko? Ke halaman register untuk lengkapi data
        navigate('/sell-account/register', { replace: true });
      }
    }
  }, [isSeller, hasStoreName, navigate]);

  const handleStartSelling = () => {
    if (!userInfo) {
      // Jika belum login, buka AuthModal langsung ke mode Signup Seller
      openAuthModal('signup', true);
    } else {
      // Jika sudah login tapi belum seller, arahkan ke register seller
      navigate('/sell-account/register');
    }
  };

  return (
    <SellerLandingPage onRegister={handleStartSelling} />
  );
};

export default SellPage;