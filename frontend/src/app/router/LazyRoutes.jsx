import { lazy } from 'react';

// --- ADMIN PAGES ---
export const AdminLoginPage = lazy(() => import('../../features/admin/auth/pages/AdminLoginPage'));
export const AdminProductCreatePage = lazy(() => import('../../features/admin/products/pages/AdminProductCreatePage'));
export const AdminProductEditPage = lazy(() => import('../../features/admin/products/pages/AdminProductEditPage'));
export const AdminProductPage = lazy(() => import('../../features/admin/products/pages/AdminProductPage'));
export const AdminCategoryPage = lazy(() => import('../../features/admin/products/pages/AdminCategoryPage'));
export const AdminBrandPage = lazy(() => import('../../features/admin/products/pages/AdminBrandPage'));
export const DatabaseMonitor = lazy(() => import('../../features/admin/products/pages/DatabaseMonitorPage'));
export const AdminDashboardPage = lazy(() => import('../../features/admin/dashboard/AdminDashboardPage')); // Sesuaikan path folder dashboard Anda
export const ManageSellerContentPage = lazy(() => import('../../features/admin/dashboard/pages/ManageSellerContentPage'));

// --- PUBLIC PAGES ---
export const ProductBrowsePage = lazy(() => import('../../features/products/pages/ProductBrowsePage'));
export const CategoryBrowsePage = lazy(() => import('../../features/products/pages/CategoryBrowsePage'));
export const ProductDetailPage = lazy(() => import('../../features/products/pages/ProductDetailPage'));
export const CartPage = lazy(() => import('../../features/cart/pages/CartPage'));
export const CheckoutPage = lazy(() => import('../../features/checkout/pages/CheckoutPage'));
export const PaymentSuccessPage = lazy(() => import('../../features/checkout/pages/PaymentSuccessPage'));
export const PaymentCancelPage = lazy(() => import('../../features/checkout/pages/PaymentCancelPage'));
export const OrderPage = lazy(() => import('../../features/orders/pages/OrderPage'));
export const EmailVerificationPage = lazy(() => import('../../features/auth/pages/EmailVerificationPage'));
export const UserOrdersPage = lazy(() => import('../../features/orders/pages/UserOrdersPage'));
export const UserAddressPage = lazy(() => import('../../features/address/pages/UserAddressPage'));

// --- SELL PAGES ---
export const SellLayout = lazy(() => import('../../features/sells/components/SellLayout'));
export const SellPage = lazy(() => import('../../features/sells/pages/SellPage'));
export const SellerGuidePage = lazy(() => import('../../features/sells/pages/SellerGuidePage'));
export const SellerPricingPage = lazy(() => import('../../features/sells/pages/SellerPricingPage'));
export const SellerRegisterPage = lazy(() => import('../../features/sells/pages/SellerRegisterPage'));
export const SellerLayout = lazy(() => import('../../features/sells/components/SellerLayout'));
export const SellerDashboardPage = lazy(() => import('../../features/sells/pages/SellerDashboardPage'));
export const SellerInventoryPage = lazy(() => import('../../features/sells/pages/SellerInventoryPage'));

// --- STATIC PAGES ---
export const NotFoundPage = lazy(() => import('../../pages/NotFoundPage'));
export const PrivacyPage = lazy(() => import('../../pages/PrivacyPage'));
export const TermsPage = lazy(() => import('../../pages/TermsPage'));