import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
// Import the All Products page
import AllProducts from "./pages/AllProducts.jsx";
// The page that shows one category
import CategoryProducts from "./pages/CategoryProducts.jsx";
// The page that shows one product with all its details
import ProductDetails from "./pages/ProductDetails.jsx";
// The Cart page
import Cart from "./pages/Cart.jsx";
// The page with the form to add a delivery address
import AddAddress from "./pages/AddAddress.jsx";
// NEW: the page that lists the user's orders
import MyOrders from "./pages/MyOrders.jsx";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login.jsx";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const isSellerPath = useLocation().pathname.includes("/seller");
  const { showUserLogin } = useAppContext();

  return (
    <div>
      {isSellerPath ? null : <Navbar />}

      {/* Login popup: shows only when showUserLogin is true */}
      {showUserLogin ? <Login /> : null}

      <Toaster />
      <div
        className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          {/* The Navbar "All Products" link goes here */}
          <Route path="/products" element={<AllProducts />} />
          {/* :category is the word from assets.js "path", e.g. /products/fruits */}
          <Route path="/products/:category" element={<CategoryProducts />} />
          {/* e.g. /products/vegetables/gd46g23h (category + product id) */}
          <Route path="/products/:category/:id" element={<ProductDetails />} />
          {/* The Navbar cart button and "Buy now" go here */}
          <Route path="/cart" element={<Cart />} />
          {/* "Add address" in the cart goes here */}
          <Route path="/add-address" element={<AddAddress />} />
          {/* NEW: Navbar profile menu "My Orders" goes here */}
          <Route path="/my-orders" element={<MyOrders />} />
        </Routes>
      </div>

      {/* Footer shows at the bottom of every page, except seller pages */}
      {isSellerPath ? null : <Footer />}
    </div>
  );
};

export default App;
