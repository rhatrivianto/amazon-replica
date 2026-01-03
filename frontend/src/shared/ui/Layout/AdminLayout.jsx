

import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar'; // Impor komponen sidebar asli Anda

const AdminLayout = () => {
  // Gunakan state untuk mengontrol buka/tutup sidebar di mobile
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Daftar ini sekarang hanya digunakan untuk judul Header saja
  const pageTitles = {
    '/admin/dashboard': 'Dashboard',
    '/admin/products': 'Inventory Management',
    '/admin/products/create': 'Add New Product',
    '/admin/categories': 'Category Management',
    '/admin/brands': 'Brand Registry',
    '/admin/database-monitor': 'System Monitor',
  };

  return (
    <div className="flex h-screen bg-[#f0f2f2] overflow-hidden">
  {/* SIDEBAR: Pastikan komponen Sidebar Anda menerima prop isOpen */}
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
    {/* MAIN CONTENT AREA */}
          <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
            isSidebarOpen ? 'md:ml-64' : 'ml-0'
          }`}>
            {/* HEADER */}
      <header className="bg-white shadow-sm h-16 flex justify-between items-center px-6 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Tombol Hamburger untuk Toggle Sidebar jika tertutup */}
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-md text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
        
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
            {pageTitles[location.pathname] || 'Admin Central'}
          </h2>
        </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-500">Logged in as</p>
              <p className="text-sm font-bold text-gray-800">Rully Admin</p>
            </div>
            <div className="w-10 h-10 bg-[#febd69] rounded-full flex items-center justify-center font-bold text-[#131921] shadow-inner">
              R
            </div>
          </div>
        </header>

            {/* PAGE CONTENT */}
        <section className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f0f2f2]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;