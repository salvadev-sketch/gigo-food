import { assets } from "../assets/assets.js";

const menuList = [
  { name: "Salad", image: assets.menu_1 },
  { name: "Rolls", image: assets.menu_2 },
  { name: "Deserts", image: assets.menu_3 },
  { name: "Sandwich", image: assets.menu_4 },
  { name: "Cake", image: assets.menu_5 },
  { name: "Pure Veg", image: assets.menu_6 },
  { name: "Pasta", image: assets.menu_7 },
  { name: "Noodles", image: assets.menu_8 },
];

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <section className="section" id="explore-menu">
      <div className="section-head">
        <h2>Explore our menu</h2>
        <p>
          Choose from a diverse menu featuring a delectable array of dishes.
          Our mission is to satisfy your cravings and elevate your dining experience.
        </p>
      </div>
      <div className="cat-row">
        <button
          className={`cat-item ${category === "All" ? "active" : ""}`}
          onClick={() => setCategory("All")}
        >
          <div className="cat-circle" style={{ fontSize: 30 }}>🍽️</div>
          <span>All</span>
        </button>
        {menuList.map((item) => (
          <button
            key={item.name}
            className={`cat-item ${category === item.name ? "active" : ""}`}
            onClick={() => setCategory(category === item.name ? "All" : item.name)}
          >
            <div className="cat-circle">
              <img src={item.image} alt={item.name} />
            </div>
            <span>{item.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ExploreMenu;
