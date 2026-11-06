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
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
} from "motion/react";
import Login from "./components/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Contact from "./pages/Contact.jsx";
import { useAppContext } from "./context/AppContext";
import SmoothScroll from "./components/SmoothScroll.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";

const App = () => {
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const { user, isAuthLoading } = useAppContext();
  const isSellerPath = location.pathname.startsWith("/seller");
  const isAuthPath =
    location.pathname === "/login" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/reset-password/");

  const requireUser = (page) =>
    user ? page : <Navigate to="/login" state={{ from: location }} replace />;

  if (isAuthLoading) {
    return <LoadingScreen />;
  }

  if (location.pathname === "/login" && user) {
    return <Navigate to={location.state?.from?.pathname || "/"} replace />;
  }

  return (
    <div>
      <SmoothScroll />
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-x-0 top-0 z-[100] h-1 origin-left bg-primary"
          style={{ scaleX: scrollYProgress }}
        />
      )}
      {!isSellerPath && !isAuthPath && <Navbar />}
      <Toaster />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={
            isSellerPath || isAuthPath
              ? ""
              : "px-6 md:px-16 lg:px-24 xl:px-32"
          }
        >
          <Routes location={location}>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/" element={<Home />} />
            <Route path="/products" element={requireUser(<AllProducts />)} />
            <Route
              path="/products/:category"
              element={requireUser(<CategoryProducts />)}
            />
            <Route
              path="/products/:category/:id"
              element={requireUser(<ProductDetails />)}
            />
            <Route path="/cart" element={requireUser(<Cart />)} />
            <Route path="/add-address" element={requireUser(<AddAddress />)} />
            <Route path="/my-orders" element={requireUser(<MyOrders />)} />
            <Route path="/contact" element={requireUser(<Contact />)} />
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
        </motion.div>
      </AnimatePresence>
      {!isSellerPath && !isAuthPath && <Footer />}
    </div>
  );
};

export default App;
