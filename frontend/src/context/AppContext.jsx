import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { dummyProducts } from "../assets/assets";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState(dummyProducts);
  const [cartItems, setCartItems] = useState({});

  // The text typed in the search box (shared by Navbar and AllProducts)
  const [searchQuery, setSearchQuery] = useState("");

  // NEW: all addresses the user added (list of address objects)
  const [addresses, setAddresses] = useState([]);
  // NEW: the address chosen for delivery (one address object, or null)
  const [selectedAddress, setSelectedAddress] = useState(null);
  // NEW: all placed orders (newest first). Your My Orders page can read this later.
  const [orders, setOrders] = useState([]);

  // Fetch All Products
  const fetchProducts = async () => {
    setProducts(dummyProducts);
  };

  // Add to Cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
    toast.success("Item added to cart");
  };

  // Update Cart Item Quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart updated");
  };

  // Remove Product form cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    setCartItems(cartData);
    toast.success("Removed from Cart");
  };

  // NEW: Add a new address, then select it for delivery.
  // Date.now() gives a simple unique id (no backend yet).
  const addAddress = (address) => {
    const newAddress = { ...address, _id: Date.now().toString() };
    setAddresses((prev) => [...prev, newAddress]);
    setSelectedAddress(newAddress);
    toast.success("Address added");
  };

  // NEW: Place an order: save it, then empty the cart.
  // The order has the same shape as your dummyOrders in assets.js.
  const placeOrder = ({ items, amount, address, paymentType }) => {
    const newOrder = {
      _id: Date.now().toString(),
      userId: user?._id ?? null, // I could not check the shape of "user"
      items,
      amount,
      address,
      status: "Order Placed",
      paymentType, // "COD" or "Online"
      // PLACEHOLDER: no real payment gateway yet, so "Online" is marked as paid.
      isPaid: paymentType === "Online",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems({});
    toast.success("Order placed successfully");
  };

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    setProducts,
    fetchProducts,
    cartItems,
    setCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    addresses, // NEW
    selectedAddress, // NEW
    setSelectedAddress, // NEW
    addAddress, // NEW
    orders, // NEW
    placeOrder, // NEW
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// This hook is intentionally exported alongside the provider for the existing API.
// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  return useContext(AppContext);
};
