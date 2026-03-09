// import { ShoppingCart, Menu, MapPin, ChevronDown } from 'lucide-react';
// import { useState } from 'react';
// import CategorySidebar from './CategorySidebar.jsx';
// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { useGetCartQuery } from '../../../services/cartApi.js';
// import { selectUserInfo, logout } from '../../../features/auth/authSlice.js';
// import SearchBar from './SearchBar.jsx';
// import logoUrl from '../../../assets/amazon-logo-white.jpg';

// const Navbar = ({ onOpenAuth }) => { // 1. Terima props onOpenAuth dari AppRouter
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const userInfo = useSelector(selectUserInfo);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { data: cartData } = useGetCartQuery(undefined, { skip: !userInfo });
//   const cartBadgeCount = cartData?.data?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

//   return (
//     <>
//       <nav className="fixed top-0 w-full z-[100] shadow-md bg-[#131921]">
//         <div className="px-4 py-2 flex items-center gap-2 md:gap-4">{/* Perkecil gap di mobile */}
//           {/* Logo */}
//           <Link to="/" className="shrink-0 border border-transparent hover:border-white p-1">
//             <img src={logoUrl} alt="Amazon" className="h-6 md:h-7 object-contain" />
//           </Link>

//          {/* Location: Tetap hidden lg:flex sudah benar */}
//           <div className="hidden lg:flex items-center text-white border border-transparent hover:border-white p-1 cursor-pointer">
//             <MapPin size={18} className="mt-2" />
//             <div className="text-xs ml-1 flex flex-col">
//               <span className="text-gray-400">Deliver to</span>
//               <span className="font-bold -mt-1">Indonesia</span>
//             </div>
//           </div>

//           {/* SearchBar: Kita beri flex-grow agar dia mengambil sisa ruang yang tersedia */}
//           <div className="flex-grow">
//           <SearchBar />
//           </div>

//         {/* Account & Lists: SEMBUNYIKAN NAMA DI MOBILE */}
//           <div 
//             onClick={() => !userInfo && onOpenAuth()} // 2. Gunakan onOpenAuth, bukan state lokal
//             className="group relative border border-transparent hover:border-white p-1 cursor-pointer flex flex-col text-white min-w-fit md:min-w-[120px]"
//           >
//             {/* RUBAH DI SINI: hidden md:block agar "Hello" hilang di HP */}
//             <span className="text-[10px] md:text-xs text-gray-300 hidden md:block">Hello, {userInfo ? userInfo.name : 'Sign in'}</span>
//             <div className="flex items-center font-bold text-[11px] md:text-sm">
//             {/* RUBAH DI SINI: Di mobile cukup "Account" saja atau icon */}
//             <span className="hidden md:inline">Account & Lists</span>
//               <span className="md:hidden">Account</span>
//               <ChevronDown size={14} className="ml-1 text-gray-400" />
//             </div>
            
//             {userInfo && (
//               <div className="absolute top-full right-0 mt-0 w-40 bg-white text-black hidden group-hover:block shadow-xl p-4 z-[110] border">
//                 <div className="flex flex-col gap-2 mb-3 border-b pb-2">
//                   <Link to="/account/orders" className="text-sm hover:text-orange-600 hover:underline">
//                     Your Orders
//                   </Link>
//                   <Link to="/account/addresses" className="text-sm hover:text-orange-600 hover:underline">
//                     Your Addresses
//                   </Link>
//                   <Link to="/account/wishlist" className="text-sm hover:text-orange-600 hover:underline">
//                     Your Wish List
//                   </Link>
//                   <Link to="/account" className="text-sm hover:text-orange-600 hover:underline">
//                     Your Account
//                   </Link>
//                 </div>

//                 <button 
//                   onClick={() => {
//                     dispatch(logout());
//                     navigate('/'); // Arahkan ke home setelah logout
//                   }}
//                   className="text-sm hover:text-orange-600 w-full text-left font-medium"
//                 >
//                   Sign Out
//                 </button>
//               </div>
//             )}
//           </div>

