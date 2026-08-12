import { menu_list } from "../assets/assets.js";

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
        {menu_list.map((item) => (
          <button
            key={item.menu_name}
            className={`cat-item ${category === item.menu_name ? "active" : ""}`}
            onClick={() => setCategory(category === item.menu_name ? "All" : item.menu_name)}
          >
            <div className="cat-circle">
              <img src={item.menu_image} alt={item.menu_name} />
            </div>
            <span>{item.menu_name}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ExploreMenu;

