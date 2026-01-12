import { Outlet, useOutletContext } from 'react-router-dom';

const SellLayout = () => {
  // 1. Receive context from RootLayout (AppRouter)
  const context = useOutletContext();

  return (
    <div className="min-h-screen bg-white">
      {/* 2. Forward context to children (SellPage, etc.) */}
      <Outlet context={context} />
    </div>
  );
};

export default SellLayout;