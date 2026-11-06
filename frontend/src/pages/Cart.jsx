import { useState, useEffect, useRef } from "react";
// toast is used here only for error messages (the success toasts are in the context)
import toast from "react-hot-toast";
// assets = icons (remove_icon = red X, arrow_right_icon_colored = arrow)
import { assets } from "../assets/assets";
// Shared data and functions from your Context API
import { useAppContext } from "../context/AppContext";
import { scrollToTop } from "../utils/scroll";

const Cart = () => {
  // FROM CONTEXT:
  // products         = all products
  // cartItems        = object of counts by product id, e.g. { gd46g23h: 2 }
  // setCartItems     = used to delete a whole product from the cart (X button)
  // updateCartItem   = sets a product's quantity directly (Qty dropdown)
  // navigate         = used for page changes
  // user = to require sign-in before ordering
  // addresses, selectedAddress, setSelectedAddress = delivery address
  // placeOrder       = saves the order and empties the cart
  const {
    products,
    cartItems,
    setCartItems,
    updateCartItem,
    navigate,
    user,
    addresses,
    selectedAddress,
    setSelectedAddress,
    placeOrder,
  } = useAppContext();

  // ---------- LOCAL STATE (only used on this page) ----------
  // Is the address list (under "Change") open?
  const [showAddressList, setShowAddressList] = useState(false);
  // Ref on the address area, to detect clicks outside of it
  const addressRef = useRef(null);

  // ---------- EFFECT: close the address list with Escape or an outside click ----------
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowAddressList(false);
    };
    const onClick = (e) => {
      if (addressRef.current && !addressRef.current.contains(e.target)) {
        setShowAddressList(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    // CLEANUP
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  // 1) BUILD THE CART LIST
  // cartItems only has ids and counts, so we find the full product for each id
  // and add the count as "quantity".
  // filter(Boolean) removes ids whose product no longer exists.
  const cartList = Object.keys(cartItems)
    .map((id) => {
      const product = products.find((p) => p._id === id);
      return product ? { ...product, quantity: cartItems[id] } : null;
    })
    .filter(Boolean);

  // 2) TOTALS
  // Total items: 2 potatoes + 1 tomato = 3
  const totalItems = cartList.reduce((sum, item) => sum + item.quantity, 0);
  // Price: offerPrice x quantity for every product
  const price = cartList.reduce(
    (sum, item) => sum + item.offerPrice * item.quantity,
    0,
  );
  // Tax is 2% of the price (like your reference photo)
  const tax = price * 0.02;
  const totalAmount = price + tax;

  // 3) REMOVE A WHOLE PRODUCT (red X button)
  // Copies the cart object, deletes this id, saves the new object.
  const removeProduct = (id) => {
    setCartItems((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // 4) GO TO ALL PRODUCTS and scroll to the top
  const continueShopping = () => {
    navigate("/products");
    scrollToTop();
  };

  // 5) NEW: GO TO THE ADD ADDRESS PAGE and scroll to the top
  const goToAddAddress = () => {
    setShowAddressList(false);
    navigate("/add-address");
    scrollToTop();
  };

  const orderButtonText = selectedAddress ? "Place Order" : "Add Address";

  // 7) ORDER BUTTON CLICK
  const handleOrderButton = async () => {
    // Addresses and orders are tied to the authenticated account.
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/cart" } } });
      return;
    }
    // No address: open the Add Address page
    if (!selectedAddress) {
      goToAddAddress();
      return;
    }
    const items = cartList.map((item) => ({
      product: products.find((p) => p._id === item._id),
      quantity: item.quantity,
    }));
    try {
      await placeOrder({ items, address: selectedAddress });
      navigate("/my-orders");
      scrollToTop();
    } catch (error) {
      console.error("Unable to place order:", error);
      toast.error(
        error.response?.data?.message || error.message || "Unable to place order",
      );
    }
  };

  // ---------- EMPTY CART ----------
  if (cartList.length === 0) {
    return (
      <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 md:px-8 xl:px-12 mt-16 mb-16">
        <div className="mx-auto max-w-[1600px] flex flex-col items-center text-center">
          <h1 className="text-2xl md:text-3xl font-medium text-gray-800">
            Your cart is empty
          </h1>
          <button
            type="button"
            onClick={continueShopping}
            className="mt-6 cursor-pointer rounded bg-primary px-10 py-3 font-medium text-white transition hover:bg-primary-dull"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    // Full-width wrapper (same as your other sections)
    <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 md:px-8 xl:px-12 mt-16 mb-16">
      <div className="mx-auto max-w-[1600px]">
        {/* phone = stacked, lg+ = cart list left, Order Summary right */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* ================= LEFT: CART LIST ================= */}
          <div className="min-w-0 flex-1">
            {/* TITLE + item count (total items, e.g. "5 Items") */}
            <h1 className="text-2xl md:text-3xl font-medium text-gray-800">
              Shopping Cart{" "}
              <span className="text-sm text-primary">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </span>
            </h1>

            {/* COLUMN HEADERS: same 3-column grid as the rows below */}
            <div className="mt-8 grid grid-cols-[2fr_1fr_1fr] pb-3 text-sm md:text-base font-medium text-gray-500">
              <p className="text-left">Product Details</p>
              <p className="text-center">Subtotal</p>
              <p className="text-center">Action</p>
            </div>

            {/* MAP METHOD: one row for each product in the cart */}
            {cartList.map((item) => (
              <div
                key={item._id}
                className="grid grid-cols-[2fr_1fr_1fr] items-center pt-3 text-sm md:text-base text-gray-500"
              >
                {/* COLUMN 1: image + name + weight + Qty dropdown */}
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="flex h-20 w-20 md:h-24 md:w-24 shrink-0 items-center justify-center rounded border border-gray-300 bg-white p-1">
                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-700 md:text-lg">
                      {item.name}
                    </p>
                    {/* Your products have no weight field, so this is fixed text */}
                    <p className="text-sm">Weight: N/A</p>
                    {/* QTY DROPDOWN: 1 to 10 (shows more only if the cart already has more) */}
                    <div className="flex items-center text-sm">
                      <p>Qty:</p>
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartItem(item._id, Number(e.target.value))
                        }
                        className="cursor-pointer bg-transparent outline-none"
                      >
                        {/* MAP METHOD: one <option> for each number */}
                        {Array.from(
                          { length: Math.max(10, item.quantity) },
                          (_, i) => i + 1,
                        ).map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: subtotal = offerPrice x quantity */}
                <p className="text-center font-medium text-gray-700">
                  ${item.offerPrice * item.quantity}
                </p>

                {/* COLUMN 3: red X removes the whole product */}
                <button
                  type="button"
                  onClick={() => removeProduct(item._id)}
                  aria-label={`Remove ${item.name}`}
                  className="mx-auto cursor-pointer"
                >
                  <img src={assets.remove_icon} alt="" className="w-6 h-6" />
                </button>
              </div>
            ))}

            {/* CONTINUE SHOPPING (arrow points left, so we rotate the icon) */}
            <button
              type="button"
              onClick={continueShopping}
              className="group mt-8 flex cursor-pointer items-center gap-2 font-medium text-primary"
            >
              <img
                src={assets.arrow_right_icon_colored}
                alt=""
                className="rotate-180 transition group-hover:-translate-x-1"
              />
              Continue Shopping
            </button>
          </div>

          {/* ================= RIGHT: ORDER SUMMARY ================= */}
          <div className="h-fit w-full lg:max-w-[360px] bg-gray-100 p-5">
            <h2 className="text-xl md:text-2xl font-medium text-gray-700">
              Order Summary
            </h2>
            <hr className="my-5 border-gray-300" />

            {/* DELIVERY ADDRESS.
                addressRef wraps the row + the list, to detect outside clicks. */}
            <p className="text-sm font-medium uppercase text-gray-700">
              Delivery Address
            </p>
            <div ref={addressRef} className="relative mt-2">
              <div className="flex items-start justify-between gap-3">
                {/* Selected address, or a message when there is none */}
                <p className="text-sm text-gray-500">
                  {selectedAddress
                    ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                    : "No address found"}
                </p>
                {/* CHANGE: opens / closes the address list */}
                <button
                  type="button"
                  onClick={() => setShowAddressList((v) => !v)}
                  className="cursor-pointer text-sm text-primary hover:underline"
                >
                  Change
                </button>
              </div>

              {/* ADDRESS LIST (opens under the address line) */}
              {showAddressList && (
                <div className="absolute left-0 right-0 top-full z-10 mt-2 border border-gray-300 bg-white py-1 shadow-lg">
                  {/* MAP METHOD: one button for each saved address.
                      Click = use this address for delivery. */}
                  {addresses.map((addr) => (
                    <button
                      key={addr._id}
                      type="button"
                      onClick={() => {
                        setSelectedAddress(addr);
                        setShowAddressList(false);
                      }}
                      className={`block w-full cursor-pointer px-4 py-2.5 text-left text-sm text-gray-500 transition-colors hover:bg-primary/10 ${
                        selectedAddress?._id === addr._id ? "bg-primary/10" : ""
                      }`}
                    >
                      <span className="block font-medium text-gray-700">
                        {addr.firstName} {addr.lastName}
                      </span>
                      {addr.street}, {addr.city}, {addr.state}, {addr.country}
                    </button>
                  ))}

                  {/* ADD ADDRESS: opens the Add Address page */}
                  <div className="px-3 py-2">
                    <button
                      type="button"
                      onClick={goToAddAddress}
                      className="w-full cursor-pointer rounded border border-primary/40 bg-primary/10 py-2 text-sm font-medium text-primary transition hover:bg-primary/20"
                    >
                      + Add address
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Online payments are not available in the backend yet. */}
            <p className="mt-6 text-sm font-medium uppercase text-gray-700">
              Payment Method
            </p>
            <p className="mt-2 w-full border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700">
              Cash On Delivery
            </p>

            <hr className="my-5 border-gray-300" />

            {/* PRICE LINES */}
            <div className="space-y-2 text-sm text-gray-500">
              <p className="flex justify-between">
                <span>Price</span>
                <span>${price}</span>
              </p>
              <p className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-primary">Free</span>
              </p>
              <p className="flex justify-between">
                <span>Tax (2%)</span>
                <span>${tax.toFixed(2)}</span>
              </p>
              <p className="flex justify-between pt-2 text-base font-medium text-gray-800">
                <span>Total Amount:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </p>
            </div>

            {/* ORDER BUTTON: the text changes (see orderButtonText above) */}
            <button
              type="button"
              onClick={handleOrderButton}
              className="mt-6 w-full cursor-pointer bg-primary py-3 font-medium text-white transition hover:bg-primary-dull"
            >
              {orderButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
