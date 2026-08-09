import { useState } from "react";
import Header from "../components/Header.jsx";
import ExploreMenu from "../components/ExploreMenu.jsx";
import FoodDisplay from "../components/FoodDisplay.jsx";
import AppDownload from "../components/AppDownload.jsx";

const Home = () => {
  const [category, setCategory] = useState("All");
  return (
    <>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownload />
    </>
  );
};

export default Home;
