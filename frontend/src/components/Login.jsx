import { useState } from "react";
import toast from "react-hot-toast";
// Shared data from your Context API
import { useAppContext } from "../context/AppContext";

const Login = () => {
  // From Context: close the popup, save the user
  const { setShowUserLogin, setUser } = useAppContext();

  // Local state only for this form (these do not exist in the context)
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Runs when the form is submitted (button click or Enter key)
  const handleSubmit = (e) => {
    e.preventDefault(); // stop the page from reloading

    // No backend yet: we save the user in the Context
    setUser({ name: name || email.split("@")[0], email });
    setShowUserLogin(false); // close the popup
    toast.success(mode === "login" ? "Logged in" : "Account created");
  };

  return (
    // Dark background that covers the whole screen. Click on it = close popup.
    // fixed + inset-0 = full screen | z-[100] = above the sticky Navbar (z-50)
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
    >
      {/* White card. stopPropagation = clicking inside does NOT close the popup */}
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-white p-6 sm:p-10 shadow-xl text-gray-600"
      >
        {/* Title: "User" is green, "Login" is gray (or "Sign Up" in register mode) */}
        <h2 className="text-center text-2xl sm:text-3xl font-semibold">
          <span className="text-primary">User</span>{" "}
          {mode === "login" ? "Login" : "Sign Up"}
        </h2>

        {/* Name field: only shown in register mode */}
        {mode === "register" && (
          <div className="mt-6">
            <label htmlFor="name" className="text-base sm:text-lg">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="type here"
              className="mt-2 h-12 w-full rounded border border-gray-200 px-3 text-base outline-primary placeholder:text-gray-400"
            />
          </div>
        )}

        {/* Email field */}
        <div className="mt-6">
          <label htmlFor="email" className="text-base sm:text-lg">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="type here"
            className="mt-2 h-12 w-full rounded border border-gray-200 px-3 text-base outline-primary placeholder:text-gray-400"
          />
        </div>

        {/* Password field */}
        <div className="mt-6">
          <label htmlFor="password" className="text-base sm:text-lg">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="type here"
            className="mt-2 h-12 w-full rounded border border-gray-200 px-3 text-base outline-primary placeholder:text-gray-400"
          />
        </div>

        {/* Switch between login and register */}
        <p className="mt-6 text-base sm:text-lg">
          {mode === "login"
            ? "Create an account? "
            : "Already have an account? "}
          <span
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="cursor-pointer text-primary"
          >
            click here
          </span>
        </p>

        {/* Submit button */}
        <button
          type="submit"
          className="mt-6 h-12 w-full cursor-pointer rounded-md bg-primary text-base sm:text-lg font-medium text-white transition hover:bg-primary-dull"
        >
          {mode === "login" ? "Login" : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default Login;
