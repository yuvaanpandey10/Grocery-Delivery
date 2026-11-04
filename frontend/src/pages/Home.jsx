// Import the banner component (already exists)
import MainBanner from "../components/MainBanner";
// Import the new Category component
import Category from "../components/Category";

const Home = () => {
  return (
    // mt-10 = space below the navbar
    <div className="mt-10">
      {/* Top banner */}
      <MainBanner />

      {/* Categories section, shows below the banner */}
      <Category />
    </div>
  );
};

export default Home;
