import { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AdminContext } from "./context/AdminContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./pages/Login.jsx";
import Add from "./pages/Add.jsx";
import List from "./pages/List.jsx";
import Orders from "./pages/Orders.jsx";

const App = () => {
  const { token } = useContext(AdminContext);

  if (!token) {
    return <Login />;
  }

  return (
    <div className="admin-shell">
      <Navbar />
      <div className="admin-body">
        <Sidebar />
        <main className="admin-main">
          <Routes>
            <Route path="/" element={<Navigate to="/add" replace />} />
            <Route path="/add" element={<Add />} />
            <Route path="/list" element={<List />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<Navigate to="/add" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
