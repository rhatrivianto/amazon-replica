import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { Suspense, useState } from "react";
import { useSelector } from 'react-redux';

// Shared UI & Layout
import AdminLayout from '../../shared/ui/Layout/AdminLayout';
import Navbar from "../../shared/ui/Layout/Navbar";
import Footer from "../../shared/ui/Layout/Footer";
import { LoadingState } from "../../shared/ui/LoadingState/LoadingState";
import AuthModal from "../../features/auth/components/AuthModal"; // Import di sini
import { selectUserInfo } from '../../features/auth/authSlice'; // Import selector user info

// Import Modular Routes
import productRoutes from '../../features/admin/products/productRoutes.jsx';
import dashboardRoutes from '../../features/admin/dashboard/dashboardRoutes.jsx';

// Import Lazy Pages
import { 
  ProductBrowsePage, 
  CategoryBrowsePage, 
  AdminLoginPage, 
  EmailVerificationPage,
  ProductDetailPage, 
  CartPage, 
  CheckoutPage, 
  PaymentSuccessPage,
  PaymentCancelPage, 
  OrderPage,
  UserOrdersPage,
  UserAddressPage,
  SellLayout,
  SellPage,
  SellerGuidePage,
  SellerPricingPage,
  SellerRegisterPage,
  SellerLayout,
  NotFoundPage,
  PrivacyPage,
  TermsPage,
  AdminDashboardPage,
  ManageSellerContentPage,
  SellerDashboardPage,
  SellerInventoryPage
} from './LazyRoutes';

// --- LAYOUTS ---
const RootLayout = () => {
  // Global modal state (Opsional jika tidak pakai Redux untuk Modal)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('signin');
  const [authIsSeller, setAuthIsSeller] = useState(false);

  const openAuthModal = (tab = 'signin', isSeller = false) => {
    setAuthInitialTab(tab);
    setAuthIsSeller(isSeller);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Oper fungsi open modal ke Navbar jika diperlukan */}
      <Navbar onOpenAuth={() => openAuthModal('signin', false)} />
      
      <main className="flex-grow pt-24 pb-16 bg-white">
        <Outlet context={{ openAuthModal }} /> {/* TEMPAT HALAMAN MUNCUL */}
      </main>

      <Footer />

      {/* AuthModal diletakkan di sini agar tersedia di semua halaman Customer */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialTab={authInitialTab}
        initialIsSeller={authIsSeller}
      />
    </div>
  );
};

// --- SECURITY GATE ---
const ProtectedAdmin = ({ children }) => {
  const { isAuthenticated, admin } = useSelector((state) => state.adminAuth);
  if (!isAuthenticated || admin?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// --- SECURITY GATE FOR SELLER ---
const ProtectedSeller = ({ children }) => {
  const userInfo = useSelector(selectUserInfo);
  if (!userInfo || (userInfo.role !== 'seller' && userInfo.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// --- ROUTER CONFIGURATION ---
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <ProductBrowsePage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'category/:id', element: <CategoryBrowsePage /> },
      { path: 'product/:id', element: <ProductDetailPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'order/success', element: <PaymentSuccessPage /> },
      { path: 'order/cancel', element: <PaymentCancelPage /> },
      { path: 'orders', element: <OrderPage /> },
      { path: 'account/orders', element: <UserOrdersPage /> },
      { path: 'account/addresses', element: <UserAddressPage /> },
      { path: 'verify-email', element: <EmailVerificationPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { 
        path: 'sell', 
        element: <SellLayout />,
        children: [
          { index: true, element: <SellPage /> },
          { path: 'guide', element: <SellerGuidePage /> },
          { path: 'pricing', element: <SellerPricingPage /> },
        ]
      },
    ]
  },
  {
    path: '/sell-account',
    element: <SellerLayout />,
    children: [
      // Contoh: Halaman pendaftaran seller
      { path: 'register', element: <SellerRegisterPage /> },
    ]
  },
  {
    path: '/seller',
    element: (
      <ProtectedSeller>
        <SellerLayout />
      </ProtectedSeller>
    ),
    children: [
      { path: 'dashboard', element: <SellerDashboardPage /> },
      { path: 'inventory', element: <SellerInventoryPage /> },
    ]
  },
  { path: '/admin/login', element: <AdminLoginPage /> },
  {
    path: '/admin',
    element: (
      <ProtectedAdmin>
        <AdminLayout />
      </ProtectedAdmin>
    ),
    children: [
      { index: true, element: <Navigate to="products" replace /> },
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'seller-content', element: <ManageSellerContentPage /> },
      ...dashboardRoutes,
      ...productRoutes, 
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]);

const AppRouter = () => (
  <Suspense fallback={<LoadingState message="Connecting to Amazon AWS..." />}>
    <RouterProvider router={router} />
  </Suspense>
);

export default AppRouter;