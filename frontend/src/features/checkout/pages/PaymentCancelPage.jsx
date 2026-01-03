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
        Don&apos;t worry, your cart is safe. You can try to checkout again when you&apos;re ready.
      </p>
      <Link to="/cart" className="bg-[#ffd814] hover:bg-[#f7ca00] px-6 py-2 rounded-full font-medium shadow-sm">
        Return to Cart
      </Link>
    </div>
  );
};

export default PaymentCancelPage;