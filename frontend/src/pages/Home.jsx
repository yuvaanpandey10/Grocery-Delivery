import MainBanner from "../components/MainBanner";
import Category from "../components/Category";
// Import the Best Sellers section
import BestSellers from "../components/BestSellers";

const Home = () => {
  return (
    <div className="mt-10">
      <MainBanner />
      <Category />
      {/* Best Sellers shows below Categories */}
      <BestSellers />
    </div>
  );
};

export default Home;
