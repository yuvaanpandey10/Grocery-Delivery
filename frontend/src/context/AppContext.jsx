import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// CHANGED: dummyOrders is now also imported (used to fill the admin Orders page)
import { dummyProducts, dummyOrders } from "../assets/assets";
import axios from "axios";

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

  // All addresses the user added (list of address objects)
  const [addresses, setAddresses] = useState([]);
  // The address chosen for delivery (one address object, or null)
  const [selectedAddress, setSelectedAddress] = useState(null);
  // CHANGED: orders now start with dummyOrders (you approved this)
  // so the admin Orders page is not empty. Newest first.
  const [orders, setOrders] = useState(dummyOrders);

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

  // Add a new address, then select it for delivery.
  const addAddress = (address) => {
    const newAddress = { ...address, _id: Date.now().toString() };
    setAddresses((prev) => [...prev, newAddress]);
    setSelectedAddress(newAddress);
    toast.success("Address added");
  };

  // Place an order: save it, then empty the cart.
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

  // ============================================================
  // NEW: ADMIN FUNCTIONS (used only by the /seller pages)
  // ============================================================

  // Add a product. "data" = { name, category, price, offerPrice, image[], description[] }
  // It is added at the top of the list and is in stock by default.
  const addProduct = (data) => {
    const now = new Date().toISOString();
    const newProduct = {
      ...data,
      _id: Date.now().toString(), // simple unique id (no backend yet)
      inStock: true,
      createdAt: now,
      updatedAt: now,
    };
    setProducts((prev) => [newProduct, ...prev]);
    toast.success("Product added");
  };

  // Edit a product. "changes" = only the fields that changed (also used for the stock toggle)
  const updateProduct = (id, changes, message = "Product updated") => {
    setProducts((prev) =>
      prev.map((p) =>
        p._id === id
          ? { ...p, ...changes, updatedAt: new Date().toISOString() }
          : p,
      ),
    );
    toast.success(message);
  };

  // Delete a product from the shop.
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
    toast.success("Product deleted");
  };

  // Change the status of one order (used by the status dropdown).
  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o,
      ),
    );
    toast.success("Order status updated");
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
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    orders,
    placeOrder,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    axios,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// This hook is intentionally exported alongside the provider for the existing API.
// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  return useContext(AppContext);
};