//         {/* Cart: PASTIKAN TIDAK TERPOTONG */}
//           <Link to="/cart" className="flex items-center gap-1 text-white border border-transparent hover:border-white p-1 relative shrink-0">
//             <div className="relative">
//               <span className="absolute -top-1 md:-top-2 left-3 md:left-4 text-[#f08804] font-bold text-lg bg-[#131921] px-1 rounded-full">
//                 {cartBadgeCount}
//               </span>
//               <ShoppingCart size={24} className="md:w-8 md:h-8" /> {/* Ukuran icon dinamis */}
//             </div>
//             {/* RUBAH DI SINI: Sembunyikan tulisan "Cart" di HP agar hemat ruang */}
//             <span className="text-sm font-bold mt-3 hidden sm:block">Cart</span>
//           </Link>
//         </div>

//       {/* Sub-nav: Sembunyikan link yang terlalu banyak di Mobile */}
//         <div className="bg-[#232f3e] px-4 py-1 flex items-center gap-2 md:gap-4 text-white text-xs md:text-sm overflow-x auto no-scrollbar">
//           <button 
//             onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-1 font-bold shrink-0" >
//             <Menu size={20} /> All
//           </button>
//           <Link to="/" className="hover:border-white border border-transparent p-1 px-2">Today&apos;s Deals</Link>
//           <Link to="/" className="hover:border-white border border-transparent p-1 px-2">Customer Service</Link>
//           <NavLink 
//             to="/sell" 
//             end
//             className={({ isActive }) => 
//               `p-1 px-2 border ${isActive ? 'border-white' : 'border-transparent hover:border-white'}`
//             }
//           >
//             Sell
//           </NavLink>
//           <NavLink to="/sell/guide" className={({ isActive }) => `p-1 px-2 border ${isActive ? 'border-white' : 'border-transparent hover:border-white'}`}>
//             Seller Guide
//           </NavLink>
//           <NavLink to="/sell/pricing" className={({ isActive }) => `p-1 px-2 border ${isActive ? 'border-white' : 'border-transparent hover:border-white'}`}>
//             Pricing
//           </NavLink>
//         </div>
//       </nav>

//       <CategorySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
//     </>
//   );
// };

// export default Navbar;


