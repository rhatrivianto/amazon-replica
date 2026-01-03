import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const SellBreadcrumbs = () => {
  const location = useLocation();
  // Kita filter 'sell' agar breadcrumbs dimulai dari anaknya
  const pathnames = location.pathname.split('/').filter((x) => x && x !== 'sell');

  return (
    <nav className="flex items-center space-x-2 text-xs text-gray-600 py-3 px-4 bg-gray-50 border-b">
      <Link to="/sell" className="hover:text-[#e47911] hover:underline flex items-center gap-1">
        <Home size={14} />
        Sell Home
      </Link>

      {pathnames.map((value, index) => {
        // Kita prepend '/sell' untuk membangun path yang benar
        const to = `/sell/${pathnames.slice(0, index + 1).join('/')}`;
        const name = value.replace(/-/g, ' ');
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={to}>
            <ChevronRight size={12} className="text-gray-400" />
            {isLast ? (
              <span className="font-bold text-gray-800 capitalize">{name}</span>
            ) : (
              <Link to={to} className="hover:text-[#e47911] hover:underline capitalize">{name}</Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default SellBreadcrumbs;