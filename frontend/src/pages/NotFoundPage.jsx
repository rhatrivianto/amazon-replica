import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <img 
        src="https://m.media-amazon.com/images/G/01/error/title._TTD_.png" 
        alt="Dogs of Amazon" 
        className="mb-6"
      />
      <h1 className="text-2xl font-bold text-[#e47911]">SORRY</h1>
      <p className="text-gray-600 mb-6">we couldn&apos;t find that page. Try searching or go to Amazon&apos;s home page.</p>
      <Link 
        to="/" 
        className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-md shadow-sm font-medium transition-colors"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;