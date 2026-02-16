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

  // ✅ ADMIN CATEGORIES
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

  /* ================= LOAD INITIAL DATA ================= */
  const fetchProducts = useCallback(() => {
    try {
      const storedProducts = JSON.parse(localStorage.getItem("products"));
      if (storedProducts?.length) {
        setProducts(storedProducts);
      } else {
        setProducts(dummyProducts);
        localStorage.setItem("products", JSON.stringify(dummyProducts));
      }

      const storedCategories =
        JSON.parse(localStorage.getItem("adminCategories")) || [];
      setAdminCategories(storedCategories);
    } catch (error) {
      console.error("LocalStorage Error:", error);
      setProducts(dummyProducts);
      setAdminCategories([]);
    }
  }, []);

  /* ================= CART FUNCTIONS ================= */

  const addToCart = useCallback((itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      updated[itemId] = (updated[itemId] || 0) + 1;
      return updated;
    });
    toast.success("Product added to cart");
  }, []);

  const updateCartItem = useCallback((itemId, quantity) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId]) {
        updated[itemId] -= 1;
        if (updated[itemId] === 0) delete updated[itemId];
      }
      return updated;
    });
    toast.success("Removed from cart");
  }, []);

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

  /* ================= ADMIN AUTH ================= */

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

  /* ================= ADMIN CATEGORY ================= */

  const addAdminCategory = (newCategory) => {
    // prevent duplicate
    const exists = adminCategories.some(
      (c) => c.text.toLowerCase() === newCategory.text.toLowerCase()
    );

    if (exists) {
      toast.error("Category already exists");
      return;
    }

    const updated = [...adminCategories, newCategory];
    setAdminCategories(updated);
    localStorage.setItem("adminCategories", JSON.stringify(updated));
    toast.success(`Category "${newCategory.text}" added!`);
  };

  const deleteAdminCategory = (categoryText) => {
    const updated = adminCategories.filter(
      (c) => c.text !== categoryText
    );
    setAdminCategories(updated);
    localStorage.setItem("adminCategories", JSON.stringify(updated));
    toast.success(`Category "${categoryText}" deleted!`);
  };

  /* ================= INIT ================= */

  useEffect(() => {
    fetchProducts();

    const token = localStorage.getItem("adminToken");
    if (token) setIsAdmin(true);

    const storedOrders =
      JSON.parse(localStorage.getItem("orders")) || [];
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
