import { createContext, useState } from "react";
import axios from "axios";

export const AdminContext = createContext(null);

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const STORAGE_KEY = "gigofood-admin-token";

export const AdminContextProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEY) || "");
  const [admin, setAdmin] = useState(null);

  const authHeaders = () => ({ headers: { token } });

  // Admin panel reuses the shared /api/user/login endpoint. The backend's
  // requireAdmin middleware is what actually enforces access on every
  // protected route — this client-side role check just keeps non-admin
  // accounts out of the admin UI.
  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/api/user/login`, { email, password });
    if (res.data.success && res.data.user.role === "admin") {
      setToken(res.data.token);
      setAdmin(res.data.user);
      localStorage.setItem(STORAGE_KEY, res.data.token);
      return { success: true };
    }
    if (res.data.success && res.data.user.role !== "admin") {
      return { success: false, message: "This account does not have admin access" };
    }
    return { success: false, message: res.data.message || "Login failed" };
  };

  const logout = () => {
    setToken("");
    setAdmin(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const contextValue = { API_URL, token, admin, authHeaders, login, logout };

  return (
    <AdminContext.Provider value={contextValue}>
      {props.children}
    </AdminContext.Provider>
  );
};
