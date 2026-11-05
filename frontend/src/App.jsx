import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
// Import the All Products page
import AllProducts from "./pages/AllProducts.jsx";
// The page that shows one category
import CategoryProducts from "./pages/CategoryProducts.jsx";
// NEW: the page that shows one product with all its details
import ProductDetails from "./pages/ProductDetails.jsx";
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
          {/* NEW: e.g. /products/vegetables/gd46g23h (category + product id) */}
          <Route path="/products/:category/:id" element={<ProductDetails />} />
        </Routes>
      </div>

      {/* Footer shows at the bottom of every page, except seller pages */}
      {isSellerPath ? null : <Footer />}
    </div>
  );
};

export default App;
