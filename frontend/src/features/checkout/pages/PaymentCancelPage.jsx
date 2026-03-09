import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentCancelPage = () => {
  return (
    <div className="max-w-2xl mx-auto mt-20 p-8 bg-white border rounded-lg shadow-sm text-center">
      <div className="flex justify-center mb-4 text-red-500">
        <XCircle size={80} />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
      <p className="text-gray-600 mb-6">
        Your checkout process was cancelled. Your items are still in your cart.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/cart" className="bg-[#ffd814] hover:bg-[#f7ca00] px-6 py-2 rounded-full font-medium shadow-sm">
          Return to Cart
        </Link>
        <Link to="/" className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-full font-medium shadow-sm">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancelPage;