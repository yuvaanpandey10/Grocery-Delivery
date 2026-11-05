import { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

// ============================================================
// PLACEHOLDER ADMIN CREDENTIALS (change these two lines)
// There is no backend yet, so the admin login is checked here.
// ============================================================
const ADMIN_EMAIL = "admin@greencart.com";
const ADMIN_PASSWORD = "admin123";

const SellerLogin = () => {
  // From Context: setIsSeller(true) = the admin is logged in
  const { setIsSeller } = useAppContext();

  // Local state only for this form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Runs when the form is submitted (button click or Enter key)
  const handleSubmit = (e) => {
    e.preventDefault(); // stop the page from reloading

    // Compare with the fixed admin credentials
    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsSeller(true);
      toast.success("Welcome back, admin");
    } else {
      toast.error("Wrong email or password");
    }
  };

  return (
    // Full screen, card centered
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-gray-600 shadow-xl sm:p-10"
      >
        <h2 className="text-center text-2xl font-semibold sm:text-3xl">
          <span className="text-primary">Admin</span> Login
        </h2>

        {/* Email */}
        <div className="mt-6">
          <label htmlFor="admin-email" className="text-base sm:text-lg">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin email"
            className="mt-2 h-12 w-full rounded border border-gray-200 px-3 text-base outline-primary placeholder:text-gray-400"
          />
        </div>

        {/* Password */}
        <div className="mt-6">
          <label htmlFor="admin-password" className="text-base sm:text-lg">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="mt-2 h-12 w-full rounded border border-gray-200 px-3 text-base outline-primary placeholder:text-gray-400"
          />
        </div>

        <button
          type="submit"
          className="mt-8 h-12 w-full cursor-pointer rounded-md bg-primary text-base font-medium text-white transition hover:bg-primary-dull sm:text-lg"
        >
          Login
        </button>

        {/* NEW: small text that shows the admin email and password.
            It reads the two constants above, so it always matches. */}
        <p className="mt-4 text-center text-xs text-gray-400">
          Email: {ADMIN_EMAIL}
          <br />
          Password: {ADMIN_PASSWORD}
        </p>
      </form>
    </div>
  );
};

export default SellerLogin;
