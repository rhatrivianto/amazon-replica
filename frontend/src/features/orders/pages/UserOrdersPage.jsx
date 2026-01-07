import { useGetMyOrdersQuery } from '../../../services/orderApi.js';
import { Package, Loader2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserOrdersPage = () => {
  const { data, isLoading } = useGetMyOrdersQuery();
  const orders = data?.data || [];

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#e47911]" size={40} /></div>;

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
            <div key={order._id} className="border border-gray-300 rounded-lg overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-100 p-4 flex flex-col md:flex-row justify-between text-sm text-gray-600 gap-4">
                <div className="flex gap-8">
                  <div>
                    <p className="uppercase text-xs font-bold">Order Placed</p>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="uppercase text-xs font-bold">Total</p>
                    <p>Rp {order.totalPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="uppercase text-xs font-bold">Ship To</p>
                    <p className="text-[#007185]">{order.shippingAddress?.fullName}</p>
                  </div>
                </div>
                <div>
                  <p className="uppercase text-xs font-bold">Order # {order._id.slice(-8).toUpperCase()}</p>
                  <Link to={`/order/${order._id}`} className="text-[#007185] hover:underline">View Order Details</Link>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Package className="text-green-600" size={20} /> 
                  Status: <span className="uppercase text-green-700">{order.status || 'Processing'}</span>
                </h3>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="flex gap-4 items-center border-b last:border-0 pb-4 last:pb-0">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-contain border p-1" />
                      <div>
                        <Link to={`/product/${item.product}`} className="font-bold text-[#007185] hover:underline line-clamp-2">
                          {item.name}
                        </Link>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        <button className="bg-[#ffd814] hover:bg-[#f7ca00] text-black text-xs py-1 px-3 rounded-md shadow-sm mt-2">
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
