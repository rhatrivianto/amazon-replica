// dashboardRoutes.jsx
import { AdminDashboardPage } from '../../../app/router/LazyRoutes';

/**
 * AMAZON STYLE: Dashboard Domain Routing
 * Fokus: Analitik, Business Metrics, & Overview
 */
const dashboardRoutes = [
  {
    path: 'dashboard',
    element: <AdminDashboardPage />,
  },
  // Kedepannya bisa ditambah:
  // { path: 'analytics', element: <AnalyticsPage /> },
  // { path: 'sales-report', element: <SalesReportPage /> },
];

export default dashboardRoutes;