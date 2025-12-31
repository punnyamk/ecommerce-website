import React from 'react';
import Navbar from './components/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';

// Admin
import AdminRouter from './pages/Admin/AdminRouter';
import AdminLogin from './pages/Admin/AdminLogin';

// Seller
import SellerLogin from './components/seller/SellerLogin';
import SellerLayout from './pages/seller/SellerLayout';
import AddProduct from './pages/seller/AddProduct';
import ProductList from './pages/seller/ProductList';
import Orders from './pages/seller/Orders';

const App = () => {
  const { showUserLogin } = useAppContext();
  const location = useLocation();
  const isSellerPath = location.pathname.includes('seller');

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {!isSellerPath && <Navbar />}
      {showUserLogin && <Login />}
      <Toaster />

      <div>
        <Routes>
          {/* User Pages */}
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/products/:category' element={<ProductCategory />} />
          <Route path='/products/:category/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/add-address' element={<AddAddress />} />
          <Route path='/my-orders' element={<MyOrders />} />

          {/* Admin Login */}
          <Route path='/admin-login' element={<AdminLogin />} />

          {/* Admin Panel */}
          <Route path='/admin/*' element={<AdminRouter />} />

          {/* Seller Pages */}
          <Route
            path='/seller'
            element={<SellerLogin />}
          >
            <Route index element={<AddProduct />} />
            <Route path='products-list' element={<ProductList />} />
            <Route path='orders' element={<Orders />} />
          </Route>
        </Routes>
      </div>

      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
