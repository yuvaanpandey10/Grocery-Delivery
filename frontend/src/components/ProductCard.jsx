// useState = stores this card's count
import { useState } from "react";
// assets = icons (star_icon, star_dull_icon, cart_icon)
import { assets } from "../assets/assets";

// "product" comes from BestSellers as a prop (one item of products)
const ProductCard = ({ product }) => {
  // COUNT of this card only. 0 = show the Add button, 1+ = show the counter.
  // Each card has its own useState, so cards do not affect each other.
  const [count, setCount] = useState(0);

  return (
    // CARD: group lets the image zoom when the whole card is hovered
    <div className="group border border-gray-500/20 rounded-md px-3 md:px-4 py-3 bg-white">
      {/* IMAGE: product.image is an array, [0] = first image */}
      <div className="cursor-pointer flex items-center justify-center">
        <img
          src={product.image[0]}
          alt={product.name}
          className="group-hover:scale-105 transition max-h-28 md:max-h-32 object-contain"
        />
      </div>

      <div className="mt-4 text-gray-500/60 text-sm">
        {/* Category, for example "Vegetables" */}
        <p>{product.category}</p>

        {/* Product name, truncate = adds ... if too long */}
        <p className="text-gray-700 font-medium text-lg truncate">
          {product.name}
        </p>

        {/* STARS: 5 stars, the first 4 filled, the 5th dull.
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
            {/* count is 0: show ADD button, click sets count to 1 */}
            {count === 0 ? (
              <button
                className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-20 w-16 h-8.5 rounded cursor-pointer"
                onClick={() => setCount(1)}
              >
                <img src={assets.cart_icon} alt="cart" className="w-4" />
                Add
              </button>
            ) : (
              // count is 1 or more: show COUNTER ( - count + )
              <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-8.5 text-gray-800 rounded select-none">
                {/* MINUS: never below 0 (at 0 the Add button comes back) */}
                <button
                  onClick={() => setCount((prev) => Math.max(prev - 1, 0))}
                  className="cursor-pointer text-md px-2 h-full"
                >
                  -
                </button>
                <span className="w-5 text-center">{count}</span>
                {/* PLUS: count + 1 */}
                <button
                  onClick={() => setCount((prev) => prev + 1)}
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
  );
};

export default ProductCard;
