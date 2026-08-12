import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const DELIVERY_FEE = 1500;

export const StoreContextProvider = (props) => {
  const [foodList, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({}); // { foodId: qty }
  const [token, setToken] = useState(localStorage.getItem("gigofood-token") || "");
  const [user, setUser] = useState(null);

  const authHeaders = () => ({ headers: { token } });

  const fetchFoodList = async () => {
    const res = await axios.get(`${API_URL}/api/food/list`);
    if (res.data.success) setFoodList(res.data.data);
  };

  const loadCartFromServer = async () => {
    if (!token) return;
    const res = await axios.get(`${API_URL}/api/cart/get`, authHeaders());
    if (res.data.success) setCartItems(res.data.cartData || {});
  };

  const addToCart = async (foodId) => {
    setCartItems((prev) => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));
    if (token) {
      await axios.post(`${API_URL}/api/cart/add`, { foodId }, authHeaders());
    }
  };

  const removeFromCart = async (foodId) => {
    setCartItems((prev) => {
      const next = { ...prev };
      if (next[foodId] > 1) next[foodId] -= 1;
      else delete next[foodId];
      return next;
    });
    if (token) {
      await axios.post(`${API_URL}/api/cart/remove`, { foodId }, authHeaders());
    }
  };

  const clearCart = () => setCartItems({});

  const getCartSubtotal = () => {
    let sum = 0;
    for (const id in cartItems) {
      const food = foodList.find((f) => f._id === id);
      if (food) sum += food.price * cartItems[id];
    }
    return sum;
  };

  const getCartTotal = () => {
    const sub = getCartSubtotal();
    return sub > 0 ? sub + DELIVERY_FEE : 0;
  };

  const getCartCount = () => Object.values(cartItems).reduce((a, b) => a + b, 0);

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/api/user/login`, { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem("gigofood-token", res.data.token);
    }
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${API_URL}/api/user/register`, { name, email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem("gigofood-token", res.data.token);
    }
    return res.data;
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("gigofood-token");
  };

  useEffect(() => {
    fetchFoodList().catch((err) => console.error("[gigo-food] Failed to load menu:", err.message));
    if (token) loadCartFromServer().catch((err) => console.error("[gigo-food] Failed to load cart:", err.message));
  }, []);

  const contextValue = {
    API_URL,
    DELIVERY_FEE,
    foodList,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getCartSubtotal,
    getCartTotal,
    getCartCount,
    token,
    user,
    login,
    register,
    logout,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
