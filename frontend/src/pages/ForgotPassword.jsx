import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const ForgotPassword = () => {
  const { axios } = useAppContext();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [developmentResetUrl, setDevelopmentResetUrl] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await axios.post("/api/user/forgot-password", { email });
      if (!data.success) {
        throw new Error(data.message || "Unable to request password reset");
      }
      setDevelopmentResetUrl(
        data.developmentOnly ? data.resetUrl || "" : "",
      );
      setSubmitted(true);
    } catch (error) {
      console.error("Password reset request failed:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to request password reset",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <section className="w-full max-w-md rounded-lg bg-white p-6 text-gray-600 shadow-xl sm:p-10">
        <h1 className="text-center text-2xl font-semibold sm:text-3xl">
          <span className="text-primary">Reset</span> Password
        </h1>
        {submitted ? (
          <>
            <p className="mt-6 text-center text-sm leading-6">
              If an account exists for that email, password reset instructions
              will be sent.
            </p>
            {developmentResetUrl && (
              <p className="mt-4 text-center text-sm leading-6">
                Email delivery is not configured for local development.{" "}
                <Link
                  to={developmentResetUrl}
                  className="font-medium text-primary hover:underline"
                >
                  Open the password reset link
                </Link>
              </p>
            )}
          </>
        ) : (
          <>
            <p className="mt-4 text-sm leading-6">
              Enter your account email and we’ll send you a secure password
              reset link.
            </p>
            <form onSubmit={handleSubmit} className="mt-6">
              <label htmlFor="reset-email" className="text-base sm:text-lg">
                Email
              </label>
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="type here"
                className="mt-2 h-12 w-full rounded border border-gray-200 px-3 text-base outline-primary placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 h-12 w-full cursor-pointer rounded-md bg-primary text-base font-medium text-white transition hover:bg-primary-dull disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        )}
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </p>
      </section>
    </main>
  );
};

export default ForgotPassword;
