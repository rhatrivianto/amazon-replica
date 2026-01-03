import { useState, useMemo } from 'react';
import { 
  Package, DollarSign, TrendingUp, AlertTriangle, 
  ArrowRight, BarChart3, Globe 
} from 'lucide-react';
import { useGetAdminProductsQuery } from '../../../services/adminServiceApi.js';
import { useGetLatestRatesQuery } from '../../../services/currencyApi.js';

const AdminDashboardPage = () => {
  const { data: productsData, isLoading: isProdLoading } = useGetAdminProductsQuery();
  const { data: exchangeData, isLoading: isRateLoading } = useGetLatestRatesQuery('USD');

  const currencies = useMemo(() => [
    { code: 'IDR', symbol: 'Rp', label: 'Indonesia (IDR)' },
    { code: 'USD', symbol: '$', label: 'United States (USD)' },
    { code: 'JPY', symbol: '¥', label: 'Japan (JPY)' },
    { code: 'AUD', symbol: 'A$', label: 'Australia (AUD)' },
    { code: 'SGD', symbol: 'S$', label: 'Singapore (SGD)' },
    { code: 'TRY', symbol: '₺', label: 'Turkey (TRY)' },
  ], []);

  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  // FIX: Membungkus productList dengan useMemo sesuai saran error Anda
  const productList = useMemo(() => productsData?.data || [], [productsData]);

// 1. Ambil data rates dengan pengecekan ganda
  const rates = useMemo(() => {
    // API open.er-api.com biasanya menggunakan 'rates'
    // API exchangerate-api.com menggunakan 'conversion_rates'
    return exchangeData?.rates || exchangeData?.conversion_rates || {};
  }, [exchangeData]);
  
  // 2. Ambil currentRate dengan Fallback IDR yang benar
  const currentRate = useMemo(() => {
    const rateFromApi = rates[selectedCurrency.code];
    
    if (rateFromApi) return rateFromApi;

    // Jika API belum load, berikan nilai manual sementara agar angka tidak diam di angka 1 (USD)
    if (selectedCurrency.code === 'IDR') return 16100;
    if (selectedCurrency.code === 'JPY') return 150;
    if (selectedCurrency.code === 'AUD') return 1.5;
    
    return 1; // Default USD
  }, [rates, selectedCurrency]);

  // Kalkulasi Total USD
  const totalValueUSD = useMemo(() => {
    return productList.reduce((acc, curr) => {
      const price = Number(curr.price) || 0;
      const stock = Number(curr.stock) || 0;
      return acc + (price * stock);
    }, 0);
  }, [productList]);

  const displayValue = totalValueUSD * currentRate;

  // FIX: Menggunakan lowStockItems agar tidak error "unused"
  const lowStockItems = useMemo(() => {
    return productList.filter(p => p.stock < 10);
  }, [productList]);

  const stats = [
  { 
    label: 'Inventory Value', 
    value: `${selectedCurrency.symbol} ${displayValue.toLocaleString('id-ID', { 
      minimumFractionDigits: selectedCurrency.code === 'IDR' ? 0 : 2,
      maximumFractionDigits: 2 
    })}`,
    icon: DollarSign, 
    color: 'text-green-500',
    // INI ADALAH TEKS VERIFIKASI:
    desc: `Live: 1 USD = ${currentRate.toLocaleString('id-ID')} ${selectedCurrency.code}`
  },
    { 
      label: 'Total SKUs', 
      value: productList.length, 
      icon: Package, 
      color: 'text-blue-500',
      desc: 'Unique products listed'
    },
    { 
      label: 'Stock Health', 
      value: `${productList.length - lowStockItems.length} Healthy`, 
      icon: TrendingUp, 
      color: 'text-yellow-500',
      desc: 'Items above reorder point'
    },
  ];

  if (isProdLoading || isRateLoading) return <div className="p-10 text-center animate-pulse text-gray-400">Syncing with Amazon Global Markets...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-gray-400" size={20} />
          <h1 className="text-lg font-bold text-gray-700 uppercase tracking-tight">Seller Central Dashboard</h1>
        </div>

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
        {/* INVENTORY ALERTS */}
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

        {/* PROMO CARD */}
        <div className="bg-[#232f3e] rounded-xl p-8 flex flex-col justify-center relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-[#febd69] mb-3">Global Expansion</h2>
            <p className="text-gray-300 text-sm mb-8 leading-relaxed max-w-sm">
              Current inventory value is <span className="text-white font-bold">{selectedCurrency.symbol}{displayValue.toLocaleString()}</span>. 
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