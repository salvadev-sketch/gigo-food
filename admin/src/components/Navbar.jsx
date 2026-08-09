import { useContext } from "react";
import { AdminContext } from "../context/AdminContext.jsx";
import { assets } from "../assets/assets.js";

const Navbar = () => {
  const { logout } = useContext(AdminContext);

  return (
    <div className="admin-topbar">
      <div className="admin-brand">
        <img src={assets.logo} alt="GIGO Food" />
        <span>
          GIGO <em>Admin</em>
        </span>
      </div>
      <div className="admin-topbar-actions">
        <img className="admin-avatar" src={assets.profile_image} alt="Admin" />
        <button className="admin-logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
