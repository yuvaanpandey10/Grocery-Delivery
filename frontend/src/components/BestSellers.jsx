// Import the card component
import ProductCard from "./ProductCard";
// Import the context hook to get products from AppContext
import { useAppContext } from "../context/AppContext";

const BestSellers = () => {
  // products comes from AppContext (filled by fetchProducts in AppContext.jsx)
  const { products } = useAppContext();

  return (
    // OUTER WRAPPER: same as Category.jsx so both sections line up
    <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 md:px-8 xl:px-12 mt-16">
      <div className="mx-auto max-w-[1600px]">
        {/* SECTION TITLE */}
        <h2 className="text-2xl md:text-3xl font-medium text-gray-800">
          Best Sellers
        </h2>

        {/* GRID: 2 cards per row on phones, 3 on sm, 4 on lg, 5 on xl */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {/* MAP METHOD: slice(0, 5) = first 5 products, one ProductCard each.
              key = product._id (unique id from assets.js) */}
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSellers;
