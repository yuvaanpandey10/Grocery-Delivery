import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const PaymentResult = () => {
  const { axios, fetchOrders, navigate, setCartItems } = useAppContext();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [result, setResult] = useState(() => ({
    status: sessionId ? "loading" : "error",
    order: null,
    message: sessionId
      ? undefined
      : "We couldn't confirm this payment. Check your orders before trying again.",
  }));

  useEffect(() => {
    let active = true;

    if (!sessionId) {
      return () => {
        active = false;
      };
    }

    axios
      .get(`/api/order/stripe/verify/${encodeURIComponent(sessionId)}`)
      .then(({ data }) => {
        if (!data.success || !data.order) {
          throw new Error(data.message || "Unable to verify payment");
        }
        if (!active) return;
        setCartItems({});
        setResult({ status: "success", order: data.order });
        fetchOrders().catch((error) => {
          console.error("Unable to refresh orders after payment:", error);
        });
      })
      .catch((error) => {
        if (!active) return;
        console.error("Unable to verify Stripe payment:", error);
        setResult({
          status: "error",
          order: null,
          message:
            error.response?.data?.message ||
            "We couldn't confirm this payment. Check your orders before trying again.",
        });
      });

    return () => {
      active = false;
    };
  }, [axios, fetchOrders, sessionId, setCartItems]);

  const isLoading = result.status === "loading";
  const isSuccess = result.status === "success";

  return (
    <main className="mx-auto my-20 max-w-xl rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
          isSuccess
            ? "bg-primary/10 text-primary"
            : result.status === "error"
              ? "bg-red-50 text-red-600"
              : "bg-gray-100 text-gray-500"
        }`}
        aria-hidden="true"
      >
        {isLoading ? "…" : isSuccess ? "✓" : "!"}
      </div>
      <h1 className="mt-5 text-2xl font-semibold text-gray-800">
        {isLoading
          ? "Confirming your payment"
          : isSuccess
            ? "Payment confirmed"
            : "Payment confirmation unavailable"}
      </h1>
      <p className="mt-3 text-gray-600">
        {isLoading
          ? "Please wait while we securely verify your order."
          : isSuccess
            ? "Your order has been placed successfully."
            : result.message}
      </p>
      {isSuccess && result.order?._id && (
        <p className="mt-3 break-all text-sm text-gray-500">
          Order ID: {result.order._id}
        </p>
      )}
      {!isLoading && (
        <button
          type="button"
          onClick={() => navigate(isSuccess ? "/my-orders" : "/cart")}
          className="mt-7 rounded bg-primary px-7 py-3 font-medium text-white transition hover:bg-primary-dull"
        >
          {isSuccess ? "View My Orders" : "Return to Cart"}
        </button>
      )}
    </main>
  );
};

export default PaymentResult;
