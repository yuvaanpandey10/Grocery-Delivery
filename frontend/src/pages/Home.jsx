import MainBanner from "../components/MainBanner";
import Category from "../components/Category";
import BestSellers from "../components/BestSellers";
import BottomBanner from "../components/BottomBanner";
// Import the Newsletter section
import NewsLetter from "../components/NewsLetter";

const Home = () => {
  return (
    <div className="mt-10">
      <MainBanner />
      <Category />
      <BestSellers />
      <BottomBanner />
      {/* Newsletter shows below Bottom Banner */}
      <NewsLetter />
    </div>
  );
};

export default Home;
