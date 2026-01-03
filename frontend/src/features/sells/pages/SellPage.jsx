import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../auth/authSlice';
import SellerLandingPage from '../components/SellerLandingPage';

const SellPage = () => {
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);

  // Cek apakah user memiliki role/status seller
  const isSeller = userInfo?.roles?.includes('seller') || userInfo?.isSeller;

  useEffect(() => {
    if (isSeller) {
      navigate('/seller/dashboard');
    }
  }, [isSeller, navigate]);

  const handleStartSelling = () => {
    if (!userInfo) {
      // Jika belum login, arahkan ke login
      navigate('/login'); 
    } else {
      // Jika sudah login tapi belum seller, arahkan ke register seller
      navigate('/seller/register');
    }
  };

  return (
    <SellerLandingPage onRegister={handleStartSelling} />
  );
};

export default SellPage;