import { ShoppingCart, Menu, MapPin, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import CategorySidebar from './CategorySidebar.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetCartQuery } from '../../../services/cartApi.js';
import { selectUserInfo, logout } from '../../../features/auth/authSlice.js';
import SearchBar from './SearchBar.jsx';

// 1. PENTING: Terima props 'onOpenAuth' agar tombol Sign In bisa memanggil Modal
const Navbar = ({ onOpenAuth }) => { 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 2. Gunakan API Cart untuk badge realtime (Fitur Baru)
  // Pastikan userInfo ada sebelum request cart
  const { data: cartData, error } = useGetCartQuery(undefined, { 
    skip: !userInfo,
    refetchOnMountOrArgChange: true, // Paksa ambil data baru saat komponen dipasang
  });
  
  // DEBUG: Cek data keranjang di Console
  // console.log("🛒 [Navbar] Cart Data:", cartData);
  if (error) console.warn("🛒 [Navbar] Cart Fetch Error (Normal if cart empty):", error);

  const cartBadgeCount = cartData?.data?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] shadow-md bg-[#131921] text-white">
        <div className="px-4 py-2 flex items-center gap-2 md:gap-4">
          
          {/* Logo */}
          <Link to="/" className="shrink-0 border border-transparent hover:border-white p-1 rounded">
             <div className="text-2xl font-bold tracking-tighter">amazon<span className="text-[#febd69]">.KW</span></div>
          </Link>

          {/* Location (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center border border-transparent hover:border-white p-1 cursor-pointer">
            <MapPin size={18} className="mt-2" />
            <div className="text-xs ml-1 flex flex-col leading-none">
              <span className="text-gray-400">Deliver to</span>
              <span className="font-bold">Indonesia</span>
            </div>
          </div>

          {/* SearchBar (Fitur Lama Dikembalikan) */}
          <div className="flex-grow">
             <SearchBar />
          </div>

          {/* Account & Lists */}
          <div 
            // 3. LOGIKA KLIK: Jika belum login, panggil onOpenAuth (Modal). 
            // Jika sudah login, dropdown akan muncul via CSS group-hover
            onClick={() => !userInfo && onOpenAuth && onOpenAuth()} 
            className="group relative border border-transparent hover:border-white p-1 cursor-pointer flex flex-col min-w-fit md:min-w-[120px]"
          >
            <span className="text-[10px] md:text-xs text-gray-300 hidden md:block">
              Hello, {userInfo ? userInfo.name.split(' ')[0] : 'Sign in'}
            </span>
            <div className="flex items-center font-bold text-[11px] md:text-sm leading-none">
              <span className="hidden md:inline">Account & Lists</span>
              <span className="md:hidden">Account</span>
              <ChevronDown size={14} className="ml-1 text-gray-400" />
            </div>
            
            {/* Dropdown Menu (Hanya muncul jika sudah login) */}
            {userInfo && (
              <div className="absolute top-full right-0 mt-0 w-48 bg-white text-black hidden group-hover:block shadow-xl rounded-md p-2 z-[110] border">
                 <Link to="/account" className="block px-4 py-2 hover:bg-gray-100 text-sm">Your Account</Link>
                 <Link to="/account/orders" className="block px-4 py-2 hover:bg-gray-100 text-sm">Your Orders</Link>
                 <Link to="/account/wishlist" className="block px-4 py-2 hover:bg-gray-100 text-sm">Your Wishlist</Link>
                 {userInfo.role === 'admin' && (
                    <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100 text-sm font-bold text-orange-600">Admin Dashboard</Link>
                  )}
                  {userInfo.role === 'seller' && (
                    <Link to="/seller/dashboard" className="block px-4 py-2 hover:bg-gray-100 text-sm font-bold text-blue-600">Seller Dashboard</Link>
                  )}
                 <button 
                  onClick={() => {
                    dispatch(logout());
                    navigate('/');
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600 border-t mt-1"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Orders (Hidden on Mobile) */}
          <Link to="/account/orders" className="hidden sm:block border border-transparent hover:border-white p-1 rounded">
            <div className="text-xs text-gray-300 leading-none">Returns</div>
            <div className="font-bold text-sm leading-none">& Orders</div>
          </Link>

          {/* Cart Badge (Fitur Baru) */}
          <Link to="/cart" className="flex items-end border border-transparent hover:border-white p-2 relative shrink-0">
            <div className="relative">
              <span className="absolute -top-1 -right-1 bg-[#febd69] text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartBadgeCount > 99 ? '99+' : cartBadgeCount}
              </span>
              <ShoppingCart size={30} />
            </div>
            <span className="font-bold text-sm hidden sm:block ml-1 mb-1">Cart</span>
          </Link>
        </div>

        {/* Sub-nav (Fitur Lama Dikembalikan) */}
        <div className="bg-[#232f3e] px-4 py-1 flex items-center gap-4 text-white text-sm overflow-x-auto no-scrollbar">
          <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-1 font-bold hover:border hover:border-white p-1 rounded">
            <Menu size={20} /> All
          </button>
          <Link to="/" className="hover:border hover:border-white p-1 rounded whitespace-nowrap">Today&apos;s Deals</Link>
          <Link to="/" className="hover:border hover:border-white p-1 rounded whitespace-nowrap">Customer Service</Link>
          <Link to="/sell" className="hover:border hover:border-white p-1 rounded whitespace-nowrap">Sell</Link>
        </div>
      </nav>

      {/* Sidebar Kategori (Fitur Lama Dikembalikan) */}
      <CategorySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Navbar;
