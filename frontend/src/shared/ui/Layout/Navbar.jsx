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
        <div className="px-4 py-2 flex items-center gap-4">
          <Link to="/" className="shrink-0 border border-transparent hover:border-white p-1">
            <img src="/amazon-logo-white.png" alt="Amazon" className="h-7 object-contain" />
          </Link>

          {/* Location */}
          <div className="hidden lg:flex items-center text-white border border-transparent hover:border-white p-1 cursor-pointer">
            <MapPin size={18} className="mt-2" />
            <div className="text-xs ml-1 flex flex-col">
              <span className="text-gray-400">Deliver to</span>
              <span className="font-bold -mt-1">Indonesia</span>
            </div>
          </div>

          <SearchBar />

          {/* Account & Lists */}
          <div 
            onClick={() => !userInfo && onOpenAuth()} // 2. Gunakan onOpenAuth, bukan state lokal
            className="group relative border border-transparent hover:border-white p-1 cursor-pointer flex flex-col text-white min-w-[120px]"
          >
            <span className="text-xs text-gray-300">Hello, {userInfo ? userInfo.name : 'Sign in'}</span>
            <div className="flex items-center font-bold text-sm">
              Account & Lists <ChevronDown size={14} className="ml-1 text-gray-400" />
            </div>
            
            {userInfo && (
              <div className="absolute top-full right-0 mt-0 w-40 bg-white text-black hidden group-hover:block shadow-xl p-4 z-[110] border">
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

          {/* Cart */}
          <Link to="/cart" className="flex items-center gap-1 text-white border border-transparent hover:border-white p-1 relative">
            <div className="relative">
              <span className="absolute -top-2 left-4 text-[#f08804] font-bold text-lg bg-[#131921] px-1">
                {cartBadgeCount}
              </span>
              <ShoppingCart size={32} />
            </div>
            <span className="text-sm font-bold mt-3">Cart</span>
          </Link>
        </div>

        {/* Sub-nav */}
        <div className="bg-[#232f3e] px-4 py-1 flex items-center gap-4 text-white text-sm">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="flex items-center gap-1 font-bold border border-transparent hover:border-white p-1 px-2"
          >
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