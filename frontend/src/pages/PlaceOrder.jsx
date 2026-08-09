import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext.jsx";

const fmt = (n) => `FRw ${n.toLocaleString()}`;

const PlaceOrder = () => {
  const { cartItems, foodList, getCartSubtotal, getCartTotal, DELIVERY_FEE, API_URL, token, clearCart } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState({ firstName: "", lastName: "", email: "", street: "", city: "", province: "" });
  const [momoPhone, setMomoPhone] = useState("");
  const [status, setStatus] = useState(""); // "", "requesting", "waiting", "success", "error"
  const [errorMsg, setErrorMsg] = useState("");

  const handleField = (field) => (e) => setAddress((prev) => ({ ...prev, [field]: e.target.value }));

  const items = Object.entries(cartItems)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const food = foodList.find((f) => f._id === id);
      return food ? { foodId: id, name: food.name, price: food.price, quantity: qty } : null;
    })
    .filter(Boolean);

  const pollPaymentStatus = async (orderId, attemptsLeft = 15) => {
    if (attemptsLeft <= 0) {
      setStatus("error");
      setErrorMsg("Payment is taking longer than expected. Check My Orders shortly or try again.");
      return;
    }
    const res = await axios.get(`${API_URL}/api/order/status/${orderId}`, { headers: { token } });
    if (res.data.paymentStatus === "Successful") {
      setStatus("success");
      clearCart();
      setTimeout(() => navigate("/myorders"), 1200);
    } else if (res.data.paymentStatus === "Failed") {
      setStatus("error");
      setErrorMsg("Payment failed or was declined on your phone. Please try again.");
    } else {
      setTimeout(() => pollPaymentStatus(orderId, attemptsLeft - 1), 4000);
    }
  };

  const handlePay = async () => {
    if (!momoPhone.trim() || items.length === 0) return;
    setStatus("requesting");
    setErrorMsg("");
    try {
      const res = await axios.post(
        `${API_URL}/api/order/place`,
        { items, address, momoPhone },
        { headers: { token } }
      );
      if (!res.data.success) {
        setStatus("error");
        setErrorMsg(res.data.message || "Could not place order");
        return;
      }
      setStatus("waiting");
      pollPaymentStatus(res.data.orderId);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.response?.data?.message || "Could not reach the server — check your connection");
    }
  };

  return (
    <section className="section">
      <h2 className="page-title">Delivery Information</h2>
      <div className="checkout-wrap">
        <div>
          <div className="form-grid">
            <div className="field"><label>First name</label><input value={address.firstName} onChange={handleField("firstName")} required /></div>
            <div className="field"><label>Last name</label><input value={address.lastName} onChange={handleField("lastName")} required /></div>
            <div className="field full"><label>Email address</label><input type="email" value={address.email} onChange={handleField("email")} required /></div>
            <div className="field full"><label>Street</label><input value={address.street} onChange={handleField("street")} required /></div>
            <div className="field"><label>City</label><input value={address.city} onChange={handleField("city")} required /></div>
            <div className="field"><label>Province</label><input value={address.province} onChange={handleField("province")} required /></div>
            <div className="field full">
              <label>MTN MoMo Number</label>
              <input value={momoPhone} onChange={(e) => setMomoPhone(e.target.value)} placeholder="+257 79 000 000" required />
            </div>
          </div>
          <div className="momo-box">
            <h4 style={{ fontSize: 13, color: "var(--amber-deep)", marginBottom: 8 }}>📱 Pay with MTN Mobile Money</h4>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
              We'll send a payment prompt to the number above. Approve it on your phone to confirm your order.
            </div>
            {status === "requesting" && <div className="momo-status">Sending payment request…</div>}
            {status === "waiting" && <div className="momo-status">Waiting for approval on your phone…</div>}
            {status === "success" && <div className="momo-status">✅ Payment confirmed — placing your order…</div>}
            {status === "error" && <div className="error-text">{errorMsg}</div>}
          </div>
        </div>
        <div className="totals-card">
          <h3>Cart Totals</h3>
          <div className="totals-row"><span>Subtotal</span><span>{fmt(getCartSubtotal())}</span></div>
          <div className="totals-row"><span>Delivery Fee</span><span>{fmt(DELIVERY_FEE)}</span></div>
          <div className="totals-row total"><span>Total</span><span>{fmt(getCartTotal())}</span></div>
          <button
            className="primary-btn"
            onClick={handlePay}
            disabled={items.length === 0 || status === "requesting" || status === "waiting"}
          >
            {status === "waiting" ? "Waiting for approval…" : "Request MoMo Payment"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default PlaceOrder;
