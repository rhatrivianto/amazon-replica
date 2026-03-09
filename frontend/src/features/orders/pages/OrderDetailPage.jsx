import { useParams, Link } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../../../services/orderApi';
import { useAddToCartMutation } from '../../../services/cartApi'; // 1. Import addToCart
import { Loader2, ChevronLeft, CreditCard, Truck } from 'lucide-react';
import { toast } from 'react-hot-toast'; // 2. Import toast untuk feedback
import WishlistButton from '../../../shared/ui/WishlistButton';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetOrderByIdQuery(id);
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation(); // 3. Inisialisasi mutation
  
  // Handle variasi struktur data response
  const order = data?.order || data?.data;

  // 4. Buat fungsi handler
  const handleBuyAgain = async (product) => {
    if (!product) return;
    try {
      // Kita asumsikan user ingin membeli 1 item lagi
      await addToCart({ productId: product._id, quantity: 1 }).unwrap();
      toast.success(`"${product.name}" added to your cart!`);
    } catch (err) {
      toast.error(err.data?.message || 'Failed to add product to cart.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-[#e47911]" size={40} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Order not found</h2>
        <p className="text-gray-600 mt-2">We couldn&apos;t find the order you&apos;re looking for.</p>
        <Link to="/orders" className="text-blue-600 hover:underline mt-4 block">
          Back to Your Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 bg-white min-h-screen">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/account" className="hover:underline">Your Account</Link> 
            <ChevronLeft size={14} /> 
            <Link to="/orders" className="hover:underline">Your Orders</Link>
            <ChevronLeft size={14} /> 
            <span className="text-[#c45500]">Order Details</span>
        </div>

        <h1 className="text-2xl font-medium mb-6">Order Details</h1>

        {/* Order Info Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="text-sm text-gray-600">
                <span className="block">Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="block mt-1">Order # {order._id}</span>
            </div>
        </div>

        {/* Order Details Grid (3 Kolom) */}
        <div className="border border-gray-300 rounded-lg overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-gray-300">
                
                {/* Kolom 1: Shipping Address */}
                <div className="p-4">
                    <h3 className="font-bold text-sm mb-2 text-gray-900">Shipping Address</h3>
                    {order.shippingAddress ? (
                        <div className="text-sm text-gray-600 leading-relaxed">
                            <p className="font-medium text-gray-800">{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                            <p>{order.shippingAddress.country}</p>
                            <p>Phone: {order.shippingAddress.phone}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Address details not available.</p>
                    )}
                </div>

                {/* Kolom 2: Payment Method */}
                <div className="p-4">
                    <h3 className="font-bold text-sm mb-2 text-gray-900">Payment Method</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CreditCard size={20} />
                        <span>{order.paymentMethod || 'Credit Card'}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Status: <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-700' : 'text-orange-700'}`}>{order.paymentStatus}</span></p>
                </div>

                {/* Kolom 3: Order Summary */}
                <div className="p-4">
                    <h3 className="font-bold text-sm mb-2 text-gray-900">Order Summary</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Item(s) Subtotal:</span>
                            <span>Rp{order.totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping:</span>
                            <span>Rp0</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-900 pt-2 mt-2 border-t">
                            <span>Grand Total:</span>
                            <span>Rp{order.totalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Order Items List */}
        <div className="border border-gray-300 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-4 text-gray-900">Shipment Details</h3>
            <div className="flex items-center gap-2 mb-4 text-green-700 font-medium text-sm">
                <Truck size={18} />
                <span>{order.deliveryStatus || 'Processing'}</span>
            </div>

            <div className="space-y-6">
                {order.items.map((item) => (
                    <div key={item._id} className="flex flex-col md:flex-row gap-4 border-b last:border-0 pb-4 last:pb-0">
                        <div className="w-24 h-24 shrink-0 bg-gray-50 flex items-center justify-center rounded-md relative">
                            <img 
                                src={item.product?.images?.[0]} 
                                alt={item.product?.name} 
                                className="max-w-full max-h-full object-contain"
                            />
                            <div className="absolute top-0 right-0">
                                {item.product && <WishlistButton productId={item.product._id} size={18} />}
                            </div>
                        </div>
                        <div className="flex-1">
                            <Link to={`/product/${item.product?._id}`} className="text-blue-600 hover:underline hover:text-[#c45500] font-medium text-sm line-clamp-2">
                                {item.product?.name}
                            </Link>
                            <p className="text-xs text-gray-500 mt-1">Sold by: {item.product?.shippingInfo?.soldBy || 'Amazon.com Services LLC'}</p>
                            <p className="text-sm font-bold text-[#b12704] mt-1">Rp{item.product?.price?.toLocaleString()}</p>
                            <div className="mt-2">
                                <button 
                                  onClick={() => handleBuyAgain(item.product)}
                                  disabled={isAddingToCart}
                                  className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-lg px-3 py-1 text-xs shadow-sm font-medium inline-block disabled:opacity-50"
                                >
                                    {isAddingToCart ? 'Adding...' : 'Buy it again'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default OrderDetailPage;