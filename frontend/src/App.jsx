import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import LoginPopup from "./components/LoginPopup.jsx";
import Home from "./pages/Home.jsx";
import Cart from "./pages/Cart.jsx";
import PlaceOrder from "./pages/PlaceOrder.jsx";
import MyOrders from "./pages/MyOrders.jsx";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin && <LoginPopup onClose={() => setShowLogin(false)} />}
      <Navbar onSignInClick={() => setShowLogin(true)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<PlaceOrder />} />
        <Route path="/myorders" element={<MyOrders />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
