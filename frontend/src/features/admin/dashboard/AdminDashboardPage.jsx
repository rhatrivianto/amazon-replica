import { useState, useMemo } from 'react';
 import { useNavigate } from 'react-router-dom';
import { 
  Package, DollarSign, TrendingUp, AlertTriangle, 
  ArrowRight, BarChart3, Globe, LogOut 
} from 'lucide-react';
import { 
  useGetAdminProductsQuery, 
  useGetDashboardStatsQuery 
} from '../../../services/adminApi.js';
import { useGetLatestRatesQuery } from '../../../services/currencyApi.js';

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  // 1. DATA FETCHING
  const { data: productsData, isLoading: isProdLoading } = useGetAdminProductsQuery();
  const { data: exchangeData, isLoading: isRateLoading } = useGetLatestRatesQuery('USD');
  
  // PERBAIKAN 1: Rename data menjadi 'statsData' dan isLoading menjadi 'isDashLoading'
  // agar tidak bentrok dengan variabel lain.
  const { data: statsData, isLoading: isDashLoading, error: dashError } = useGetDashboardStatsQuery();

  // 2. CURRENCY CONFIGURATION
  const currencies = useMemo(() => [
    { code: 'IDR', symbol: 'Rp', label: 'Indonesia (IDR)' },
    { code: 'USD', symbol: '$', label: 'United States (USD)' },
    { code: 'JPY', symbol: '¥', label: 'Japan (JPY)' },
    { code: 'AUD', symbol: 'A$', label: 'Australia (AUD)' },
    { code: 'SGD', symbol: 'S$', label: 'Singapore (SGD)' },
    { code: 'TRY', symbol: '₺', label: 'Turkey (TRY)' },
  ], []);

  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  // 3. LOGIC & CALCULATIONS
  const productList = useMemo(() => {
    // Support response structure: { products: [...] } or { data: [...] }
    return productsData?.products || productsData?.data || [];
  }, [productsData]);
  
  const rates = useMemo(() => {
    return exchangeData?.rates || exchangeData?.conversion_rates || {};
  }, [exchangeData]);
  
  const currentRate = useMemo(() => {
    const rateFromApi = rates[selectedCurrency.code];
    if (rateFromApi) return rateFromApi;
    
    // Fallback static rates
    const fallbacks = { IDR: 16100, JPY: 150, AUD: 1.5 };
    return fallbacks[selectedCurrency.code] || 1;
  }, [rates, selectedCurrency]);

  const lowStockItems = useMemo(() => {
    return productList.filter(p => p.stock < 10);
  }, [productList]);

  // PERBAIKAN 2: Definisikan dashboardData dengan aman sebelum digunakan di stats UI
  const dashboardData = useMemo(() => {
    // Support response structure: { data: {...} } or direct object {...}
    
    const data = statsData?.data || statsData || {};
    return {
      totalProducts: data.totalProducts || 0,
      totalInventoryValue: data.totalInventoryValue || 0,
      lowStockCount: data.lowStockCount || 0
    };
  }, [statsData]);

  // 4. AMAZON STYLE STATS (Using Backend Data)
  const stats = useMemo(() => {
    // Gunakan dashboardData yang sudah didefinisikan di atas
    const backend = dashboardData;
    const totalUSD = backend.totalInventoryValue || 0;
    const displayVal = totalUSD * currentRate;

    return [
      { 
        label: 'Inventory Value', 
        value: `${selectedCurrency.symbol} ${displayVal.toLocaleString('id-ID', { 
          minimumFractionDigits: selectedCurrency.code === 'IDR' ? 0 : 2,
          maximumFractionDigits: 2 
        })}`,
        icon: DollarSign, 
        color: 'text-green-500',
        desc: `Base: $${totalUSD.toLocaleString()} USD`
      },
      { 
        label: 'Total SKUs', 
        value: backend.totalProducts || 0, 
        icon: Package, 
        color: 'text-blue-500',
        desc: 'Unique products in catalog'
      },
      { 
        label: 'Stock Health', 
        value: `${(backend.totalProducts || 0) - (backend.lowStockCount || 0)} Healthy`, 
        icon: TrendingUp, 
        color: 'text-yellow-500',
        desc: `${backend.lowStockCount || 0} items need restock`
      },
    ];
  }, [dashboardData, currentRate, selectedCurrency]);

  const handleLogout = () => {
    // Hapus token admin dan user
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    // Redirect ke login dan refresh untuk membersihkan state Redux
    navigate('/admin/login');
    window.location.reload();
  };

  // CCTV 2: Jika ada Error (misal 401 Unauthorized), TAMPILKAN DI LAYAR
  if (dashError) {
    return (
      <div className="p-10 text-center text-red-500 bg-red-50 border border-red-200 rounded-lg m-4">
        <h3 className="font-bold text-lg">Gagal Mengambil Data Dashboard</h3>
        <p className="font-mono text-sm mt-2">{JSON.stringify(dashError)}</p>
        <p className="text-xs text-gray-600 mt-4">Coba Logout dan Login ulang sebagai Admin.</p>
      </div>
    );
  }

  // PERBAIKAN 3: Pastikan semua loading state dicek
  if (isProdLoading || isRateLoading || isDashLoading) {
    return <div className="p-10 text-center animate-pulse text-gray-400">Syncing with Amazon Global Markets...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-gray-400" size={20} />
          <h1 className="text-lg font-bold text-gray-700 uppercase tracking-tight">Seller Central Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
            <Globe size={16} className="text-[#007185]" />
            <select 
              className="text-xs font-bold bg-transparent outline-none text-gray-600 cursor-pointer px-2"
              value={selectedCurrency.code}
              onChange={(e) => setSelectedCurrency(currencies.find(c => c.code === e.target.value))}
            >
              {currencies.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-lg shadow-sm transition-colors flex items-center gap-2 text-xs font-bold px-3"
            title="Logout Admin"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-black text-gray-800 mt-1">{stat.value}</h3>
                <p className="text-[10px] text-gray-500 mt-1 italic">{stat.desc}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <stat.icon className={`${stat.color}`} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-red-50 border-b border-red-100 p-4 flex items-center justify-between">
            <h3 className="text-red-700 font-bold flex items-center gap-2 text-sm uppercase tracking-tighter">
              <AlertTriangle size={18} /> {lowStockItems.length} Inventory Alerts
            </h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
            {lowStockItems.map(item => (
              <div key={item._id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded border p-1">
                    <img src={item.images?.[0]} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</p>
                    <p className="text-xs font-medium text-red-500">Stock: {item.stock}</p>
                  </div>
                </div>
                <button className="text-[#007185] hover:text-[#c45500] text-xs font-bold flex items-center gap-1">
                  RESTOCK <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#232f3e] rounded-xl p-8 flex flex-col justify-center relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-[#febd69] mb-3">Global Expansion</h2>
            <p className="text-gray-300 text-sm mb-8 leading-relaxed max-w-sm">
              Your inventory is ready for international markets. Start selling globally today.
            </p>
            <button className="bg-[#ffd814] text-[#131921] font-black py-3 px-8 rounded-lg hover:bg-[#f7ca00] text-xs uppercase tracking-widest shadow-lg">
              Launch Global Selling
            </button>
          </div>
          <Package className="absolute -right-12 -bottom-12 text-white/5 w-64 h-64 rotate-12" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
