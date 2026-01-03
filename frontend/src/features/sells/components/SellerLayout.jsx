import { Outlet } from 'react-router-dom';
import SellerHeader from './SellerHeader';
import SellerFooter from './SellerFooter';

const SellerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <SellerHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <SellerFooter />
    </div>
  );
};

export default SellerLayout;