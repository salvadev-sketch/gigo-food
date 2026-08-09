import { useContext } from "react";
import { StoreContext } from "../context/StoreContext.jsx";
import FoodItem from "./FoodItem.jsx";

const FoodDisplay = ({ category }) => {
  const { foodList } = useContext(StoreContext);
  const items = category === "All" ? foodList : foodList.filter((f) => f.category === category);

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="section-head">
        <h2>Top dishes near you</h2>
      </div>
      {items.length === 0 ? (
        <p className="empty-note">No dishes in this category yet.</p>
      ) : (
        <div className="food-grid">
          {items.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default FoodDisplay;
