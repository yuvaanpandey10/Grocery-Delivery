// ============================================================
// IMPORTS
// ============================================================
import React from "react";
import toast from "react-hot-toast";
// useLocation tells us which page we are on (to know if we must go to /products)
import { NavLink, useLocation } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
// Your images (logo, cart icon, profile icon, ...)
import { assets } from "../assets/assets";
// Shared data from your app: the logged-in user, login popup, navigate(), search text
import { useAppContext } from "../context/AppContext";

// ============================================================
// REUSABLE TAILWIND CLASS STRINGS
// ============================================================

// Green outline shown when you navigate with the keyboard (Tab key).
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

// Style for the desktop menu links (Home, All Products, Contact).
const desktopLink = ({ isActive }) =>
  `block rounded-lg px-4 py-2 text-[15px] font-medium transition-colors lg:px-5 lg:py-2.5 lg:text-base ${focusRing} ${
    isActive
      ? "bg-primary/15 text-gray-900" // current page: soft green background
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900" // other pages
  }`;

// Style for the links inside the phone menu: bigger text, easy to tap.
const mobileLink = ({ isActive }) =>
  `block rounded-xl px-4 py-3.5 text-lg font-medium transition-colors ${focusRing} ${
    isActive
      ? "bg-primary/15 text-gray-900"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
  }`;

// Style for round icon buttons (cart, hamburger).
const iconButton = `relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 ${focusRing}`;

// Style for the search pill (used on desktop AND inside the phone menu).
const searchBox =
  "flex items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-4 text-gray-500 transition focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/30";

// Style shared by every Login / Logout button.
const loginBtn = `cursor-pointer items-center justify-center rounded-full bg-primary font-semibold text-gray-900 transition-colors hover:bg-primary-dull ${focusRing}`;

// ============================================================
// SMALL COMPONENT: SearchIcon
// ============================================================
const SearchIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" /> {/* the lens */}
    <path d="m20 20-3.5-3.5" /> {/* the handle */}
  </svg>
);

