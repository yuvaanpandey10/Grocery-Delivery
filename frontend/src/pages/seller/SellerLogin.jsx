import { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const SellerLogin = () => {
  const { setIsSeller, axios } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await axios.post("/api/seller/login", { email, password });
      if (!data.success) throw new Error(data.message || "Invalid credentials");
      setIsSeller(true);
      toast.success("Admin logged in successfully");
    } catch (error) {
      console.error("Error during admin login:", error);
      toast.error(
        error.response?.data?.message || error.message || "Unable to sign in",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 text-gray-600 shadow-xl sm:p-10"
      >
        <h2 className="text-center text-2xl font-semibold sm:text-3xl">
          <span className="text-primary">Admin</span> Login
        </h2>
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
            placeholder="admin@example.com"
            className="mt-2 h-12 w-full rounded border border-gray-200 px-3 text-base outline-primary placeholder:text-gray-400"
          />
        </div>
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
            placeholder="ExamplePassword123!"
            className="mt-2 h-12 w-full rounded border border-gray-200 px-3 text-base outline-primary placeholder:text-gray-400"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 h-12 w-full cursor-pointer rounded-md bg-primary text-base font-medium text-white transition hover:bg-primary-dull disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default SellerLogin;
