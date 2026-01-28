/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "₹";
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);

  // ✅ PRODUCTS
  const [products, setProducts] = useState([]);

  // ✅ ADMIN-ADDED CATEGORIES
  const [adminCategories, setAdminCategories] = useState([]); 

  // ✅ CART
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ ADMIN
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ ORDERS
  const [orders, setOrders] = useState([]);

  const ADMIN_EMAIL = "admin@shop.com";
  const ADMIN_PASSWORD = "admin123";

  // ✅ LOAD PRODUCTS & CATEGORIES
  const fetchProducts = useCallback(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products"));
    if (storedProducts && storedProducts.length > 0) {
      setProducts(storedProducts);
    } else {
      setProducts(dummyProducts);
      localStorage.setItem("products", JSON.stringify(dummyProducts));
    }

    const storedCategories = JSON.parse(localStorage.getItem("adminCategories")) || [];
    setAdminCategories(storedCategories);
  }, []);

  // ✅ CART FUNCTIONS
  const addToCart = useCallback(
    (itemId) => {
      const cartData = { ...cartItems };
      cartData[itemId] = (cartData[itemId] || 0) + 1;
      setCartItems(cartData);
      toast.success("Product added to cart");
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
        toast.success("Removed from cart");
      }
    },
    [cartItems]
  );

  const clearCart = () => {
    setCartItems({});
    toast.success("Cart cleared");
  };

  const getCartCount = () =>
    Object.values(cartItems).reduce((a, b) => a + b, 0);

  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (product) total += product.offerPrice * cartItems[id];
    }
    return total;
  };

  // ✅ ADMIN LOGIN
  const adminLogin = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("adminToken", "logged-in");
      setIsAdmin(true);
      toast.success("Admin login successful!");
      navigate("/admin");
      return true;
    }
    toast.error("Invalid admin credentials");
    return false;
  };

  const adminLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
    navigate("/admin-login");
  };

  // ✅ ADD NEW CATEGORY (ADMIN)
  const addAdminCategory = (newCategory) => {
    const updatedCategories = [...adminCategories, newCategory];
    setAdminCategories(updatedCategories);
    localStorage.setItem("adminCategories", JSON.stringify(updatedCategories));
    toast.success(`Category "${newCategory.text}" added!`);
  };

  // ✅ DELETE CATEGORY (OPTIONAL)
  const deleteAdminCategory = (categoryText) => {
    const updatedCategories = adminCategories.filter(c => c.text !== categoryText);
    setAdminCategories(updatedCategories);
    localStorage.setItem("adminCategories", JSON.stringify(updatedCategories));
    toast.success(`Category "${categoryText}" deleted!`);
  };

  // ✅ INIT
  useEffect(() => {
    fetchProducts();

    const token = localStorage.getItem("adminToken");
    if (token) setIsAdmin(true);

    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders);
  }, [fetchProducts]);

  return (
    <AppContext.Provider
      value={{
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,

        products,
        setProducts,
        currency,

        cartItems,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getCartAmount,
        getCartCount,

        searchQuery,
        setSearchQuery,

        isAdmin,
        adminLogin,
        adminLogout,

        orders,
        setOrders,

        // ✅ ADMIN CATEGORIES
        adminCategories,
        addAdminCategory,
        deleteAdminCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
