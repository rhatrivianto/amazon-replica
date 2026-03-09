
import { useGetMyOrdersQuery } from '../../../services/orderApi.js';
import { Package, Clock, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderPage = () => {
  // Ambil fungsi 'refetch' untuk memaksa ambil data baru
  const { data, isLoading, isFetching, error, refetch } = useGetMyOrdersQuery();
  const orders = data?.orders || data?.data || [];

  if (isLoading) return <div className="p-10 text-center">Loading your orders...</div>;
  // MODIFIKASI: Hanya tampilkan halaman error penuh jika data benar-benar kosong (load pertama gagal)
  if (error && orders.length === 0) return <div className="p-10 text-center text-red-500">Failed to load orders.</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <span>Your Account</span> <ChevronRight size={14} /> <span className="text-orange-700">Your Orders</span>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-medium">Your Orders</h1>
        
        {/* Wrapper div untuk menampung tombol dan pesan error kecil */}
        <div className="flex flex-col items-end">
          <button 
            onClick={refetch} 
            disabled={isFetching}
            className="flex items-center gap-2 text-sm text-blue-600 hover:underline hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} /> 
            {isFetching ? "Refreshing..." : "Refresh List"}
          </button>
          {/* Tampilkan pesan error kecil jika refresh gagal (misal token expired) tapi data lama masih ada */}
          {error && (
            <span className="text-xs text-red-500 mt-1">{error?.data?.message || "Session expired. Please login."}</span>
          )}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 border rounded-lg text-center shadow-sm">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">You haven&apos;t placed any orders in the last 3 months.</p>
          <button className="mt-4 text-blue-600 hover:underline">View all orders</button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Header Order (Desktop Style) */}
              <div className="bg-[#f0f2f2] p-4 border-b border-gray-300 grid grid-cols-2 md:grid-cols-4 gap-4 text-[12px] text-[#565959]">
                <div>
                  <p className="uppercase">Order Placed</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={14} />
                    <span className="font-medium text-gray-800">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
                <div>
                  <p className="uppercase">Total</p>
                  <p className="font-medium text-gray-800 mt-1">Rp{order.totalPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="uppercase">Ship To</p>
                  <p className="text-blue-600 hover:text-orange-700 cursor-pointer mt-1">User Account</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="uppercase">Order # {order._id.substring(0, 12)}</p>
                  <Link to={`/orders/${order._id}`} className="text-blue-600 hover:text-orange-700 mt-1 hover:underline">
                    View order details
                  </Link>
                </div>
              </div>

              {/* Body Order */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 size={20} className="text-green-700" />
                  <span className="text-lg font-bold text-gray-900">Payment {order.paymentStatus}</span>
                </div>

                {/* Tambahkan pengaman (|| []) agar tidak error jika items undefined */}
                {(order.items || []).map((item) => (
                  <div key={item._id} className="flex flex-col md:flex-row gap-6 py-4 border-b last:border-0">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img 
                        src={item.product?.images?.[0]} 
                        alt="" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-blue-600 font-medium hover:text-orange-700 cursor-pointer leading-snug">
                        {item.product?.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 italic">Sold by: Amazon.com Services LLC</p>
                      <div className="flex items-center gap-2 mt-2">
                         <div className="bg-[#e7f4f5] p-1 rounded">
                            <Package size={14} className="text-cyan-800" />
                         </div>
                         <span className="text-sm font-bold">Qty: {item.quantity}</span>
                      </div>
                      
                      <div className="flex gap-3 mt-4">
                        <button className="bg-[#ffd814] hover:bg-[#f7ca00] px-4 py-1.5 rounded-md shadow-sm text-sm font-medium border border-[#F2D011]">
                          Buy it again
                        </button>
                        <button className="bg-white hover:bg-gray-50 px-4 py-1.5 rounded-md shadow-sm text-sm border border-gray-300">
                          View your item
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderPage;