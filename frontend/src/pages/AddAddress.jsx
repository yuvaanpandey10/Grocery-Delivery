import { useState } from "react";
// assets = add_address_iamge (the picture next to the form; your assets.js spells it "iamge")
import { assets } from "../assets/assets";
// Shared data and functions from your Context API
import { useAppContext } from "../context/AppContext";

// ============================================================
// FORM DATA
// ============================================================
// Empty form values (used at the start)
const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  street: "",
  city: "",
  state: "",
  zipcode: "",
  country: "",
  phone: "",
};

// One item for each input in the form (drawn with .map()).
// full: true = the input takes the whole row on bigger screens.
const addressFields = [
  { name: "firstName", placeholder: "First Name", type: "text" },
  { name: "lastName", placeholder: "Last Name", type: "text" },
  { name: "email", placeholder: "Email address", type: "email", full: true },
  { name: "street", placeholder: "Street", type: "text", full: true },
  { name: "city", placeholder: "City", type: "text" },
  { name: "state", placeholder: "State", type: "text" },
  { name: "zipcode", placeholder: "Zip code", type: "text" },
  { name: "country", placeholder: "Country", type: "text" },
  { name: "phone", placeholder: "Phone", type: "tel", full: true },
];

// Style shared by every input in the form
const inputClass =
  "w-full border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-primary";

const AddAddress = () => {
  // FROM CONTEXT:
  // addAddress = saves the address in the context and selects it for delivery
  // navigate   = used to go back to the cart
  const { addAddress, navigate } = useAppContext();

  // The values typed in the form
  const [form, setForm] = useState(emptyForm);

  // Update one field while typing (name = the input's "name")
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Go back to the cart and scroll to the top
  const goToCart = () => {
    navigate("/cart");
    window.scrollTo(0, 0);
  };

  // Save the address (the browser already checked the required fields)
  const handleSubmit = (e) => {
    e.preventDefault(); // no page reload
    // trim() removes spaces at the start/end of every value
    const cleaned = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()]),
    );
    addAddress(cleaned); // saves it in the context and selects it
    goToCart(); // back to the cart, where the new address is shown
  };

  return (
    // Full-width wrapper (same as your other sections)
    <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 md:px-8 xl:px-12 mt-16 mb-16">
      <div className="mx-auto max-w-[1600px]">
        {/* TITLE */}
        <h1 className="text-2xl md:text-3xl font-medium text-gray-700">
          Add Shipping <span className="text-primary">Address</span>
        </h1>

        {/* phone = picture hidden, md+ = form left, picture right */}
        <div className="mt-8 flex flex-col md:flex-row md:justify-between gap-10">
          {/* ---------- FORM ---------- */}
          <form onSubmit={handleSubmit} className="w-full max-w-lg">
            {/* MAP METHOD: one input for each item in addressFields */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {addressFields.map((field) => (
                <input
                  key={field.name}
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  aria-label={field.placeholder}
                  required
                  // Phone: only digits, spaces and + (7 to 15 characters)
                  {...(field.name === "phone" && {
                    pattern: "[0-9+ ]{7,15}",
                    title: "Enter a valid phone number (7 to 15 digits)",
                  })}
                  className={`${inputClass} ${field.full ? "sm:col-span-2" : ""}`}
                />
              ))}
            </div>

            {/* BUTTONS: Cancel (back to cart) + Save */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={goToCart}
                className="flex-1 cursor-pointer border border-gray-300 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 cursor-pointer bg-primary py-3 font-medium text-white transition hover:bg-primary-dull"
              >
                Save Address
              </button>
            </div>
          </form>

          {/* ---------- PICTURE (hidden on phones) ---------- */}
          <img
            src={assets.add_address_iamge}
            alt=""
            className="hidden md:block md:w-72 lg:w-96 self-start"
          />
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
