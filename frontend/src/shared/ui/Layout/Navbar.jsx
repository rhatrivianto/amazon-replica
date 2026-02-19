import { ShoppingCart, Menu, MapPin, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import CategorySidebar from './CategorySidebar.jsx';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetCartQuery } from '../../../services/cartApi.js';
import { selectUserInfo, logout } from '../../../features/auth/authSlice.js';
import SearchBar from './SearchBar.jsx';

const Navbar = ({ onOpenAuth }) => { // 1. Terima props onOpenAuth dari AppRouter
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: cartData } = useGetCartQuery(undefined, { skip: !userInfo });
  const cartBadgeCount = cartData?.data?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] shadow-md bg-[#131921]">
        <div className="px-4 py-2 flex items-center gap-2 md:gap-4">{/* Perkecil gap di mobile */}
          {/* Logo */}
          <Link to="/" className="shrink-0 border border-transparent hover:border-white p-1">
            <img src="/amazon-logo-white.png?v=2" alt="Amazon" className="h-6 md:h-7 object-contain" />
          </Link>

         {/* Location: Tetap hidden lg:flex sudah benar */}
          <div className="hidden lg:flex items-center text-white border border-transparent hover:border-white p-1 cursor-pointer">
            <MapPin size={18} className="mt-2" />
            <div className="text-xs ml-1 flex flex-col">
              <span className="text-gray-400">Deliver to</span>
              <span className="font-bold -mt-1">Indonesia</span>
            </div>
          </div>

          {/* SearchBar: Kita beri flex-grow agar dia mengambil sisa ruang yang tersedia */}
          <div className="flex-grow">
          <SearchBar />
          </div>

        {/* Account & Lists: SEMBUNYIKAN NAMA DI MOBILE */}
          <div 
            onClick={() => !userInfo && onOpenAuth()} // 2. Gunakan onOpenAuth, bukan state lokal
            className="group relative border border-transparent hover:border-white p-1 cursor-pointer flex flex-col text-white min-w-fit md:min-w-[120px]"
          >
            {/* RUBAH DI SINI: hidden md:block agar "Hello" hilang di HP */}
            <span className="text-[10px] md:text-xs text-gray-300 hidden md:block">Hello, {userInfo ? userInfo.name : 'Sign in'}</span>
            <div className="flex items-center font-bold text-[11px] md:text-sm">
            {/* RUBAH DI SINI: Di mobile cukup "Account" saja atau icon */}
            <span className="hidden md:inline">Account & Lists</span>
              <span className="md:hidden">Account</span>
              <ChevronDown size={14} className="ml-1 text-gray-400" />
            </div>
            
            {userInfo && (
              <div className="absolute top-full right-0 mt-0 w-40 bg-white text-black hidden group-hover:block shadow-xl p-4 z-[110] border">
                <div className="flex flex-col gap-2 mb-3 border-b pb-2">
                  <Link to="/account/orders" className="text-sm hover:text-orange-600 hover:underline">
                    Your Orders
                  </Link>
                  <Link to="/account/addresses" className="text-sm hover:text-orange-600 hover:underline">
                    Your Addresses
                  </Link>
                  <Link to="/account" className="text-sm hover:text-orange-600 hover:underline">
                    Your Account
                  </Link>
                </div>

                <button 
                  onClick={() => {
                    dispatch(logout());
                    navigate('/'); // Arahkan ke home setelah logout
                  }}
                  className="text-sm hover:text-orange-600 w-full text-left font-medium"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

        {/* Cart: PASTIKAN TIDAK TERPOTONG */}
          <Link to="/cart" className="flex items-center gap-1 text-white border border-transparent hover:border-white p-1 relative shrink-0">
            <div className="relative">
              <span className="absolute -top-1 md:-top-2 left-3 md:left-4 text-[#f08804] font-bold text-lg bg-[#131921] px-1 rounded-full">
                {cartBadgeCount}
              </span>
              <ShoppingCart size={24} className="md:w-8 md:h-8" /> {/* Ukuran icon dinamis */}
            </div>
            {/* RUBAH DI SINI: Sembunyikan tulisan "Cart" di HP agar hemat ruang */}
            <span className="text-sm font-bold mt-3 hidden sm:block">Cart</span>
          </Link>
        </div>

      {/* Sub-nav: Sembunyikan link yang terlalu banyak di Mobile */}
        <div className="bg-[#232f3e] px-4 py-1 flex items-center gap-2 md:gap-4 text-white text-xs md:text-sm overflow-x auto no-scrollbar">
          <button 
            onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-1 font-bold shrink-0" >
            <Menu size={20} /> All
          </button>
          <Link to="/" className="hover:border-white border border-transparent p-1 px-2">Today&apos;s Deals</Link>
          <Link to="/" className="hover:border-white border border-transparent p-1 px-2">Customer Service</Link>
          <NavLink 
            to="/sell" 
            end
            className={({ isActive }) => 
              `p-1 px-2 border ${isActive ? 'border-white' : 'border-transparent hover:border-white'}`
            }
          >
            Sell
          </NavLink>
          <NavLink to="/sell/guide" className={({ isActive }) => `p-1 px-2 border ${isActive ? 'border-white' : 'border-transparent hover:border-white'}`}>
            Seller Guide
          </NavLink>
          <NavLink to="/sell/pricing" className={({ isActive }) => `p-1 px-2 border ${isActive ? 'border-white' : 'border-transparent hover:border-white'}`}>
            Pricing
          </NavLink>
        </div>
      </nav>

      <CategorySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Navbar;