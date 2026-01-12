
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../auth/authSlice';
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';

const SellerDashboardPage = () => {
  const userInfo = useSelector(selectUserInfo);

  const stats = [
    { label: 'Today\'s Sales', value: '$0.00', icon: DollarSign, color: 'text-green-600' },
    { label: 'Open Orders', value: '0', icon: ShoppingCart, color: 'text-blue-600' },
    { label: 'Total Products', value: '0', icon: Package, color: 'text-orange-600' },
    { label: 'Account Health', value: 'Good', icon: TrendingUp, color: 'text-purple-600' },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Store: <span className="font-bold text-[#e47911] text-lg ml-1">{userInfo?.storeName || 'My Store'}</span>
          </p>
        </div>
        <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded border shadow-sm">
          Marketplace: <span className="font-bold text-gray-700">Amazon.com</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="font-bold text-gray-800 mb-4 border-b pb-2">Sales Summary</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-300">
              <p className="text-gray-400">No sales data available yet</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="font-bold text-gray-800 mb-4 border-b pb-2">News</h2>
            <div className="space-y-4">
              <div className="text-sm">
                <p className="font-bold text-blue-600 hover:underline cursor-pointer">New fee categories for 2026</p>
                <p className="text-gray-500 text-xs mt-1">Jan 10, 2026</p>
              </div>
              <div className="text-sm">
                <p className="font-bold text-blue-600 hover:underline cursor-pointer">Update to shipping policies</p>
                <p className="text-gray-500 text-xs mt-1">Jan 05, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;
