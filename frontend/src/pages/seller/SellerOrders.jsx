import toast from "react-hot-toast";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

// ============================================================
// STATUS LIST for the dropdown (PLACEHOLDER: edit this list)
// "Order Placed" must stay: it is the status new orders start with.
// ============================================================
const orderStatuses = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const SellerOrders = () => {
  // Shared data and functions from the Context
  const { sellerOrders, sellerOrdersLoaded, updateOrderStatus } =
    useAppContext();

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
    } catch (error) {
      console.error("Unable to update order status:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to update order status",
      );
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 md:text-2xl">
        Orders
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {sellerOrders.length} orders
      </p>

      {/* Empty state */}
      {!sellerOrdersLoaded && (
        <p className="mt-6 text-gray-600">Loading orders...</p>
      )}
      {sellerOrdersLoaded && sellerOrders.length === 0 && (
        <p className="mt-6 text-gray-600">No orders yet.</p>
      )}

      {/* ---------- ONE CARD PER ORDER (.map) ---------- */}
      <ul className="mt-6 space-y-4">
        {sellerOrders.map((order) => (
          <li
            key={order._id}
            className="rounded-lg border border-gray-200 bg-white p-4 md:p-5"
          >
            {/* Top line: order id, date, status dropdown */}
            <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-500">
                <p>
                  Order{" "}
                  <span className="font-medium text-gray-900">
                    #{String(order._id).slice(-8)}
                  </span>
                </p>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
              </div>

              {/* Status dropdown: changes the order in the Context */}
              <select
                value={order.status || "Order Placed"}
                onChange={(e) =>
                  handleStatusChange(order._id, e.target.value)
                }
                aria-label="Order status"
                className="w-full cursor-pointer rounded border border-gray-300 px-3 py-2 text-sm outline-primary sm:w-52"
              >
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Body: items | address | amount + payment (stacks on phone) */}
            <div className="grid gap-5 pt-4 md:grid-cols-[1.4fr_1fr_1fr]">
              {/* Items (.map) */}
              <ul className="space-y-3">
                {order.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <img
                      src={item.product?.image?.[0] || ""}
                      alt={item.product?.name || "Product"}
                      className="h-12 w-12 shrink-0 rounded border border-gray-200 object-contain"
                    />
                    <p className="min-w-0 text-sm">
                      <span className="font-medium text-gray-900">
                        {item.product?.name || "Product no longer available"}
                      </span>{" "}
                      <span className="text-primary-dull">
                        x {item.quantity}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>

              {/* Delivery address (optional chaining: safe if a field is missing) */}
              <div className="text-sm leading-relaxed text-gray-600">
                <p className="font-medium text-gray-900">
                  {order.address?.firstName} {order.address?.lastName}
                </p>
                <p>{order.address?.street}</p>
                <p>
                  {order.address?.city}, {order.address?.state}{" "}
                  {order.address?.zipcode}
                </p>
                <p>{order.address?.country}</p>
                <p>{order.address?.phone}</p>
              </div>

              {/* Amount, payment type, paid or pending */}
              <div className="space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-2 text-base font-medium text-gray-900">
                  <img src={assets.box_icon} alt="" className="h-5 w-5" />$
                  {order.amount}
                </p>
                <p>Payment: {order.paymentType}</p>
                <p>
                  Status:{" "}
                  <span
                    className={
                      order.isPaid ? "text-primary-dull" : "text-amber-600"
                    }
                  >
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerOrders;
