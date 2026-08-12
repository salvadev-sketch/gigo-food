import { useContext } from "react";
import { StoreContext } from "../context/StoreContext.jsx";

const fmt = (n) => `FRw ${n.toLocaleString()}`;

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, API_URL } = useContext(StoreContext);
  const qty = cartItems[id] || 0;
  const imgSrc = image?.startsWith("http") ? image : `${API_URL}/uploads/${image}`;

  return (
    <div className="food-card">
      <div className="food-img">
        <img src={imgSrc} alt={name} onError={(e) => (e.target.style.opacity = 0.2)} />
      </div>
      {qty === 0 ? (
        <button className="food-add" onClick={() => addToCart(id)}>+</button>
      ) : (
        <div className="food-qty">
          <button onClick={() => removeFromCart(id)}>−</button>
          <span>{qty}</span>
          <button onClick={() => addToCart(id)}>+</button>
        </div>
      )}
      <div className="food-body">
        <h4>{name}</h4>
        <p className="desc">{description}</p>
        <div className="price">{fmt(price)}</div>
      </div>
    </div>
  );
};

export default FoodItem;
