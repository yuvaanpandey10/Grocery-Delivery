// Import the ProductCard component (it shows the title and all cards)
import ProductCard from "./ProductCard";

const BestSellers = () => {
  return (
    // OUTER WRAPPER: breaks out of App.jsx padding and uses full screen width
    // (same as Category.jsx, so both sections line up)
    // id="best-sellers" = the footer link scrolls to this element
    // scroll-mt-24 = keeps the title from hiding under the sticky Navbar
    <div
      id="best-sellers"
      className="relative left-1/2 w-screen -translate-x-1/2 px-4 md:px-8 xl:px-12 mt-16 scroll-mt-24"
    >
      {/* INNER WRAPPER: limits max width and centers the content */}
      <div className="mx-auto max-w-[1600px]">
        {/* No props needed, ProductCard reads everything from AppContext */}
        <ProductCard />
      </div>
    </div>
  );
};

export default BestSellers;
