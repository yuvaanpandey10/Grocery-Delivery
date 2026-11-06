import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  const {
    axios,
    fetchAddresses,
    fetchOrders,
    setUser,
    setCartItems,
  } = useAppContext();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await axios.post(
        mode === "login" ? "/api/user/login" : "/api/user/register",
        mode === "login" ? { email, password } : { name, email, password },
      );
      if (!data.success || !data.user) {
        throw new Error(data.message || "Unable to sign in");
      }

      setUser(data.user);
      setCartItems(data.user.cartItems || {});
      const accountData = await Promise.allSettled([
        fetchAddresses(),
        fetchOrders(),
      ]);
      accountData.forEach((result) => {
        if (result.status === "rejected") {
          console.error("Unable to load account data:", result.reason);
        }
      });

      toast.success(mode === "login" ? "Logged in" : "Account created");
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (error) {
      console.error("User authentication failed:", error);
      toast.error(
        error.response?.data?.message || error.message || "Unable to sign in",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const form = (
    <form
      onClick={(e) => e.stopPropagation()}
      onSubmit={handleSubmit}
      autoComplete="off"
      className="w-full max-w-md rounded-lg bg-white p-6 text-gray-600 shadow-xl sm:p-10"
    >
      <h2 className="text-center text-2xl font-semibold sm:text-3xl">
        {mode === "login" ? "Login" : "Sign Up"}
      </h2>

      {mode === "register" && (
        <div className="mt-6">
          <label htmlFor="name" className="text-base sm:text-lg">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            maxLength={100}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mt-2 h-12 w-full rounded border border-gray-200 px-3 text-base outline-primary placeholder:text-gray-400"
          />
        </div>
      )}

      <div className="mt-6">
        <label htmlFor="page-email" className="text-base sm:text-lg">
          Email
        </label>
        <input
          id="page-email"
          type="email"
          autoComplete="off"
          maxLength={254}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          className="mt-2 h-12 w-full rounded border border-gray-200 px-3 text-base outline-primary placeholder:text-gray-400"
        />
      </div>

      <div className="mt-6">
        <label htmlFor="page-password" className="text-base sm:text-lg">
          Password
        </label>
        <input
          id="page-password"
          type="password"
          autoComplete="new-password"
          readOnly={!isPasswordEditable}
          onFocus={() => setIsPasswordEditable(true)}
          minLength={8}
          maxLength={128}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="ExamplePassword123!"
          className="mt-2 h-12 w-full rounded border border-gray-200 px-3 text-base outline-primary placeholder:text-gray-400"
        />
      </div>

      {mode === "login" && (
        <div className="mt-4 text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      )}

      <p className="mt-6 text-base sm:text-lg">
        {mode === "login"
          ? "Create an account? "
          : "Already have an account? "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setPassword("");
            setIsPasswordEditable(false);
          }}
          className="cursor-pointer text-primary"
        >
          click here
        </button>
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 h-12 w-full cursor-pointer rounded-md bg-primary text-base font-medium text-white transition hover:bg-primary-dull disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
      >
        {isSubmitting
          ? "Please wait..."
          : mode === "login"
            ? "Login"
            : "Create Account"}
      </button>
    </form>
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      {form}
    </main>
  );
};

export default Login;
