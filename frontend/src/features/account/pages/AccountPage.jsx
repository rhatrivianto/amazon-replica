import { Link } from 'react-router-dom';
import { Package, MapPin, Heart, User, Shield, LogIn } from 'lucide-react';

const AccountPage = () => {
  const accountLinks = [
    {
      icon: <Package size={32} className="text-yellow-500" />,
      title: 'Your Orders',
      description: 'Track, return, or buy things again',
      link: '/account/orders',
    },
    {
      icon: <LogIn size={32} className="text-yellow-500" />,
      title: 'Login & Security',
      description: 'Edit login, name, and mobile number',
      link: '/account/security',
    },
    {
      icon: <MapPin size={32} className="text-yellow-500" />,
      title: 'Your Addresses',
      description: 'Edit addresses for orders and gifts',
      link: '/account/addresses',
    },
    {
      icon: <Heart size={32} className="text-yellow-500" />,
      title: 'Your Wish List',
      description: 'View, edit, and share your wish lists',
      link: '/account/wishlist',
    },
    {
      icon: <User size={32} className="text-yellow-500" />,
      title: 'Your Profile',
      description: 'Manage your public profile and contributions',
      link: '/account/profile',
    },
    {
      icon: <Shield size={32} className="text-yellow-500" />,
      title: 'Privacy Notice',
      description: 'Read our privacy and cookie notice',
      link: '/privacy',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-normal mb-8">Your Account</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {accountLinks.map((item, index) => (
          <Link 
            key={index} 
            to={item.link}
            className="border border-gray-300 rounded-lg p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors"
          >
            <div className="shrink-0 mt-1">{item.icon}</div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">{item.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AccountPage;
