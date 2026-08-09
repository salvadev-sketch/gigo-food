import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../context/StoreContext.jsx";

const fmt = (n) => `FRw ${n.toLocaleString()}`;

const Cart = () => {
  const { cartItems, foodList, addToCart, removeFromCart, getCartSubtotal, getCartTotal, DELIVERY_FEE, API_URL, token } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const entries = Object.entries(cartItems).filter(([, qty]) => qty > 0);
  const subtotal = getCartSubtotal();

  return (
    <section className="section">
      <h2 className="page-title">Your Cart</h2>
      <div className="cart-wrap">
        <div>
          {entries.length === 0 ? (
            <div className="empty-note">Your cart is empty — add something tasty from the menu!</div>
          ) : (
            <table className="cart-table">
              <thead>
                <tr><th></th><th>Item</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr>
              </thead>
              <tbody>
                {entries.map(([id, qty]) => {
                  const food = foodList.find((f) => f._id === id);
                  if (!food) return null;
                  const imgSrc = food.image?.startsWith("http") ? food.image : `${API_URL}/uploads/${food.image}`;
                  return (
                    <tr key={id}>
                      <td><div className="cart-food-icon"><img src={imgSrc} alt={food.name} /></div></td>
                      <td>{food.name}</td>
                      <td>{fmt(food.price)}</td>
                      <td>
                        <button className="remove-x" style={{ color: "var(--forest)" }} onClick={() => removeFromCart(id)}>−</button>
                        <span className="qty-badge">{qty}</span>
                        <button className="remove-x" style={{ color: "var(--forest)" }} onClick={() => addToCart(id)}>+</button>
                      </td>
                      <td>{fmt(food.price * qty)}</td>
                      <td>
                        <button className="remove-x" onClick={() => { for (let i = 0; i < qty; i++) removeFromCart(id); }}>✕</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="totals-card">
          <h3>Cart Totals</h3>
          <div className="totals-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
          <div className="totals-row"><span>Delivery Fee</span><span>{fmt(DELIVERY_FEE)}</span></div>
          <div className="totals-row total"><span>Total</span><span>{fmt(getCartTotal())}</span></div>
          <button
            className="primary-btn"
            disabled={entries.length === 0}
            onClick={() => navigate(token ? "/order" : "/cart")}
          >
            Proceed to Checkout
          </button>
          {!token && entries.length > 0 && (
            <div className="error-text">Please sign in to check out.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cart;
