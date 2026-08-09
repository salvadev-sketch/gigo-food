import { assets } from "../assets/assets.js";

const AppDownload = () => {
  return (
    <section className="app-cta">
      <h2>For a better experience, download the GIGO Food app</h2>
      <div className="badges">
        <img src={assets.play_store} alt="Get it on Google Play" />
        <img src={assets.app_store} alt="Download on the App Store" />
      </div>
    </section>
  );
};

export default AppDownload;
