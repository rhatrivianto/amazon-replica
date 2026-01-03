import { Outlet } from 'react-router-dom';
import SellBreadcrumbs from './SellBreadcrumbs';

const SellLayout = () => {
  return (
    <div>
      <SellBreadcrumbs />
      <Outlet />
    </div>
  );
};

export default SellLayout;