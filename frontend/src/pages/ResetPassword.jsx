import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const ResetPassword = () => {
  const { token } = useParams();
  const { axios } = useAppContext();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post("/api/user/reset-password", {
        token,
        password,
      });
      if (!data.success) {
        throw new Error(data.message || "Unable to reset password");
      }
      toast.success(data.message || "Password reset successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Password reset failed:", error);
      toast.error(
        error.response?.data?.message || error.message || "Unable to reset password",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <section className="w-full max-w-md rounded-lg bg-white p-6 text-gray-600 shadow-xl sm:p-10">
        <h1 className="text-center text-2xl font-semibold sm:text-3xl">
          <span className="text-primary">Choose</span> New Password
        </h1>
        <form onSubmit={handleSubmit} className="mt-6">
          <label htmlFor="new-password" className="text-base sm:text-lg">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 h-12 w-full rounded border border-gray-200 px-3 text-base outline-primary"
          />
          <label
            htmlFor="confirm-password"
            className="mt-5 block text-base sm:text-lg"
          >
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="mt-2 h-12 w-full rounded border border-gray-200 px-3 text-base outline-primary"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 h-12 w-full cursor-pointer rounded-md bg-primary text-base font-medium text-white transition hover:bg-primary-dull disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Updating..." : "Reset Password"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </section>
    </main>
  );
};

export default ResetPassword;
