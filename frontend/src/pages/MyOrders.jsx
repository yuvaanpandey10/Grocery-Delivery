// Shared data and functions from your Context API
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { scrollToTop } from "../utils/scroll";

const MyOrders = () => {
  // FROM CONTEXT:
  // orders   = all placed orders, newest first (saved by placeOrder in AppContext)
  // navigate = used by "Continue Shopping" when there are no orders
  const { orders, ordersLoaded, fetchOrders, navigate, user } = useAppContext();
  const [isRefreshing, setIsRefreshing] = useState(!ordersLoaded);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    fetchOrders()
      .catch((error) => {
        console.error("Unable to refresh your orders:", error);
        if (!active) return;
        const message =
          error.response?.data?.message || "Unable to load your orders";
        setLoadError(message);
        toast.error(message);
      })
      .finally(() => {
        if (active) setIsRefreshing(false);
      });

    return () => {
      active = false;
    };
  }, [fetchOrders, user?._id]);

  return (
    // Full-width wrapper (same as your other sections)
    <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 md:px-8 xl:px-12 mt-16 mb-16">
      <div className="mx-auto max-w-[1600px]">
        {/* TITLE: "ORDERS" gets the green underline (same style as CategoryProducts) */}
        <h1 className="text-2xl md:text-3xl font-medium text-gray-700">
          MY{" "}
          <span className="inline-block border-b-2 border-primary pb-2">
            ORDERS
          </span>
        </h1>

        {/* NO ORDERS YET: message + button to All Products */}
        {orders.length === 0 &&
        (isRefreshing || (!ordersLoaded && !loadError)) ? (
          <p className="mt-10 text-center text-base text-gray-500">
            Loading your orders...
          </p>
        ) : loadError && orders.length === 0 ? (
          <div className="mt-10 flex flex-col items-center text-center">
            <p className="text-base text-gray-500">{loadError}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 cursor-pointer rounded bg-primary px-6 py-2 font-medium text-white transition hover:bg-primary-dull"
            >
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-10 flex flex-col items-center text-center">
            <p className="text-base md:text-lg text-gray-500">
              You have no orders yet
            </p>
            <button
              type="button"
              onClick={() => {
                navigate("/products");
                scrollToTop();
              }}
              className="mt-6 cursor-pointer rounded bg-primary px-10 py-3 font-medium text-white transition hover:bg-primary-dull"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="mt-8">
            {/* MAP METHOD: one card for each order.
                key = order._id (unique id created in placeOrder) */}
            {orders.map((order) => (
              <div
                key={order._id}
                className="mb-10 max-w-4xl rounded-lg border border-gray-300 p-4 md:py-5"
              >
                {/* CARD HEADER: Order id, payment type, total amount.
                    Phone = stacked, md+ = one row. */}
                <div className="flex flex-col gap-1 text-sm md:flex-row md:items-center md:justify-between md:text-base md:font-medium text-gray-400">
                  <span className="break-all">OrderId : {order._id}</span>
                  <span>Payment : {order.paymentType || order.paymentMethod}</span>
                  <span>
                    Total Amount : ${Number(order.amount || 0).toFixed(2)}
                  </span>
                </div>

                {/* MAP METHOD: one row for each product in this order.
                    The line under a row shows on every row except the last one. */}
                {(order.items || []).map((item, index) => (
                  <div
                    key={`${item.product?._id || index}-${index}`}
                    className={`flex flex-col gap-4 py-5 text-gray-500/70 md:flex-row md:items-center md:gap-8 ${
                      index !== order.items.length - 1
                        ? "border-b border-gray-300"
                        : ""
                    }`}
                  >
                    {/* COLUMN 1: image (light green box) + name + category */}
                    <div className="flex flex-1 items-center gap-4">
                      <div className="shrink-0 rounded-lg bg-primary/10 p-3 md:p-4">
                        <img
                          src={item.product?.image?.[0] || ""}
                          alt={item.product?.name || "Product"}
                          className="h-14 w-14 md:h-16 md:w-16 object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg md:text-xl font-medium text-gray-800">
                          {item.product?.name || "Product no longer available"}
                        </h2>
                        <p className="text-sm md:text-base">
                          Category: {item.product?.category || "—"}
                        </p>
                      </div>
                    </div>

                    {/* COLUMN 2: quantity, status, date */}
                    <div className="text-sm md:w-52 md:text-base">
                      <p>Quantity: {item.quantity}</p>
                      <p>Status: {order.status || "Order Placed"}</p>
                      <p>
                        Date:{" "}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-US")
                          : "—"}
                      </p>
                    </div>

                    {/* COLUMN 3: amount for this product = offerPrice x quantity */}
                    <p className="text-lg font-medium text-primary md:w-32 md:text-right">
                      Amount: $
                      {Number(item.product?.offerPrice || 0) * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