// ============================================================
// MAIN COMPONENT: Navbar
// ============================================================
const Navbar = () => {
  // ---------- STATE ----------
  // Is the phone menu open?
  const [open, setOpen] = React.useState(false);
  // Is the profile dropdown (My Orders / Logout) open?
  const [profileOpen, setProfileOpen] = React.useState(false);

  // ---------- REFS ----------
  const profileRef = React.useRef(null);

  // ---------- SHARED APP DATA ----------
  // searchQuery + setSearchQuery come from AppContext (no local state)
  // NEW: cartItems also comes from AppContext (used for the cart badge)
  const {
    user,
    setUser,
    setCartItems,
    setAddresses,
    setOrders,
    setSelectedAddress,
    axios,
    navigate,
    searchQuery,
    setSearchQuery,
    cartItems,
  } = useAppContext();

  // The current URL path, e.g. "/" or "/products"
  const location = useLocation();
  const { pathname } = location;

  // NEW: REAL CART COUNT = total items in the cart.
  // cartItems looks like { gd46g23h: 2, gd47g34h: 1 }, so we add up the counts:
  // 2 + 1 = 3. It updates by itself every time the cart changes.
  const cartCount = Object.values(cartItems).reduce(
    (sum, quantity) => sum + quantity,
    0,
  );

  // ---------- SEARCH ----------
  // Runs on every key typed (live search), in BOTH search boxes.
  // 1) save the text in the context  2) if we are not on /products, go there.
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (pathname !== "/products") navigate("/products");
  };

  // ---------- LOGOUT ----------
  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (!data.success) throw new Error(data.message || "Unable to log out");
      setProfileOpen(false);
      setOpen(false);
      setUser(null);
      setCartItems({});
      setAddresses([]);
      setOrders([]);
      setSelectedAddress(null);
      navigate("/");
    } catch (error) {
      console.error("Unable to log out:", error);
      toast.error(
        error.response?.data?.message || error.message || "Unable to log out",
      );
    }
  };

  // ---------- EFFECT: global event listeners ----------
  React.useEffect(() => {
    // Pressing Escape closes the phone menu and the profile dropdown
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setProfileOpen(false);
      }
    };

    // Clicking anywhere outside the profile dropdown closes it
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    // If the window becomes wide (768px+), close the phone menu.
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    window.addEventListener("resize", onResize);

    // CLEANUP
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // ============================================================
  // JSX: what the component draws
  // ============================================================
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <Dialog.Root open={open} onOpenChange={setOpen}>
      <nav
        aria-label="Main"
        className="mx-auto grid h-18 max-w-screen-2xl grid-cols-[1fr_auto] items-center gap-4 px-5 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:h-20 lg:px-10 xl:px-16"
      >
        {/* ---------- BLOCK 1: LOGO ---------- */}
        <NavLink
          to="/"
          onClick={() => setOpen(false)}
          className={`w-fit rounded-lg ${focusRing}`}
          aria-label="Home"
        >
          <img src={assets.logo} alt="logo" className="h-8 w-auto lg:h-11" />
        </NavLink>

        {/* ---------- BLOCK 2: DESKTOP LINKS ---------- */}
        <ul className="hidden items-center gap-1 md:flex lg:gap-2">
          <li>
            <NavLink to="/" end className={desktopLink}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className={desktopLink}>
              All Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={desktopLink}>
              Contact
            </NavLink>
          </li>
          {/* NEW: Admin link (desktop). Opens the admin login / dashboard */}
          <li>
            <NavLink to="/seller" className={desktopLink}>
              Admin
            </NavLink>
          </li>
        </ul>

        {/* ---------- BLOCK 3: ACTIONS (right side) ---------- */}
        <div className="flex items-center justify-self-end gap-1 sm:gap-2 lg:gap-3">
          {/* --- 3a. Desktop search box (large screens only: "hidden lg:flex") --- */}
          <form
            role="search"
            onSubmit={(e) => e.preventDefault()} // stop the page from reloading on Enter
            className={`hidden h-11 w-64 lg:flex xl:w-80 ${searchBox}`}
          >
            <SearchIcon />
            <input
              type="search"
              aria-label="Search products"
              placeholder="Search products"
              value={searchQuery} // input shows the text saved in the context
              onChange={handleSearch} // live search on every key
              className="min-w-0 flex-1 bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-gray-500"
            />
          </form>

          {/* --- 3b. Cart button (the badge shows the real cart count) --- */}
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className={iconButton}
            aria-label={`Cart, ${cartCount} items`}
          >
            <img src={assets.nav_cart_icon} alt="" className="w-7 opacity-80" />
            {/* Badge: only shown when the cart has at least 1 item */}
            {cartCount > 0 && (
              <span className="absolute right-0 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold leading-none text-gray-900">
                {cartCount}
              </span>
            )}
          </button>

          {/* --- 3c. Login button OR profile menu (tablet and up) --- */}
          {!user ? (
            <button
              type="button"
              onClick={() => navigate("/login", { state: { from: location } })}
              className={`ml-1 hidden h-11 px-6 text-sm md:inline-flex lg:px-8 lg:text-[15px] ${loginBtn}`}
            >
              Login
            </button>
          ) : (
            <div ref={profileRef} className="relative hidden md:block">
              <button
                type="button"
                aria-label="Open account menu"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((v) => !v)}
                className={`block cursor-pointer rounded-full ${focusRing}`}
              >
                <img
                  src={assets.profile_icon}
                  alt=""
                  className="w-10 lg:w-11"
                />
              </button>

              {profileOpen && (
                <ul
                  role="menu"
                  className="absolute right-0 top-full z-10 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg"
                >
                  <li role="none">
                    <button
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/my-orders");
                      }}
                      className="block w-full cursor-pointer px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-primary/10"
                    >
                      My Orders
                    </button>
                  </li>
                  <li role="none">
                    <button
                      role="menuitem"
                      type="button"
                      onClick={logout}
                      className="block w-full cursor-pointer px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-primary/10"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}

          {/* --- 3d. Hamburger button (phones only: "md:hidden") --- */}
          <Dialog.Trigger asChild>
            <button
              type="button"
              className={`${iconButton} md:hidden`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <svg
                width="32"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </Dialog.Trigger>
        </div>
      </nav>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-gray-950/20 md:hidden" />
        <Dialog.Content
          id="mobile-menu"
          className="fixed inset-x-0 top-[72px] z-[61] max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-gray-200 bg-white shadow-xl outline-none data-[state=open]:animate-[menu-in_220ms_ease-out] md:hidden"
        >
          <Dialog.Title className="sr-only">Mobile navigation</Dialog.Title>
          <ul className="flex flex-col gap-1 px-5 py-4 sm:px-6">
            {/* Phone search box (first item in the menu).
                Same state as the desktop box, so the text is shared.
                Pressing Enter closes the menu so you can see the results. */}
            <li className="pb-2">
              <form
                role="search"
                onSubmit={(e) => {
                  e.preventDefault(); // no page reload
                  setOpen(false); // close the menu to reveal the results
                }}
                className={`h-12 w-full ${searchBox}`}
              >
                <SearchIcon size={20} />
                <input
                  type="search"
                  aria-label="Search products"
                  placeholder="Search products"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="min-w-0 flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-500"
                />
              </form>
            </li>

            <li>
              <NavLink
                to="/"
                end
                onClick={() => setOpen(false)}
                className={mobileLink}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                onClick={() => setOpen(false)}
                className={mobileLink}
              >
                All Products
              </NavLink>
            </li>

            {user && (
              <li>
                <NavLink
                  to="/my-orders"
                  onClick={() => setOpen(false)}
                  className={mobileLink}
                >
                  My Orders
                </NavLink>
              </li>
            )}

            <li>
              <NavLink
                to="/contact"
                onClick={() => setOpen(false)}
                className={mobileLink}
              >
                Contact
              </NavLink>
            </li>

            {/* NEW: Admin link (phone menu) */}
            <li>
              <NavLink
                to="/seller"
                onClick={() => setOpen(false)}
                className={mobileLink}
              >
                Admin
              </NavLink>
            </li>

            <li className="pt-3">
              {!user ? (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate("/login", { state: { from: location } });
                  }}
                  className={`flex h-14 w-full text-lg ${loginBtn}`}
                >
                  Login
                </button>
              ) : (
                <button
                  type="button"
                  onClick={logout}
                  className={`flex h-14 w-full text-lg ${loginBtn}`}
                >
                  Logout
                </button>
              )}
            </li>
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
};

export default Navbar;
