// assets = icons (star_icon, star_dull_icon, cart_icon)
import { assets } from "../assets/assets";
// Shared data and functions from your Context API
import { useAppContext } from "../context/AppContext";
import { scrollToTop } from "../utils/scroll";

const AllProducts = () => {
  // FROM CONTEXT:
  // products       = all 30 products
  // cartItems      = object of counts by product id, e.g. { gd46g23h: 2 }
  // addToCart      = adds 1 to a product's count
  // removeFromCart = removes 1 from a product's count (deletes it at 0)
  // searchQuery    = the text typed in the Navbar search box
  // navigate       = NEW: used to open the product details page
  const {
    products,
    productsLoaded,
    cartItems,
    addToCart,
    removeFromCart,
    searchQuery,
    navigate,
  } = useAppContext();

  // NEW: open the product page, e.g. /products/vegetables/gd46g23h
  const openProduct = (product) => {
    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
    scrollToTop();
  };

  // SEARCH FILTER
  // trim() removes spaces at the start/end, toLowerCase() ignores capital letters.
  const query = searchQuery.trim().toLowerCase();

  // Keep only products whose name OR category contains the typed text.
  // When the box is empty, query is "" and every product matches (shows all 30).
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query),
  );

  return (
    // Full-width wrapper (same as your other sections)
    <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 md:px-8 xl:px-12 mt-16 mb-16">
      <div className="mx-auto max-w-[1600px]">
        {/* The only header on this page */}
        <h1 className="text-2xl md:text-3xl font-medium text-gray-800">
          All Products
        </h1>

        {/* If nothing matches, show a simple message instead of the grid */}
        {!productsLoaded ? (
          <p className="mt-10 text-center text-base md:text-lg text-gray-500">
            Loading products...
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="mt-10 text-center text-base md:text-lg text-gray-500">
            No products found for "{searchQuery.trim()}"
          </p>
        ) : (
          /* GRID: 2 cards per row on phones, 3 on sm, 4 on lg, 5 on xl (same as Best Sellers) */
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
            {/* MAP METHOD: one card for each product that matches the search.
                key = product._id (unique id from assets.js) */}
            {filteredProducts.map((product) => (
              // CARD: group lets the image zoom when the whole card is hovered
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
                  {/* Category, for example "Vegetables" */}
                  <p>{product.category}</p>

                  {/* Product name, truncate = adds ... if too long.
                      NEW: click opens the product page */}
                  <p
                    className="cursor-pointer text-gray-700 font-medium text-lg truncate"
                    onClick={() => openProduct(product)}
                  >
                    {product.name}
                  </p>

                  {/* STARS: first 4 filled, 5th dull.
                      Your data has no rating, so this is fixed at 4. */}
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

                  {/* PRICE (offerPrice big, price crossed out) + ADD / COUNTER */}
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
                          {/* MINUS: lowers the count by 1. At 0, ADD comes back. */}
                          <button
                            onClick={() => removeFromCart(product._id)}
                            className="cursor-pointer text-md px-2 h-full"
                          >
                            -
                          </button>

                          {/* Current count from the cart in context */}
                          <span className="w-5 text-center">
                            {cartItems[product._id]}
                          </span>

                          {/* PLUS: raises the count by 1 */}
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

export default AllProducts;
