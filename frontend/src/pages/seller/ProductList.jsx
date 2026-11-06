import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const ProductList = () => {
  // Shared data and functions from the Context
  const { products, updateProductStock, deleteProduct, navigate } =
    useAppContext();

  // Ask before deleting (a delete cannot be undone)
  const handleDelete = async (product) => {
    if (window.confirm(`Delete "${product.name}"?`)) {
      try {
        await deleteProduct(product._id);
      } catch (error) {
        console.error("Unable to delete product:", error);
        toast.error(
          error.response?.data?.message || error.message || "Unable to delete product",
        );
      }
    }
  };

  const handleStockChange = async (product) => {
    try {
      await updateProductStock(product._id, !product.inStock);
    } catch (error) {
      console.error("Unable to update product stock:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to update product stock",
      );
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 md:text-2xl">
        Product List
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {products.length} products in the shop
      </p>

      {/* Empty state */}
      {products.length === 0 && (
        <p className="mt-6 text-gray-600">
          No products yet. Add one from the Add Product page.
        </p>
      )}

      {/* ---------- ONE ROW PER PRODUCT (.map) ---------- */}
      {/* Phone: stacked rows. Tablet+: everything on one line */}
      <ul className="mt-6 space-y-3">
        {products.map((product) => (
          <li
            key={product._id}
            className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
          >
            {/* Image + name + category + prices */}
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <img
                src={product.image[0] || ""}
                alt={product.name}
                className="h-16 w-16 shrink-0 rounded border border-gray-200 object-contain"
              />
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-900">
                  {product.name}
                </p>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-sm">
                  <span className="font-medium text-gray-900">
                    ${product.offerPrice}
                  </span>{" "}
                  <span className="text-gray-400 line-through">
                    ${product.price}
                  </span>
                </p>
              </div>
            </div>

            {/* Stock switch + Edit + Delete */}
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              {/* Stock toggle: a checkbox styled as a switch */}
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <span className="relative inline-block h-6 w-11">
                  <input
                    type="checkbox"
                    checked={product.inStock}
                    onChange={() => handleStockChange(product)}
                    className="peer sr-only"
                  />
                  {/* Track */}
                  <span className="absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2" />
                  {/* Knob */}
                  <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                </span>
                <span className="w-20 text-gray-600">
                  {product.inStock ? "In stock" : "Out of stock"}
                </span>
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/seller/edit-product/${product._id}`)
                  }
                  className="cursor-pointer rounded border border-gray-300 px-4 py-1.5 text-sm transition hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(product)}
                  className="cursor-pointer rounded border border-red-200 px-4 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
