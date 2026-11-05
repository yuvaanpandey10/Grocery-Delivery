import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login.jsx";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const isSellerPath = useLocation().pathname.includes("/seller");
  const { showUserLogin } = useAppContext();

  return (
    <div>
      {isSellerPath ? null : <Navbar />}

      {/* Login popup: shows only when showUserLogin is true (this line was missing) */}
      {showUserLogin ? <Login /> : null}

      <Toaster />
      <div
        className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>

      {/* Footer shows at the bottom of every page, except seller pages */}
      {isSellerPath ? null : <Footer />}
    </div>
  );
};

export default App;
