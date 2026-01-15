import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useGetCategoryByIdQuery } from '../../../services/categoryApi.js';

const Breadcrumbs = ({ activeCategoryId }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  
  const { data, isLoading } = useGetCategoryByIdQuery(activeCategoryId, {
    skip: !activeCategoryId,
  });

  const category = data?.category || data?.data;
  const breadcrumbs = [];

  if (category) {
    if (category.parent) {
      breadcrumbs.push({ id: category.parent._id, name: category.parent.name });
    }
    breadcrumbs.push({ id: category._id, name: category.name });
  }

  if (isLoading) return <div className="h-4 w-48 bg-gray-200 animate-pulse rounded mb-4"></div>;

  return (
    <nav className="flex items-center flex-wrap text-[12px] text-[#565959] mb-2">
      <Link 
        to="/" 
        className="hover:text-[#e47911] hover:underline flex items-center gap-1"
      >
        <Home size={12} />
        All Departments
      </Link>

      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.id}>
          <ChevronRight size={14} className="mx-1 text-gray-400" />
          <Link
            to={`/?category=${item.id}${query ? `&q=${query}` : ''}`}
            className={`hover:text-[#e47911] hover:underline ${
              index === breadcrumbs.length - 1 ? 'font-bold text-gray-800' : ''
            }`}
          >
            {item.name}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;