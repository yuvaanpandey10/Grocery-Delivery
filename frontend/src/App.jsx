import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AllProducts from "./pages/AllProducts.jsx";
import CategoryProducts from "./pages/CategoryProducts.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import AddAddress from "./pages/AddAddress.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import SellerLayout from "./pages/seller/SellerLayout.jsx";
import AddProduct from "./pages/seller/AddProduct.jsx";
import ProductList from "./pages/seller/ProductList.jsx";
import SellerOrders from "./pages/seller/SellerOrders.jsx";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const location = useLocation();
  const {
    showUserLogin,
    user,
    isAuthLoading,
    authError,
  } = useAppContext();
  const isSellerPath = location.pathname.startsWith("/seller");
  const isAuthPath =
    location.pathname === "/login" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/reset-password/");

  if (isAuthLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-600">
        Loading...
      </main>
    );
  }

  if (!isSellerPath && !isAuthPath && !user) {
    if (authError) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center text-gray-600">
          <p>{authError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded bg-primary px-6 py-2 font-medium text-white hover:bg-primary-dull"
          >
            Try again
          </button>
        </main>
      );
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (location.pathname === "/login" && user) {
    return <Navigate to={location.state?.from?.pathname || "/"} replace />;
  }

  return (
    <div>
      {!isSellerPath && !isAuthPath && <Navbar />}
      {showUserLogin && user && !isSellerPath && <Login />}
      <Toaster />
      <div
        className={
          isSellerPath || isAuthPath
            ? ""
            : "px-6 md:px-16 lg:px-24 xl:px-32"
        }
      >
        <Routes>
          <Route path="/login" element={<Login standalone />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/products/:category" element={<CategoryProducts />} />
          <Route
            path="/products/:category/:id"
            element={<ProductDetails />}
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/seller" element={<SellerLayout />}>
            <Route index element={<AddProduct key="add" />} />
            <Route
              path="edit-product/:id"
              element={<AddProduct key="edit" />}
            />
            <Route path="product-list" element={<ProductList />} />
            <Route path="orders" element={<SellerOrders />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!isSellerPath && !isAuthPath && <Footer />}
    </div>
  );
};

export default App;
