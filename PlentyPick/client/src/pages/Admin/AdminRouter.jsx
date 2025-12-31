import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import AdminDashboard from './AdminDashboard';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';

const AdminRouter = () => {
  const { isAdmin } = useAppContext();

  if (!isAdmin) return <Navigate to="/admin-login" />;

  return (
    <Routes>
      {/* Admin Dashboard */}
      <Route path="/" element={<AdminDashboard />} />

      {/* Admin Orders Page */}
      <Route path="orders" element={<AdminOrders />} />

      {/* Admin Products Page */}
      <Route path="products" element={<AdminProducts />} />

      {/* Redirect any unknown admin route back to dashboard */}
      <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  );
};

export default AdminRouter;
