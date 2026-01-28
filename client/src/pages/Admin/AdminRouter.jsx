import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import AdminDashboard from './AdminDashboard';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';

const AdminRouter = () => {
  const { isAdmin } = useAppContext();

  // 🔐 Protect admin routes
  if (!isAdmin) return <Navigate to="/admin-login" replace />;

  return (
    <Routes>
      {/* Dashboard */}
      <Route index element={<AdminDashboard />} />

      {/* Orders Page */}
      <Route path="orders" element={<AdminOrders />} />

      {/* Products Page */}
      <Route path="products" element={<AdminProducts />} />

      {/* Fallback → Dashboard */}
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};

export default AdminRouter;
