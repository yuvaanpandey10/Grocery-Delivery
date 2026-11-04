// ============================================================
// IMPORTS
// ============================================================
import React from "react";
// NavLink is like <a>, but it knows which page is active (for highlighting)
// and it changes pages without reloading the whole website.
import { NavLink } from "react-router-dom";
// Your images (logo, cart icon, profile icon, ...)
import { assets } from "../assets/assets";
// Shared data from your app: the logged-in user, login popup, navigate()
import { useAppContext } from "../context/AppContext";

// ============================================================
// REUSABLE TAILWIND CLASS STRINGS
// We write long class lists once and reuse them everywhere.
// This keeps the JSX short and makes style changes easy (edit in one place).
// ============================================================

// Green outline shown when you navigate with the keyboard (Tab key).
// "focus-visible" means it only appears for keyboard users, not mouse clicks.
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

// Style for the desktop menu links (Home, All Products, Contact).
// NavLink gives us { isActive } so we can style the current page differently.
// lg: = applies from 1024px screens up (bigger text and padding).
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
// h-12 w-12 = 48px, a comfortable size for a finger tap.
const iconButton = `relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 ${focusRing}`;

// Style for the search pill. "focus-within" = styles apply when the
// input INSIDE this box is focused, so the whole pill lights up green.
const searchBox =
  "flex items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-4 text-gray-500 transition focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/30";

// Style shared by every Login / Logout button.
const loginBtn = `cursor-pointer items-center justify-center rounded-full bg-primary font-semibold text-gray-900 transition-colors hover:bg-primary-dull ${focusRing}`;

