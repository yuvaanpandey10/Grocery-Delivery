import MainBanner from "../components/MainBanner";
import Category from "../components/Category";
import BestSellers from "../components/BestSellers";
import BottomBanner from "../components/BottomBanner";
// Import the Newsletter section
import NewsLetter from "../components/NewsLetter";
import BlurFade from "../components/BlurFade";

const Home = () => {
  return (
    <div className="mt-10">
      <MainBanner />
      <BlurFade delay={0.05}>
        <Category />
      </BlurFade>
      <BlurFade delay={0.04}>
        <BestSellers />
      </BlurFade>
      <BlurFade delay={0.04}>
        <BottomBanner />
      </BlurFade>
      {/* Newsletter shows below Bottom Banner */}
      <BlurFade delay={0.04}>
        <NewsLetter />
      </BlurFade>
    </div>
  );
};

export default Home;
