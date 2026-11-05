import React from "react";
// useParams reads the id from the address, Link = a link that does not reload the page
import { useParams, Link } from "react-router-dom";
// assets = icons (star_icon, star_dull_icon, cart_icon)
import { assets } from "../assets/assets";
// Shared data and functions from your Context API
import { useAppContext } from "../context/AppContext";

const ProductDetails = () => {
  // 1) Read the product id from the address: /products/vegetables/gd46g23h -> id = "gd46g23h"
  const { id } = useParams();

  // FROM CONTEXT: products, cart data, cart functions, navigate
  const { products, cartItems, addToCart, removeFromCart, navigate } =
    useAppContext();

  // 2) Which thumbnail is selected (its position: 0, 1, 2, 3).
  //    We use the position, not the picture, because repeated pictures look the same.
  const [thumbnailSelection, setThumbnailSelection] = React.useState(null);
  const selectedIndex =
    thumbnailSelection?.productId === id ? thumbnailSelection.index : 0;

  // 3) Find this product by its id
  const product = products.find((p) => p._id === id);

  // If the id in the address does not exist, show a simple message
  if (!product) {
    return (
      <div className="mt-16 mb-16 text-center text-gray-500">
        Product not found
      </div>
    );
  }

  // 4) THUMBNAIL LIST (always at least 4).
  //    A product with 4+ images uses its own images.
  //    A product with fewer images repeats its first image to fill 4 thumbnails.
  const thumbnails = Array.from(
    { length: Math.max(4, product.image.length) },
    (_, i) => product.image[i] ?? product.image[0],
  );

  // Big image = the selected thumbnail
  const mainImage = thumbnails[selectedIndex] ?? thumbnails[0];

  // 5) Related products: same category, not this product, maximum 5
  const relatedProducts = products
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 5);

  // Open another product page and scroll to the top
  const openProduct = (p) => {
    navigate(`/products/${p.category.toLowerCase()}/${p._id}`);
    window.scrollTo(0, 0);
  };

  return (
    // Full-width wrapper (same as your other sections)
    <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 md:px-8 xl:px-12 mt-10 md:mt-16 mb-16">
      <div className="mx-auto max-w-[1600px]">
        {/* BREADCRUMB: Home / Products / Vegetables / Potato 500g */}
        <p className="text-sm md:text-base text-gray-700">
          <Link to="/">Home</Link> / <Link to="/products">Products</Link> /{" "}
          <Link to={`/products/${product.category.toLowerCase()}`}>
            {product.category}
          </Link>{" "}
          / <span className="text-primary">{product.name}</span>
        </p>

        {/* MAIN AREA: phone = stacked, md+ = images left, details right */}
        <div className="mt-6 flex flex-col md:flex-row gap-8 lg:gap-16">
          {/* ---------- LEFT: THUMBNAILS + BIG IMAGE ----------
              flex-col-reverse on phone = big image on top, thumbnails below. */}
          <div className="flex flex-col-reverse md:flex-row md:items-start gap-3">
            {/* THUMBNAILS (MAP METHOD): one button for each item in the thumbnail list.
                Click saves the position (index) of the thumbnail. */}
            <div className="flex md:flex-col gap-3">
              {thumbnails.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setThumbnailSelection({ productId: id, index })
                  }
                  className={`w-16 h-16 md:w-20 md:h-20 cursor-pointer rounded border p-2 bg-white ${
                    index === selectedIndex
                      ? "border-primary"
                      : "border-gray-500/30"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>

            {/* BIG IMAGE: fixed height, picture centered inside the box */}
            <div className="flex h-80 md:h-105 items-center justify-center rounded border border-gray-500/30 bg-white p-4 md:w-80 lg:w-96">
              <img
                src={mainImage}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          {/* ---------- RIGHT: PRODUCT DETAILS ---------- */}
          <div className="w-full md:max-w-md text-sm">
            <h1 className="text-2xl md:text-3xl font-medium text-gray-800">
              {product.name}
            </h1>

            {/* STARS: fixed at 4 (your data has no rating) */}
            <div className="mt-2 flex items-center gap-0.5">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <img
                    key={i}
                    className="w-3.5 md:w-4"
                    src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                    alt="star"
                  />
                ))}
              <p className="ml-2 text-base text-gray-500">(4)</p>
            </div>

            {/* PRICE: original price crossed out, offer price big */}
            <div className="mt-6">
              <p className="text-gray-500/70 line-through">
                MRP: ${product.price}
              </p>
              <p className="text-2xl font-medium text-gray-800">
                MRP: ${product.offerPrice}
              </p>
              <span className="text-gray-500/70">(inclusive of all taxes)</span>
            </div>

            {/* ABOUT PRODUCT: product.description is an array (MAP METHOD) */}
            <p className="mt-6 text-base font-medium text-gray-800">
              About Product
            </p>
            <ul className="mt-1 list-disc ml-4 text-gray-500/70">
              {product.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>

            {/* BUTTONS: Add to Cart (turns into a counter) + Buy now */}
            <div className="mt-10 flex items-center gap-4 text-base">
              <div className="flex-1">
                {/* Not in the cart: show Add to Cart button */}
                {!cartItems[product._id] ? (
                  <button
                    type="button"
                    onClick={() => addToCart(product._id)}
                    className="w-full cursor-pointer bg-gray-100 py-3.5 font-medium text-gray-800/80 transition hover:bg-gray-200"
                  >
                    Add to Cart
                  </button>
                ) : (
                  // In the cart: show COUNTER ( - count + )
                  <div className="flex w-full items-center justify-center gap-6 bg-gray-100 py-3.5 font-medium text-gray-800 select-none">
                    <button
                      type="button"
                      onClick={() => removeFromCart(product._id)}
                      className="cursor-pointer px-3 text-xl leading-none"
                    >
                      -
                    </button>
                    <span className="w-6 text-center">
                      {cartItems[product._id]}
                    </span>
                    <button
                      type="button"
                      onClick={() => addToCart(product._id)}
                      className="cursor-pointer px-3 text-xl leading-none"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {/* NEW: Buy now opens the cart page (/cart) and scrolls to the top.
                  It does not add the product to the cart. */}
              <button
                type="button"
                onClick={() => {
                  navigate("/cart");
                  window.scrollTo(0, 0);
                }}
                className="flex-1 cursor-pointer bg-primary py-3.5 font-medium text-white transition hover:bg-primary-dull"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>

        {/* ---------- RELATED PRODUCTS ---------- */}
        <div className="mt-20 flex flex-col items-center">
          <p className="text-2xl md:text-3xl font-medium text-gray-800">
            Related Products
          </p>
          {/* Short green line under the title */}
          <div className="mt-2 h-0.5 w-24 rounded-full bg-primary"></div>
        </div>

        {/* GRID: 2 cards per row on phones, 3 on sm, 4 on lg, 5 on xl */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {/* MAP METHOD: one card for each related product */}
          {relatedProducts.map((item) => (
            <div
              key={item._id}
              className="group border border-gray-500/20 rounded-md px-3 md:px-4 py-3 bg-white"
            >
              {/* IMAGE: click opens this product's page */}
              <div
                className="cursor-pointer flex items-center justify-center"
                onClick={() => openProduct(item)}
              >
                <img
                  src={item.image[0]}
                  alt={item.name}
                  className="group-hover:scale-105 transition max-h-28 md:max-h-32 object-contain"
                />
              </div>

              <div className="mt-4 text-gray-500/60 text-sm">
                <p>{item.category}</p>

                {/* NAME: click opens this product's page */}
                <p
                  className="cursor-pointer text-gray-700 font-medium text-lg truncate"
                  onClick={() => openProduct(item)}
                >
                  {item.name}
                </p>

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

                <div className="flex items-end justify-between mt-3 gap-2">
                  <p className="md:text-xl text-base font-medium text-primary">
                    ${item.offerPrice}{" "}
                    <span className="text-gray-500/60 md:text-sm text-xs line-through">
                      ${item.price}
                    </span>
                  </p>

                  <div className="text-primary">
                    {!cartItems[item._id] ? (
                      <button
                        className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-20 w-16 h-8.5 rounded cursor-pointer"
                        onClick={() => addToCart(item._id)}
                      >
                        <img
                          src={assets.cart_icon}
                          alt="cart"
                          className="w-4"
                        />
                        Add
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-8.5 text-gray-800 rounded select-none">
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="cursor-pointer text-md px-2 h-full"
                        >
                          -
                        </button>
                        <span className="w-5 text-center">
                          {cartItems[item._id]}
                        </span>
                        <button
                          onClick={() => addToCart(item._id)}
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

        {/* SHOW MORE BUTTON
            Opens the All Products page (/products) and scrolls to the top. */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => {
              navigate("/products");
              window.scrollTo(0, 0);
            }}
            className="cursor-pointer rounded border border-primary/40 bg-primary/10 px-12 py-2.5 font-medium text-primary transition hover:bg-primary/20"
          >
            Show more
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
