import { assets } from "../assets/assets.js";

const Header = () => {
  return (
    <section className="hero">
      <div className="hero-copy">
        <h1>
          Order your <em>favourite food</em> here
        </h1>
        <p>
          Choose from a diverse menu featuring dishes crafted with the finest
          local ingredients. Fast delivery across the city, paid the easy way
          with MTN MoMo.
        </p>
        <a href="#explore-menu">
          <button className="hero-cta">View Menu</button>
        </a>
      </div>
      <img className="hero-img" src={assets.header_img} alt="Food spread" />
    </section>
  );
};

export default Header;
