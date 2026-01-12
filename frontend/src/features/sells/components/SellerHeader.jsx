import { Link } from 'react-router-dom';

const SellerHeader = () => {
  return (
    <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center border-b sticky top-0 z-50">
      <Link to="/seller/dashboard">
        <img src="/amazon-logo-black.png" alt="Amazon Seller Central" className="h-8" />
      </Link>
      
      <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
        <Link to="/seller/dashboard" className="hover:text-[#e47911]">Dashboard</Link>
        <Link to="/seller/inventory" className="hover:text-[#e47911]">Inventory</Link>
        <Link to="/seller/orders" className="hover:text-[#e47911]">Orders</Link>
      </nav>

      <Link to="/" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline font-medium">
        Return to Amazon.com
      </Link>
    </header>
  );
};

export default SellerHeader;
