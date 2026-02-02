import React from 'react';
import { useGetMyOrdersQuery } from '../../../services/orderApi.js';
import { Package, Loader2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserOrdersPage = () => {
  const { data: response, isLoading, error } = useGetMyOrdersQuery();

  // Debugging: Lihat struktur data di F12 Console
  console.log("Raw API Response:", response);

  // Amazon Style: Menangani berbagai kemungkinan struktur data API
const orders = response?.data || [];

  if (isLoading) {
    return (
      <div className="p-10 flex justify-center">
        <Loader2 className="animate-spin text-[#e47911]" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <p className="text-red-600">Failed to load orders. Please make sure you are logged in.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      {orders.length === 0 ? (
        <div className="border rounded-lg p-10 text-center bg-gray-50">
          <ShoppingBag className="mx-auto text-gray-400 mb-4" size={48} />
          <h2 className="text-lg font-medium text-gray-700">You have no orders yet.</h2>
          <Link to="/" className="text-[#007185] hover:underline mt-2 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              {/* Order Header */}
              <div className="bg-gray-100 p-4 flex flex-col md:flex-row justify-between text-sm text-gray-600 gap-4">
                <div className="flex gap-8">
                  <div>
                    <p className="uppercase text-xs font-bold text-gray-500">Order Placed</p>
                    <p>{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="uppercase text-xs font-bold text-gray-500">Total</p>
                    <p className="font-medium">Rp {order.totalPrice?.toLocaleString('id-ID') || 0}</p>
                  </div>
                  <div>
                    <p className="uppercase text-xs font-bold text-gray-500">Ship To</p>
                    <p className="text-[#007185] cursor-pointer hover:text-orange-700">
                      {order.shippingAddress?.fullName || 'User'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="uppercase text-xs font-bold text-gray-500">Order # {order._id.slice(-8).toUpperCase()}</p>
                  <Link to={`/order/${order._id}`} className="text-[#007185] hover:underline">View Order Details</Link>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Package className="text-green-600" size={20} /> 
                  Status: <span className="text-green-700 capitalize">{order.status || 'Processing'}</span>
                </h3>
                <div className="space-y-4">
                  {(order.items || order.orderItems || []).map((item) => (
                    <div key={item._id} className="flex gap-4 items-center border-b last:border-0 pb-4 last:pb-0">
                      <img 
                        src={item.image || 'https://via.placeholder.com/100'} 
                        alt={item.name} 
                        className="w-20 h-20 object-contain border p-1 rounded"
                      />
                      <div className="flex-1">
                        <Link to={`/product/${item.product}`} className="font-bold text-[#007185] hover:underline line-clamp-2">
                          {item.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>
                        <p className="text-sm font-bold text-gray-800">Rp {item.price?.toLocaleString('id-ID')}</p>
                        <button className="bg-[#ffd814] hover:bg-[#f7ca00] text-black text-xs py-1.5 px-4 rounded-full shadow-sm mt-2 border border-yellow-400">
                          Buy it again
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;