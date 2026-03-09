import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useVerifyPaymentMutation } from '../../../services/orderApi';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const [verifyPayment, { isLoading }] = useVerifyPaymentMutation();

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setErrorMessage('No session ID found. Your payment might not be processed correctly.');
      return;
    }

    const handleVerification = async () => {
      try {
        await verifyPayment({ session_id: sessionId }).unwrap();
        setStatus('success');
      } catch (err) {
        setErrorMessage(err.data?.message || 'Payment verification failed. Please contact support.');
        setStatus('error');
      }
    };

    handleVerification();
  }, [sessionId, verifyPayment]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 size={48} className="animate-spin text-[#ffd814] mb-4" />
        <p className="text-gray-600 font-medium">Verifying your payment, please wait...</p>
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
        <p className="text-gray-600 mb-4">
          We couldn&apos;t verify your payment. If you have been charged, please contact customer service.
        </p>
        <p className="text-red-600 font-mono text-sm bg-red-50 p-2 rounded mb-6">{errorMessage}</p>
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
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-6">
        Thank you for your purchase. Your order is being processed. You will receive a confirmation email shortly.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/" className="bg-[#ffd814] hover:bg-[#f7ca00] px-6 py-2 rounded-full font-medium shadow-sm">
          Continue Shopping
        </Link>
        <Link to="/account/orders" className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-full font-medium shadow-sm">
          View Your Orders
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;