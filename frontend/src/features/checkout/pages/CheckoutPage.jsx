
import { useGetCartQuery } from '../../../services/cartApi.js';
import { useCreateCheckoutSessionMutation } from '../../../services/orderApi.js';
import { Lock, Loader2, MapPin, ChevronRight, ShieldCheck } from 'lucide-react'; // Icon ditambahkan
import { toast } from 'react-hot-toast';

const CheckoutPage = () => {
  const { data: cartData, isLoading } = useGetCartQuery();
  const [createCheckout, { isLoading: isProcessing }] = useCreateCheckoutSessionMutation();

  const cart = cartData?.data;
  const subtotal = cart?.totalPrice || 0;

  const handlePayment = async () => {
    try {
      const result = await createCheckout(cart.items).unwrap();
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      toast.error(err.data?.message || "Gagal memproses pembayaran");
    }
  };

  if (isLoading) return <div className="p-20 text-center">Loading Checkout...</div>;

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* Header Sederhana Ala Amazon Checkout */}
      <div className="bg-[#fcfcfc] border-b py-4 px-8 flex justify-between items-center">
        <img src="/amazon-logo-black.png" alt="Amazon" className="h-8" />
        <div className="flex items-center gap-2">
           <h1 className="text-2xl font-normal">Checkout</h1>
           <span className="text-2xl text-gray-400 font-light ml-1">
             (<span className="text-cyan-700">{cart?.items?.length} items</span>)
           </span>
        </div>
        <Lock className="text-gray-400" />
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Address dengan MapPin */}
          <div className="flex gap-4 border-b pb-6">
            <span className="font-bold text-lg">1</span>
            <div className="flex-1 flex justify-between">
              <div>
                <h3 className="font-bold flex items-center gap-2">
                  Shipping address <MapPin size={16} className="text-orange-700" />
                </h3>
                <div className="text-sm mt-1 text-gray-700">
                  <p className="font-medium">User Full Name</p>
                  <p>Jl. Tebet Raya No. 123</p>
                  <p>Jakarta Selatan, DKI Jakarta, 12810</p>
                </div>
              </div>
              <button className="text-blue-600 text-sm hover:underline flex items-center h-fit">
                Change <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Section 2: Payment */}
          <div className="flex gap-4 border-b pb-6">
            <span className="font-bold text-lg">2</span>
            <div className="flex-1">
              <h3 className="font-bold">Payment method</h3>
              <div className="mt-2 flex items-center gap-2 bg-blue-50 p-3 rounded border border-blue-100">
                 <ShieldCheck size={18} className="text-blue-700" />
                 <p className="text-sm text-blue-800">Secured by Stripe Payment Gateway</p>
              </div>
            </div>
          </div>

          {/* Section 3: Review Items */}
          <div className="flex gap-4 pt-4">
            <span className="font-bold text-lg">3</span>
            <div className="flex-1">
              <h3 className="font-bold mb-4">Review items and shipping</h3>
              <div className="border rounded-lg p-4 space-y-4">
                {cart?.items.map((item) => (
                  <div key={item.product._id} className="flex gap-4">
                    <img src={item.product.images[0]} alt="" className="h-20 w-20 object-contain" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-red-700 font-bold mt-1">Rp{item.product.price.toLocaleString()}</p>
                      <p className="text-gray-500 text-xs">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-4 sticky top-24 space-y-4 shadow-sm bg-[#fdfdfd]">
            <button 
              onClick={handlePayment}
              disabled={isProcessing || !cart?.items?.length}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] py-2.5 rounded-lg text-sm font-medium shadow-sm border border-[#a88734] disabled:bg-gray-200 transition-colors"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} /> Processing...
                </div>
              ) : "Place your order"}
            </button>
            
            <p className="text-[11px] text-gray-500 text-center leading-tight">
              By placing your order, you agree to Amazon&apos;s privacy notice and conditions of use.
            </p>

            <div className="border-t pt-3">
              <h3 className="font-bold text-sm mb-3">Order Summary</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>Rp{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & handling:</span>
                  <span>Rp0</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-red-700 text-lg">
                  <span>Order Total:</span>
                  <span>Rp{subtotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;