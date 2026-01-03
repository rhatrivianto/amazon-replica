
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccessPage = () => {
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