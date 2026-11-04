// Import the ProductCard component (it shows the title and all cards)
import ProductCard from "./ProductCard";

const BestSellers = () => {
  return (
    // OUTER WRAPPER: breaks out of App.jsx padding and uses full screen width
    // (same as Category.jsx, so both sections line up)
    <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 md:px-8 xl:px-12 mt-16">
      {/* INNER WRAPPER: limits max width and centers the content */}
      <div className="mx-auto max-w-[1600px]">
        {/* No props needed, ProductCard reads everything from AppContext */}
        <ProductCard />
      </div>
    </div>
  );
};

export default BestSellers;
