import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../cart/cartSlice';
import { cartApi } from '../../../services/cartApi';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const dispatch = useDispatch();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState(''); // State untuk pesan error detail

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const verifyPayment = async () => {
      try {
        // Ambil token auth dari localStorage (sesuaikan dengan key yang Anda pakai saat login)
        const token = localStorage.getItem('token') || localStorage.getItem('userToken');

        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/orders/verify-payment`;

        // Panggil API verifikasi manual ke Backend
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ session_id: sessionId })
        });

        // FIX: Handle parsing error jika response bukan JSON (misal 404 atau 500)
        let data;
        try {
          const text = await res.text();
          data = text ? JSON.parse(text) : {};
        } catch (err) {
          console.error("Failed to parse server response:", err);
          setStatus('error');
          return;
        }

        if (res.ok && data.status === 'success') {
          setStatus('success');
          // Kosongkan keranjang di Redux & LocalStorage
          dispatch(clearCart());
          // FIX: Paksa RTK Query untuk refresh data keranjang dari server (agar Navbar jadi 0)
          dispatch(cartApi.util.invalidateTags(['Cart']));
        } else {
          console.error("Verification failed:", data);
          // Simpan pesan error dari backend (misal: "Session ID required" atau "Payment not successful")
          setErrorMessage(data?.message || `Server Error: ${res.status} ${res.statusText}`);
          setStatus('error');
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setErrorMessage(error.message);
        setStatus('error');
      }
    };

    verifyPayment();
  }, [sessionId, dispatch]); // Dependency hanya sessionId dan dispatch

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 size={48} className="animate-spin text-[#ffd814] mb-4" />
        <p className="text-gray-600 font-medium">Verifying your payment with Amazon Secure Server...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-white border rounded-lg shadow-sm text-center">
        <div className="flex justify-center mb-4 text-red-500">
          <XCircle size={80} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Verification Failed</h1>
        {/* Tampilkan Pesan Error Asli agar mudah debugging */}
        <p className="text-red-600 font-mono text-sm bg-red-50 p-2 rounded mb-4">{errorMessage}</p>
        
        <p className="text-gray-600 mb-6">
          We couldn&apos;t verify your payment automatically. If you have been charged, please contact customer service.
        </p>
        <Link to="/cart" className="bg-[#ffd814] hover:bg-[#f7ca00] px-6 py-2 rounded-full font-medium shadow-sm">
          Return to Cart
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-20 p-8 bg-white border rounded-lg shadow-sm text-center">
      <div className="flex justify-center mb-4">
        <CheckCircle size={80} className="text-green-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
      <p className="text-gray-600 mb-6">
        Thank you for your purchase. Your order is being processed and will be shipped soon.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/" className="bg-[#ffd814] hover:bg-[#f7ca00] px-6 py-2 rounded-full font-medium shadow-sm">
          Continue Shopping
        </Link>
        <Link to="/orders" className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-full font-medium shadow-sm">
          View Your Orders
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;