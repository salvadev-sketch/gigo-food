import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AdminContext, API_URL } from "../context/AdminContext.jsx";
import { assets } from "../assets/assets.js";

// Must match backend/models/Order.js status enum exactly
const STATUS_OPTIONS = ["Food Processing", "Out for Delivery", "Delivered", "Cancelled"];

const Orders = () => {
  const { authHeaders } = useContext(AdminContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/order/list`, authHeaders());
      if (res.data.success) setOrders(res.data.data);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    // optimistic update, matches the customer My Orders live-sync in the prototype
    setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
    try {
      await axios.post(`${API_URL}/api/order/update-status`, { orderId, status }, authHeaders());
    } catch (err) {
      setError("Failed to update order status — refreshing list");
      fetchOrders();
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h2 className="page-title">Orders ({orders.length})</h2>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p className="empty-note">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="empty-note">No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>
            <img className="order-icon" src={assets.parcel_icon} alt="" />
            <div className="info">
              <p className="order-items">
                {order.items.map((it) => `${it.name} x${it.quantity}`).join(", ")}
              </p>
              <p className="order-address">
                {order.address?.firstName} {order.address?.lastName}, {order.address?.street},{" "}
                {order.address?.city}, {order.address?.province} — {order.address?.phone}
              </p>
              <p className="order-meta">
                {order.items.reduce((n, i) => n + i.quantity, 0)} items · {order.amount} FRw ·
                Payment: {order.payment?.status}
              </p>
            </div>
            <select
              className="status-select"
              value={order.status}
              onChange={(e) => updateStatus(order._id, e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
