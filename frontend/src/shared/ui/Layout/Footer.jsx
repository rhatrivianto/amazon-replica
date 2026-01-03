import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-[#232f3e] text-white mt-auto">
      <button 
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] py-4 text-sm font-medium transition-colors"
      >
        Back to top
      </button>

      <div className="max-w-7xl mx-auto py-10 px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-base mb-4">Get to Know Us</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="#" className="hover:underline">About Us</Link></li>
            <li><Link to="#" className="hover:underline">Careers</Link></li>
            <li><Link to="#" className="hover:underline">Press Releases</Link></li>
            <li><Link to="#" className="hover:underline">Amazon Science</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-base mb-4">Make Money with Us</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="#" className="hover:underline">Sell on Amazon</Link></li>
            <li><Link to="#" className="hover:underline">Supply to Amazon</Link></li>
            <li><Link to="#" className="hover:underline">Become an Affiliate</Link></li>
            <li><Link to="#" className="hover:underline">Advertise Your Products</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-base mb-4">Amazon Payment Products</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="#" className="hover:underline">Amazon Business Card</Link></li>
            <li><Link to="#" className="hover:underline">Shop with Points</Link></li>
            <li><Link to="#" className="hover:underline">Reload Your Balance</Link></li>
            <li><Link to="#" className="hover:underline">Amazon Currency Converter</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-base mb-4">Let Us Help You</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="#" className="hover:underline">Your Account</Link></li>
            <li><Link to="#" className="hover:underline">Your Orders</Link></li>
            <li><Link to="#" className="hover:underline">Shipping Rates & Policies</Link></li>
            <li><Link to="#" className="hover:underline">Help Center</Link></li>
          </ul>
        </div>
      </div>

      <div className="bg-[#131921] py-8 border-t border-gray-700 text-center">
        <span className="text-2xl font-bold italic">amazon<span className="text-[#febd69]">.clone</span></span>
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-[11px] text-gray-400">
            <Link to="#" className="hover:underline">Conditions of Use</Link>
            <Link to="#" className="hover:underline">Privacy Notice</Link>
            <Link to="#" className="hover:underline">Your Ads Privacy Choices</Link>
        </div>
        <p className="text-[11px] text-gray-500 mt-2">© 2025, Amazon Clone MERN Enterprise.</p>
      </div>
    </footer>
  );
};

export default Footer;