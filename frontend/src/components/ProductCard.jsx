// assets = icons (star_icon, star_dull_icon, cart_icon)
import { assets } from "../assets/assets";
// useAppContext = gives us the data and functions from AppContext.jsx
import { useAppContext } from "../context/AppContext";

const ProductCard = () => {
  // FROM CONTEXT:
  // products       = product list
  // cartItems      = object of counts by product id, e.g. { gd46g23h: 2 }
  // addToCart      = adds 1 to a product's count
  // removeFromCart = removes 1 from a product's count (deletes it at 0)
  // navigate       = NEW: used to open the product details page
  const { products, cartItems, addToCart, removeFromCart, navigate } =
    useAppContext();

  // NEW: open the product page, e.g. /products/vegetables/gd46g23h
  const openProduct = (product) => {
    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {/* SECTION TITLE */}
      <h2 className="text-2xl md:text-3xl font-medium text-gray-800">
        Best Sellers
      </h2>

      {/* GRID: 2 cards per row on phones, 3 on sm, 4 on lg, 5 on xl */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
        {/* MAP METHOD: slice(0, 5) = first 5 products, one card for each.
            key = product._id (unique id from assets.js) */}
        {products.slice(0, 5).map((product) => (
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
                  {/* cartItems[product._id] is undefined when the product is
                      not in the cart, so !undefined = true -> show ADD button */}
                  {!cartItems[product._id] ? (
                    <button
                      className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-20 w-16 h-8.5 rounded cursor-pointer"
                      // addToCart (from context) sets the count to 1
                      onClick={() => addToCart(product._id)}
                    >
                      <img src={assets.cart_icon} alt="cart" className="w-4" />
                      Add
                    </button>
                  ) : (
                    // Product is in the cart: show COUNTER ( - count + )
                    <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-8.5 text-gray-800 rounded select-none">
                      {/* MINUS: removeFromCart lowers the count by 1.
                          At 0 the product is deleted and ADD comes back. */}
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

                      {/* PLUS: addToCart raises the count by 1 */}
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
    </>
  );
};

export default ProductCard;
