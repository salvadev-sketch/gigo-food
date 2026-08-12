import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { StoreContext } from "../context/StoreContext.jsx";
import { assets } from "../assets/assets.js";

const Navbar = ({ onSignInClick }) => {
  const { getCartCount, token, user, logout } = useContext(StoreContext);
  const location = useLocation();
  const count = getCartCount();

  return (
    <header className="topbar">
      <div className="brand">
        <div className="display">
          GIGO <span>Food</span>
        </div>
      </div>
      <nav className="primary">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
        <a href="/#explore-menu">Menu</a>
        <Link to="/myorders" className={location.pathname === "/myorders" ? "active" : ""}>My Orders</Link>
      </nav>
      <div className="header-actions">
        <Link to="/cart" className="icon-btn">
          <img src={assets.basket_icon} alt="cart" />
          {count > 0 && <span className="cart-badge">{count}</span>}
        </Link>
        {token ? (
          <button className="user-chip" onClick={logout} title="Click to sign out">
            <span className="av">{user?.name?.[0]?.toUpperCase() || "U"}</span>
            {user?.name || "Account"}
          </button>
        ) : (
          <button className="signin-btn" onClick={onSignInClick}>Sign In</button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
