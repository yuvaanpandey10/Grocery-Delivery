import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { assets, categories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

// Shared Tailwind classes for the text inputs (so we write them once)
const inputClass =
  "w-full rounded border border-gray-300 px-3 py-2.5 text-base outline-primary placeholder:text-gray-400";

// This page does TWO jobs:
//  - /seller                  -> ADD a new product (empty form)
//  - /seller/edit-product/:id -> EDIT a product (form filled with its data)
const AddProduct = () => {
  const { id } = useParams();
  const context = useAppContext();
  const editing = context.products.find((product) => product._id === id);

  if (id && !editing) {
    return (
      <div className="text-gray-600">
        <p>
          {context.productsLoaded
            ? "This product was not found."
            : "Loading product..."}
        </p>
        {context.productsLoaded && (
          <button
            type="button"
            onClick={() => context.navigate("/seller/product-list")}
            className="mt-4 cursor-pointer rounded bg-primary px-6 py-2 font-medium text-white hover:bg-primary-dull"
          >
            Back to Product List
          </button>
        )}
      </div>
    );
  }

  return (
    <ProductForm
      key={id || "add"}
      id={id}
      editing={editing}
      addProduct={context.addProduct}
      updateProduct={context.updateProduct}
      navigate={context.navigate}
    />
  );
};

const ProductForm = ({ id, editing, addProduct, updateProduct, navigate }) => {
  const isEdit = Boolean(id);

  // ---------- LOCAL FORM STATE (only used by this form) ----------
  // 4 image slots. Each slot holds an image link (string) or null.
  const [images, setImages] = useState(() => {
    const slots = [null, null, null, null];
    editing?.image?.forEach((src, i) => {
      if (i < 4) slots[i] = src;
    });
    return slots;
  });
  const [name, setName] = useState(editing?.name ?? "");
  // The description is typed one point per line, saved as an array
  const [description, setDescription] = useState(
    editing?.description?.join("\n") ?? "",
  );
  const [category, setCategory] = useState(
    editing?.category ?? categories[0].path,
  );
  const [price, setPrice] = useState(editing ? String(editing.price) : "");
  const [offerPrice, setOfferPrice] = useState(
    editing ? String(editing.offerPrice) : "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const previewUrls = useRef([]);

  useEffect(
    () => () => previewUrls.current.forEach((url) => URL.revokeObjectURL(url)),
    [],
  );

  // ---------- IMAGE HANDLERS ----------
  // A picked file becomes a temporary browser link (lost on refresh).
  const handleImage = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previous = images[index];
    if (previous && typeof previous !== "string") {
      URL.revokeObjectURL(previous.preview);
      previewUrls.current = previewUrls.current.filter(
        (url) => url !== previous.preview,
      );
    }
    const preview = URL.createObjectURL(file);
    previewUrls.current.push(preview);
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { file, preview } : img)),
    );
  };

  // Empty one image slot
  const removeImage = (index) => {
    const image = images[index];
    if (image && typeof image !== "string") {
      URL.revokeObjectURL(image.preview);
      previewUrls.current = previewUrls.current.filter(
        (url) => url !== image.preview,
      );
    }
    setImages((prev) => prev.map((img, i) => (i === index ? null : img)));
  };

  // ---------- SUBMIT ----------
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the page from reloading

    const pickedImages = images.filter(Boolean);
    const descriptionList = description
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean); // one array item per non-empty line

    // Simple checks
    if (pickedImages.length === 0) {
      toast.error("Add at least one image");
      return;
    }
    if (descriptionList.length === 0) {
      toast.error("Write a description");
      return;
    }
    if (Number(offerPrice) > Number(price)) {
      toast.error("Offer price cannot be higher than price");
      return;
    }

    const productData = {
      name: name.trim(),
      category,
      price: Number(price),
      offerPrice: Number(offerPrice),
      image: pickedImages.filter((image) => typeof image === "string"),
      description: descriptionList,
    };
    const formData = new FormData();
    formData.append("productData", JSON.stringify(productData));
    pickedImages.forEach((image) => {
      if (typeof image !== "string") formData.append("images", image.file);
    });

    setIsSubmitting(true);
    try {
      if (isEdit) {
        await updateProduct(id, formData);
        navigate("/seller/product-list");
      } else {
        await addProduct(formData);
        pickedImages.forEach((image) => {
          if (typeof image !== "string") URL.revokeObjectURL(image.preview);
        });
        previewUrls.current = previewUrls.current.filter(
          (url) =>
            !pickedImages.some(
              (image) =>
                typeof image !== "string" && image.preview === url,
            ),
        );
        setImages([null, null, null, null]);
        setName("");
        setDescription("");
        setCategory(categories[0].path);
        setPrice("");
        setOfferPrice("");
      }
    } catch (error) {
      console.error("Unable to save product:", error);
      toast.error(
        error.response?.data?.message || error.message || "Unable to save product",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 md:text-2xl">
        {isEdit ? "Edit Product" : "Add Product"}
      </h1>

      {/* ---------- IMAGES (4 slots, built with .map) ---------- */}
      <div>
        <p className="text-base font-medium">Product Images</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {images.map((img, index) => (
            <div key={index} className="relative">
              <label htmlFor={`image${index}`} className="cursor-pointer">
                <input
                  id={`image${index}`}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleImage(index, e)}
                />
                {/* Shows the picked image, or the upload placeholder */}
                <img
                  src={
                    typeof img === "string"
                      ? img
                      : img?.preview || assets.upload_area
                  }
                  alt="Product upload"
                  className="h-24 w-24 rounded border border-gray-300 bg-white object-cover"
                />
              </label>
              {/* Small remove button, only when the slot has an image */}
              {img && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label="Remove image"
                  className="absolute -right-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white text-sm text-gray-600 shadow ring-1 ring-gray-300 hover:bg-gray-100"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- NAME ---------- */}
      <div>
        <label htmlFor="product-name" className="text-base font-medium">
          Product Name
        </label>
        <input
          id="product-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Tomato 1 kg"
          className={`mt-2 ${inputClass}`}
        />
      </div>

      {/* ---------- DESCRIPTION (one point per line) ---------- */}
      <div>
        <label htmlFor="product-description" className="text-base font-medium">
          Product Description
        </label>
        <textarea
          id="product-description"
          rows={4}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write one point per line"
          className={`mt-2 resize-none ${inputClass}`}
        />
        <p className="mt-1 text-sm text-gray-500">
          Each line becomes one bullet point on the product page.
        </p>
      </div>

      {/* ---------- CATEGORY (options built with .map) ---------- */}
      <div>
        <label htmlFor="product-category" className="text-base font-medium">
          Category
        </label>
        <select
          id="product-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`mt-2 ${inputClass}`}
        >
          {categories.map((item) => (
            <option key={item.path} value={item.path}>
              {item.path}
            </option>
          ))}
        </select>
      </div>

      {/* ---------- PRICES (stack on phone, side by side from sm) ---------- */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="product-price" className="text-base font-medium">
            Product Price ($)
          </label>
          <input
            id="product-price"
            type="number"
            min="0"
            step="any"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            className={`mt-2 ${inputClass}`}
          />
        </div>
        <div className="flex-1">
          <label htmlFor="offer-price" className="text-base font-medium">
            Offer Price ($)
          </label>
          <input
            id="offer-price"
            type="number"
            min="0"
            step="any"
            required
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            placeholder="0"
            className={`mt-2 ${inputClass}`}
          />
        </div>
      </div>

      {/* ---------- BUTTONS ---------- */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer rounded bg-primary px-8 py-2.5 font-medium text-white transition hover:bg-primary-dull"
        >
          {isSubmitting
            ? "Saving..."
            : isEdit
              ? "Save changes"
              : "Add product"}
        </button>
        {/* Cancel only in edit mode */}
        {isEdit && (
          <button
            type="button"
            onClick={() => navigate("/seller/product-list")}
            className="cursor-pointer rounded border border-gray-300 px-8 py-2.5 transition hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddProduct;
