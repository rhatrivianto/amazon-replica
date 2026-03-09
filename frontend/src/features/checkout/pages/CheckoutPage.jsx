/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCartQuery } from '../../../services/cartApi';
import { useGetMyAddressesQuery } from '../../../services/addressApi';
import { useCreateCheckoutSessionMutation } from '../../../services/orderApi';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();
  const { data: addressesData, isLoading: isAddressesLoading } = useGetMyAddressesQuery();
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  
  const [createCheckoutSession, { isLoading: isPlacingOrder }] = useCreateCheckoutSessionMutation();

  const cart = cartData?.data;
  const addresses = addressesData?.data || [];

  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
      }
    }
  }, [addresses, selectedAddressId]);

  const selectedAddress = useMemo(() => {
    return addresses.find(addr => addr._id === selectedAddressId);
  }, [selectedAddressId, addresses]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address.');
      return;
    }
    
    try {
      const { session } = await createCheckoutSession({
        items: cart.items,
        shippingAddress: selectedAddress,
      }).unwrap();

      if (session.url) {
        window.location.href = session.url;
      }
    } catch (err) {
      toast.error(err.data?.message || 'Could not place order. Please try again.');
    }
  };

  const isLoading = isCartLoading || isAddressesLoading;

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><Loader2 className="animate-spin text-[#e47911]" size={40} /></div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center p-10 bg-white max-w-md mx-auto mt-10 rounded-lg shadow">
        <h2 className="text-2xl font-medium">Your cart is empty.</h2>
        <p className="text-gray-600 mt-2">Add items to your cart to proceed to checkout.</p>
        <button onClick={() => navigate('/')} className="mt-6 bg-[#ffd814] hover:bg-[#f7ca00] px-6 py-2 rounded-lg font-medium shadow-sm">Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-normal mb-6">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">1. Shipping Address</h2>
                <button onClick={() => navigate('/account/addresses')} className="text-sm text-blue-600 hover:underline">Manage addresses</button>
              </div>
              <div className="p-4 space-y-4">
                {addresses.map(addr => (
                  <div key={addr._id} className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedAddressId === addr._id ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:bg-gray-50'}`} onClick={() => setSelectedAddressId(addr._id)}>
                    <p className="font-bold">{addr.fullName}</p>
                    <p>{addr.street}</p>
                    <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                    <p>{addr.country}</p>
                    <p>Phone: {addr.phone}</p>
                  </div>
                ))}
                {addresses.length === 0 && <p>No addresses found. Please <button onClick={() => navigate('/account/addresses')} className="text-blue-600 hover:underline">add an address</button>.</p>}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b"><h2 className="text-xl font-bold">2. Payment Method</h2></div>
              <div className="p-4">
                <p className="font-bold">Credit or debit card</p>
                <p className="text-sm text-gray-500">You will be redirected to Stripe to complete your payment securely.</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg sticky top-28">
              <div className="p-4">
                <button onClick={handlePlaceOrder} disabled={isPlacingOrder || !selectedAddressId} className="w-full bg-[#ffd814] hover:bg-[#f7ca00] py-2 rounded-lg shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                  {isPlacingOrder ? 'Processing...' : 'Place your order'}
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">By placing your order, you agree to Amazon&apos;s privacy notice and conditions of use.</p>
              </div>
              <div className="p-4 border-t">
                <h3 className="font-bold mb-2">Order Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span>Items:</span> <span>Rp{(cart.totalPrice).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Shipping & handling:</span> <span>Rp0</span></div>
                  <div className="flex justify-between font-bold text-lg text-[#b12704] border-t pt-2 mt-2"><span>Order total:</span><span>Rp{(cart.totalPrice).toLocaleString()}</span></div>
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