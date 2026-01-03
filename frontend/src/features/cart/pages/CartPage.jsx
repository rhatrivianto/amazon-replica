import { useGetCartQuery, useUpdateQuantityMutation, useRemoveFromCartMutation } from '../../../services/cartApi.js';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ShieldCheck, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CartPage = () => {
  const { data: cartData, isLoading } = useGetCartQuery();
  const [updateQty] = useUpdateQuantityMutation();
  const [remove] = useRemoveFromCartMutation();
  const navigate = useNavigate();

  if (isLoading) return <div className="p-20 text-center font-medium">Loading your shopping cart...</div>;

  const cart = cartData?.data;
  const subtotal = cart?.totalPrice || 0;
  const totalQty = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <div className="bg-[#EAEDED] min-h-screen pt-24 pb-10 px-4">
      <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* KOLOM KIRI */}
        <div className="flex-1 bg-white p-6 shadow-sm">
          <div className="border-b pb-4 mb-4">
            <h1 className="text-3xl font-medium">Shopping Cart</h1>
            <div className="text-right text-sm text-gray-600 -mt-5 hidden md:block">Price</div>
          </div>
          
          {cart?.items?.length === 0 ? (
            <div className="py-10 text-center space-y-4">
              <p className="text-xl">Your Amazon Cart is empty.</p>
              <Link to="/" className="text-cyan-700 hover:text-orange-700 hover:underline font-medium">
                Continue Shopping
              </Link>
            </div>
          ) : (
            cart?.items.map((item) => (
              <div key={item.product._id} className="flex flex-col md:flex-row gap-4 border-b py-6 last:border-0">
                <div className="w-44 h-44 flex-shrink-0 flex items-center justify-center">
                  <img src={item.product.images[0]} alt={item.product.name} className="max-w-full max-h-full object-contain" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-lg font-medium leading-snug line-clamp-2 hover:text-cyan-700 cursor-pointer">
                      {item.product.name}
                    </h3>
                    <div className="text-right font-bold text-lg whitespace-nowrap">
                      Rp{item.product.price.toLocaleString('id-ID')}
                    </div>
                  </div>
                  
                  <p className="text-xs text-green-700 font-bold">In Stock</p>
                  <p className="text-[12px] text-gray-500 italic flex items-center gap-1">
                    <ShieldCheck size={14} /> Eligible for FREE Shipping
                  </p>
                  
                  <div className="flex items-center gap-4 mt-4 text-sm">
                    <div className="flex items-center bg-[#F0F2F2] border rounded-lg shadow-sm border-gray-300 px-2 py-0.5">
                       <span className="text-[11px] text-gray-600 mr-1">Qty:</span>
                       <select 
                        value={item.quantity}
                        onChange={(e) => updateQty({ productId: item.product._id, quantity: Number(e.target.value) })}
                        className="bg-transparent outline-none cursor-pointer py-1 font-medium"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="h-4 w-[1px] bg-gray-300"></div>
                    
                    <button 
                      onClick={async () => {
                        await remove(item.product._id);
                        toast.success("Produk berhasil dihapus");
                      }} 
                      className="text-cyan-700 hover:text-red-600 hover:underline flex items-center gap-1.5 text-[13px] transition-colors group"
                    >
                      <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {cart?.items?.length > 0 && (
            <div className="text-right text-lg pt-4 border-t">
              Subtotal ({totalQty} items): <span className="font-bold text-xl ml-2">Rp{subtotal.toLocaleString('id-ID')}</span>
            </div>
          )}
        </div>

        {/* KOLOM KANAN */}
        <div className="w-full lg:w-[300px] space-y-4">
          <div className="bg-white p-5 shadow-sm space-y-4 h-fit">
            <div className="text-lg leading-tight">
              Subtotal ({totalQty} items): <br />
              <span className="font-bold text-xl">Rp{subtotal.toLocaleString('id-ID')}</span>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              disabled={!cart?.items?.length}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] py-2 rounded-full shadow-sm transition-all font-medium text-sm disabled:bg-gray-200 border border-[#F2D011]"
            >
              Proceed to Checkout
            </button>
          </div>
          <div className="bg-white p-4 shadow-sm border rounded-lg flex items-center justify-between group cursor-pointer">
             <span className="text-sm font-medium">Order info</span>
             <Info size={14} className="text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;