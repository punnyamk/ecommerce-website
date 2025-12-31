/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyProducts } from '../assets/assets';
import toast from 'react-hot-toast';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || '₹';
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState(''); // ✅ STRING

  // ---------------- ADMIN STATE ----------------
  const [isAdmin, setIsAdmin] = useState(false);

  // ---------------- ORDERS STATE ----------------
  const [orders, setOrders] = useState(
    JSON.parse(localStorage.getItem('orders')) || []
  );

  // ---------------- ADMIN CREDENTIALS ----------------
  const ADMIN_EMAIL = 'admin@shop.com';
  const ADMIN_PASSWORD = 'admin123';

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProducts = useCallback(() => {
    setProducts(dummyProducts);
  }, []);

  // ---------------- CART FUNCTIONS ----------------
  const addToCart = useCallback(
    (itemId) => {
      const cartData = { ...cartItems };
      cartData[itemId] = (cartData[itemId] || 0) + 1;
      setCartItems(cartData);
      toast.success('Product added to cart');
    },
    [cartItems]
  );

  const updateCartItem = useCallback(
    (itemId, quantity) => {
      const cartData = { ...cartItems };
      cartData[itemId] = quantity;
      setCartItems(cartData);
    },
    [cartItems]
  );

  const removeFromCart = useCallback(
    (itemId) => {
      const cartData = { ...cartItems };
      if (cartData[itemId]) {
        cartData[itemId] -= 1;
        if (cartData[itemId] === 0) delete cartData[itemId];
        setCartItems(cartData);
        toast.success('Removed from cart');
      }
    },
    [cartItems]
  );

  const clearCart = () => {
    setCartItems({});
    toast.success('Cart cleared');
  };

  const getCartCount = () => Object.values(cartItems).reduce((a, b) => a + b, 0);

  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (product) total += product.offerPrice * cartItems[id];
    }
    return total;
  };

  // ---------------- ADMIN LOGIN / LOGOUT ----------------
  const adminLogin = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('adminToken', 'logged-in');
      setIsAdmin(true);
      toast.success('Admin login successful!');
      navigate('/admin'); // redirect to admin dashboard
      return true;
    } else {
      toast.error('Invalid admin credentials');
      return false;
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
    navigate('/admin-login');
  };

  // ---------------- LOAD PRODUCTS / ADMIN TOKEN ----------------
  useEffect(() => {
    fetchProducts();
    const token = localStorage.getItem('adminToken');
    if (token) setIsAdmin(true);
  }, [fetchProducts]);

  // ---------------- CONTEXT VALUE ----------------
  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
     setProducts,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,

    // Admin
    isAdmin,
    adminLogin,
    adminLogout,

    // Orders
    orders,
    setOrders,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
