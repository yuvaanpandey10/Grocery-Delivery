// useParams reads the category word from the address, e.g. "fruits" from /products/fruits
import { useParams } from "react-router-dom";
// assets = icons, categories = your category list (text, path, image, bgColor)
import { assets, categories } from "../assets/assets";
// Shared data and functions from your Context API
import { useAppContext } from "../context/AppContext";
import { scrollToTop } from "../utils/scroll";

const CategoryProducts = () => {
  // 1) Read the category word from the address.
  //    Category.jsx sends it in lowercase, so we lowercase everything we compare.
  const { category } = useParams();
  const categoryKey = category.toLowerCase();

  // FROM CONTEXT: all products, cart data, cart functions
  // NEW: navigate is added, to open the product details page
  const {
    products,
    productsLoaded,
    cartItems,
    addToCart,
    removeFromCart,
    navigate,
  } =
    useAppContext();

  // NEW: open the product page, e.g. /products/vegetables/gd46g23h
  const openProduct = (product) => {
    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
    scrollToTop();
  };

  // 2) Find the category info (we only need its "text" for the header)
  const categoryInfo = categories.find(
    (c) => c.path.toLowerCase() === categoryKey,
  );

  // 3) Keep only the products that belong to this category
  const categoryProducts = products.filter(
    (product) => product.category.toLowerCase() === categoryKey,
  );

  // If the address has a wrong category word, show a simple message
  if (!categoryInfo) {
    return (
      <div className="mt-16 mb-16 text-center text-gray-500">
        Category not found
      </div>
    );
  }

  // HEADER TEXT: uppercase, and split into "first words" + "last word".
  // Example: "Instant Food" -> beforeLast = "INSTANT", lastWord = "FOOD"
  // The last word gets the green underline (like your reference).
  const words = categoryInfo.text.toUpperCase().split(" ");
  const lastWord = words.pop();
  const beforeLast = words.join(" ");

  return (
    // Full-width wrapper (same as your other sections)
    <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 md:px-8 xl:px-12 mt-16 mb-16">
      <div className="mx-auto max-w-[1600px]">
        {/* HEADER (changes for every category, from assets.js "text") */}
        <h1 className="text-2xl md:text-3xl font-medium text-gray-700">
          {beforeLast}{" "}
          {/* Last word: border-b-2 border-primary = green underline,
              pb-2 = gap between the word and the line */}
          <span className="inline-block border-b-2 border-primary pb-2">
            {lastWord}
          </span>
        </h1>

        {/* GRID: 2 cards per row on phones, 3 on sm, 4 on lg, 5 on xl */}
        {!productsLoaded ? (
          <p className="mt-6 text-gray-500">Loading products...</p>
        ) : categoryProducts.length === 0 ? (
          <p className="mt-6 text-gray-500">No products in this category yet.</p>
        ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {/* MAP METHOD: one card for each product of this category */}
          {categoryProducts.map((product) => (
            <div
              key={product._id}
              className="group border border-gray-500/20 rounded-md px-3 md:px-4 py-3 bg-white"
            >
              {/* IMAGE: product.image is an array, [0] = first image.
                  NEW: click opens the product page */}
              <div
                className="cursor-pointer flex items-center justify-center"
                onClick={() => openProduct(product)}
              >
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="group-hover:scale-105 transition max-h-28 md:max-h-32 object-contain"
                />
              </div>

              <div className="mt-4 text-gray-500/60 text-sm">
                <p>{product.category}</p>

                {/* NEW: click on the name opens the product page */}
                <p
                  className="cursor-pointer text-gray-700 font-medium text-lg truncate"
                  onClick={() => openProduct(product)}
                >
                  {product.name}
                </p>

                {/* STARS: fixed at 4 (your data has no rating) */}
                <div className="flex items-center gap-0.5">
                  {Array(5)
                    .fill("")
                    .map((_, i) => (
                      <img
                        key={i}
                        className="w-3 md:w-3.5"
                        src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                        alt="star"
                      />
                    ))}
                  <p>(4)</p>
                </div>

                {/* PRICE + ADD / COUNTER */}
                <div className="flex items-end justify-between mt-3 gap-2">
                  <p className="md:text-xl text-base font-medium text-primary">
                    ${product.offerPrice}{" "}
                    <span className="text-gray-500/60 md:text-sm text-xs line-through">
                      ${product.price}
                    </span>
                  </p>

                  <div className="text-primary">
                    {/* Not in the cart: show ADD button */}
                    {!cartItems[product._id] ? (
                      <button
                        className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-20 w-16 h-8.5 rounded cursor-pointer"
                        onClick={() => addToCart(product._id)}
                      >
                        <img
                          src={assets.cart_icon}
                          alt="cart"
                          className="w-4"
                        />
                        Add
                      </button>
                    ) : (
                      // In the cart: show COUNTER ( - count + )
                      <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-8.5 text-gray-800 rounded select-none">
                        <button
                          onClick={() => removeFromCart(product._id)}
                          className="cursor-pointer text-md px-2 h-full"
                        >
                          -
                        </button>
                        <span className="w-5 text-center">
                          {cartItems[product._id]}
                        </span>
                        <button
                          onClick={() => addToCart(product._id)}
                          className="cursor-pointer text-md px-2 h-full"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
