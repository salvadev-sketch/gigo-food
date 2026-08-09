import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../context/StoreContext.jsx";

const fmt = (n) => `FRw ${n.toLocaleString()}`;

const MyOrders = () => {
  const { API_URL, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/api/order/userorders`, { headers: { token } });
      if (res.data.success) setOrders(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  return (
    <section className="section">
      <h2 className="page-title">My Orders</h2>
      {!token ? (
        <div className="empty-note">Sign in to see your order history.</div>
      ) : loading ? (
        <div className="empty-note">Loading your orders…</div>
      ) : orders.length === 0 ? (
        <div className="empty-note">No orders yet — your placed orders will show up here.</div>
      ) : (
        orders.map((o) => (
          <div className="order-card" key={o._id}>
            <div style={{ fontSize: 30 }}>📦</div>
            <div className="info">
              <h4 style={{ fontSize: 14, marginBottom: 4 }}>
                {o.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
              </h4>
              <span style={{ fontSize: 12.5, color: "var(--muted)" }}>
                {fmt(o.amount)} • Items: {o.items.length} • Payment: {o.payment.status}
              </span>
            </div>
            <span className={`status-pill ${o.status}`}>{o.status}</span>
          </div>
        ))
      )}
    </section>
  );
};

export default MyOrders;
