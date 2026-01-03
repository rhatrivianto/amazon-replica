import AdminProductPage from './pages/AdminProductPage';
import AdminProductCreatePage from './pages/AdminProductCreatePage';
import AdminProductEditPage from './pages/AdminProductEditPage';
import AdminCategoryPage from './pages/AdminCategoryPage';
import AdminBrandPage from './pages/AdminBrandPage'; // Tambahkan Brand
import DatabaseMonitorPage from './pages/DatabaseMonitorPage'; // Tambahkan Monitor

/**
 * AMAZON STYLE: Modular Routing
 * Kriteria: Semua rute di bawah ini adalah bagian dari domain "Product & Inventory Management"
 */
const productRoutes = [
  {
    path: 'products', // Daftar produk (Inventory)
    element: <AdminProductPage />,
  },
  {
    path: 'products/create', // Form Tambah Produk
    element: <AdminProductCreatePage />,
  },
  {
    path: 'products/edit/:id', // Form Edit Produk
    element: <AdminProductEditPage />,
  },
  {
    path: 'categories', // Manajemen Kategori
    element: <AdminCategoryPage />,
  },
  {
    path: 'brands', // Manajemen Merk (Baru)
    element: <AdminBrandPage />,
  },
  {
    path: 'database-monitor', // Monitoring Database (Baru)
    element: <DatabaseMonitorPage />,
  }
];

export default productRoutes;