// ============================================================
// SMALL COMPONENT: SearchIcon
// An inline SVG, so it can never break like a missing image file.
// "size" is a prop with a default value of 18.
// currentColor = the icon takes the text color of its parent.
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
    aria-hidden="true" // screen readers skip it (it's only decoration)
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
  // State = data that, when it changes, makes React redraw the component.

  // Is the phone menu open?
  const [open, setOpen] = React.useState(false);
  // Is the profile dropdown (My Orders / Logout) open?
  const [profileOpen, setProfileOpen] = React.useState(false);

  // ---------- REFS ----------
  // A ref points to a real HTML element so we can inspect it later.
  // We use it to detect clicks outside the profile dropdown.
  const profileRef = React.useRef(null);

  // ---------- SHARED APP DATA ----------
  // user: null when logged out, an object when logged in
  // setUser: change the user
  // setShowUserLogin: opens your login popup
  // navigate: go to another page, e.g. navigate("/cart")
  const { user, setUser, setShowUserLogin, navigate } = useAppContext();

  // TODO: replace with the real cart count from your context
  const cartCount = 3;

  // ---------- LOGOUT ----------
  // Close all menus, clear the user, go back to the home page.
  const logout = () => {
    setProfileOpen(false);
    setOpen(false);
    setUser(null);
    navigate("/");
  };

  // ---------- EFFECT: global event listeners ----------
  // useEffect runs code outside normal rendering (like listening to the window).
  // The [] at the end means: run once, when the component first appears.
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

    // If the window becomes wide (768px+), the phone menu isn't needed,
    // so we close it. This avoids a stuck-open menu after rotating a tablet.
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    window.addEventListener("resize", onResize);

    // CLEANUP: runs when the component disappears.
    // Always remove listeners you added, or they pile up (memory leak).
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
    // HEADER BAR
    // sticky top-0  -> stays at the top while you scroll
    // z-50          -> sits above other content
    // bg-white/90 + backdrop-blur -> slightly see-through with a frosted effect
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
      {/* NAV ROW
          Uses CSS grid so the middle links are truly centered:
          - phone:  2 columns  [logo | actions]
          - md+:    3 columns  [logo | links | actions] (1fr auto 1fr)
          mx-auto + max-w-screen-2xl -> centered with a maximum width
          h-[72px] on phone, lg:h-20 (80px) on large screens */}
      <nav
        aria-label="Main"
        className="mx-auto grid h-18 max-w-screen-2xl grid-cols-[1fr_auto] items-center gap-4 px-5 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:h-20 lg:px-10 xl:px-16"
      >
        {/* ---------- BLOCK 1: LOGO ---------- */}
        <NavLink
          to="/"
          onClick={() => setOpen(false)} // also close the phone menu
          className={`w-fit rounded-lg ${focusRing}`}
          aria-label="Home" // screen readers announce "Home"
        >
          <img src={assets.logo} alt="logo" className="h-8 w-auto lg:h-11" />
        </NavLink>

        {/* ---------- BLOCK 2: DESKTOP LINKS ----------
            "hidden md:flex" = invisible on phones, shown from 768px up.
            "end" on Home means: only active on exactly "/", not on every page
            (every URL starts with "/", so without "end" Home is always active). */}
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
        </ul>

        {/* ---------- BLOCK 3: ACTIONS (right side) ----------
            justify-self-end pushes this group to the right edge of its column. */}
        <div className="flex items-center justify-self-end gap-1 sm:gap-2 lg:gap-3">
          {/* --- 3a. Search box (large screens only: "hidden lg:flex") --- */}
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
              // min-w-0 + flex-1: the input fills the leftover space without overflowing
              className="min-w-0 flex-1 bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-gray-500"
            />
          </form>

          {/* --- 3b. Cart button --- */}
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className={iconButton}
            aria-label={`Cart, ${cartCount} items`}
          >
            <img src={assets.nav_cart_icon} alt="" className="w-7 opacity-80" />
            {/* Badge: only drawn when the cart has items.
                absolute positions it over the top-right corner of the button
                (the button is "relative", so it is the positioning anchor). */}
            {cartCount > 0 && (
              <span className="absolute right-0 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold leading-none text-gray-900">
                {cartCount}
              </span>
            )}
          </button>

          {/* --- 3c. Login button OR profile menu (tablet and up) ---
              Ternary: condition ? showThis : showThat
              No user -> show Login. User exists -> show profile dropdown. */}
          {!user ? (
            <button
              type="button"
              onClick={() => setShowUserLogin(true)} // open the login popup
              className={`ml-1 hidden h-11 px-6 text-sm md:inline-flex lg:px-8 lg:text-[15px] ${loginBtn}`}
            >
              Login
            </button>
          ) : (
            // Wrapper is "relative" so the dropdown can be placed under the button.
            // ref={profileRef} lets the click-outside code find this element.
            <div ref={profileRef} className="relative hidden md:block">
              {/* Profile picture button: toggles the dropdown on click */}
              <button
                type="button"
                aria-label="Open account menu"
                aria-expanded={profileOpen} // tells screen readers if it's open
                onClick={() => setProfileOpen((v) => !v)} // flip true/false
                className={`block cursor-pointer rounded-full ${focusRing}`}
              >
                <img
                  src={assets.profile_icon}
                  alt=""
                  className="w-10 lg:w-11"
                />
              </button>

              {/* Dropdown: rendered only while profileOpen is true.
                  absolute right-0 top-full -> directly under the button, right-aligned. */}
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
                        setProfileOpen(false); // close dropdown, then go
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

          {/* --- 3d. Hamburger button (phones only: "md:hidden") ---
              Draws a menu icon when closed and an X when open. */}
          <button
            type="button"
            className={`${iconButton} md:hidden`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu" // points to the menu below by its id
            onClick={() => setOpen((v) => !v)}
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
                <path d="M6 6l12 12M18 6L6 18" /> // X shape
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" /> // three lines
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* ---------- BLOCK 4: PHONE MENU ----------
          Drawn only while "open" is true, and hidden on md+ screens.
          It sits under the header in normal page flow, so no hardcoded
          top-[60px] guess is needed like in the original. */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-gray-200 bg-white md:hidden"
        >
          <ul className="flex flex-col gap-1 px-5 py-4 sm:px-6">
            <li>
              {/* Each link closes the menu when tapped */}
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

            {/* "My Orders" shows only for logged-in users.
                && means: if the left side is true, draw the right side. */}
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

            {/* Big full-width Login / Logout button at the bottom */}
            <li className="pt-3">
              {!user ? (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false); // close the menu first
                    setShowUserLogin(true); // then open the login popup
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
        </div>
      )}
    </header>
  );
};

// Lets other files do: import Navbar from "./components/Navbar"
export default Navbar;
