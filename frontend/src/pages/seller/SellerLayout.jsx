import { NavLink, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import SellerLogin from "./SellerLogin";

// ============================================================
// SIDEBAR LINKS (edit this list to add / rename menu items)
// "end: true" makes /seller active only on that exact path
// ============================================================
const sidebarLinks = [
  { name: "Add Product", path: "/seller", icon: assets.add_icon, end: true },
  {
    name: "Product List",
    path: "/seller/product-list",
    icon: assets.product_list_icon,
    end: false,
  },
  {
    name: "Orders",
    path: "/seller/orders",
    icon: assets.order_icon,
    end: false,
  },
];

const SellerLayout = () => {
  const { isSeller, setIsSeller, setSellerOrders, navigate, axios } =
    useAppContext();

  // Not logged in as admin: show only the admin login form
  if (!isSeller) return <SellerLogin />;

  // Logout: leave admin mode, then go back to the admin login
  const logout = async () => {
    try {
      const { data } = await axios.get("/api/seller/logout");
      if (!data.success) throw new Error(data.message || "Unable to log out");
      setIsSeller(false);
      setSellerOrders([]);
      navigate("/seller");
    } catch (error) {
      console.error("Unable to log out seller:", error);
      toast.error(
        error.response?.data?.message || error.message || "Unable to log out",
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-700">
      {/* ---------- TOP BAR: logo, greeting, logout ---------- */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:px-8">
        <NavLink to="/" aria-label="Back to shop">
          <img src={assets.logo} alt="logo" className="h-8 w-auto md:h-10" />
        </NavLink>
        <div className="flex items-center gap-3 text-sm md:gap-5 md:text-base">
          <p className="hidden sm:block">Hi! Admin</p>
          <button
            type="button"
            onClick={logout}
            className="cursor-pointer rounded-full border border-gray-300 px-4 py-1.5 transition hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ---------- BODY: menu + page ---------- */}
      {/* Phone: menu on top (column). Tablet/desktop: menu on the left (row) */}
      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="border-b border-gray-200 bg-white md:w-56 md:border-b-0 md:border-r lg:w-64">
          {/* Phone: horizontal scroll row. Tablet+: vertical list */}
          <nav className="flex gap-1 overflow-x-auto p-2 md:flex-col md:overflow-visible md:pt-6">
            {sidebarLinks.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 rounded-lg border-l-4 px-4 py-3 text-sm transition-colors md:text-base ${
                    isActive
                      ? "border-primary bg-primary/10 text-gray-900"
                      : "border-transparent text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <img src={item.icon} alt="" className="h-6 w-6" />
                <span className="whitespace-nowrap">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* The selected page (Add Product, Product List or Orders) appears here */}
        <main className="min-w-0 flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
