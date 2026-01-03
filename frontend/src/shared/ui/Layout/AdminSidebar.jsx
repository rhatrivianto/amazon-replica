import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Package, PlusCircle, ClipboardList, 
  Home, ChevronRight, Database, Award, X
} from "lucide-react";

// Terima prop isOpen dan toggleSidebar dari AdminLayou
const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Inventory", path: "/admin/products", icon: Package },
    { name: "Add Product", path: "/admin/products/create", icon: PlusCircle },
    { name: "Categories", path: "/admin/categories", icon: ClipboardList },
    { name: "Brand Registry", path: "/admin/brands", icon: Award },
    { name: "DB Monitor", path: "/admin/database-monitor", icon: Database },
  ];

  return (
    <>
    {/* OVERLAY: Muncul di HP saat sidebar terbuka untuk menutup area luar */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[90] md:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}
    <aside className={`fixed left-0 top-0 h-full w-64 bg-[#131921] text-gray-300 flex flex-col border-r border-gray-800 shrink-0 z-[100] transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
    <div className="p-6 border-b border-gray-800 bg-[#232f3e] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-[#febd69]">Amazon Seller</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Central System</p>
          </div>
          {/* Tombol Tutup untuk HP */}
          <button onClick={toggleSidebar} className="md:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-6 px-4 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-md transition-all duration-200 group ${
                  isActive 
                    ? "bg-[#37475a] text-[#febd69] border-l-4 border-[#febd69]" 
                    : "hover:bg-[#232f3e] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? "text-[#febd69]" : "group-hover:text-[#febd69]"} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 bg-[#131921]">
          <Link to="/" className="flex items-center gap-3 px-4 py-2 text-sm text-[#febd69] hover:bg-[#232f3e] rounded-md transition-all">
            <Home size={18} />
            <span>← Back to Store</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;