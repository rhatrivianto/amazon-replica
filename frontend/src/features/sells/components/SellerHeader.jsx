import { Link } from 'react-router-dom';

const SellerHeader = () => {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-center items-center border-b">
      <Link to="/sell">
        <img src="/amazon-logo-black.png" alt="Amazon Seller Central" className="h-8" />
      </Link>
    </header>
  );
};

export default SellerHeader;
