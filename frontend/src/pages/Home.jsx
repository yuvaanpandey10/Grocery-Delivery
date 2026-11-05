import MainBanner from "../components/MainBanner";
import Category from "../components/Category";
import BestSellers from "../components/BestSellers";
// Import the Bottom Banner section
import BottomBanner from "../components/BottomBanner";

const Home = () => {
  return (
    <div className="mt-10">
      <MainBanner />
      <Category />
      <BestSellers />
      {/* Bottom Banner shows below Best Sellers */}
      <BottomBanner />
    </div>
  );
};

export default Home;
