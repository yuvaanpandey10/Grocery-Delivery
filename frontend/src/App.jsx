import Navbar from "./components/Navbar.jsx";
// Import the Footer
import Footer from "./components/Footer.jsx";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { Toaster } from "react-hot-toast";

const App = () => {
  const isSellerPath = useLocation().pathname.includes("/seller");

  return (
    <div>
      {isSellerPath ? null : <Navbar />}

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
