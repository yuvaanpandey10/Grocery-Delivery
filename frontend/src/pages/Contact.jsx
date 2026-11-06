import { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Contact = () => {
  const { axios, user } = useAppContext();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await axios.post("/api/contact", {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      if (!data.success) {
        throw new Error(data.message || "Unable to send your message");
      }
      setForm((current) => ({ ...current, message: "" }));
      toast.success("Your message has been sent");
    } catch (error) {
      console.error("Unable to send contact message:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to send your message",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative left-1/2 w-screen -translate-x-1/2 px-4 py-14 md:px-8 md:py-20 xl:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-medium text-primary">WE’RE HERE TO HELP</p>
          <h1 className="mt-3 text-3xl font-semibold text-gray-800 md:text-4xl">
            Get in touch
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-500 md:text-lg">
            Have a question about an order or need help with your shopping?
            Send our team a message and we’ll get back to you by email.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 max-w-2xl rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium text-gray-700">
              Your name
              <input
                type="text"
                name="name"
                autoComplete="name"
                maxLength={100}
                required
                value={form.name}
                onChange={handleChange}
                className="mt-2 h-12 w-full rounded border border-gray-300 px-3 text-base font-normal outline-primary"
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Email address
              <input
                type="email"
                name="email"
                autoComplete="email"
                maxLength={254}
                required
                value={form.email}
                onChange={handleChange}
                className="mt-2 h-12 w-full rounded border border-gray-300 px-3 text-base font-normal outline-primary"
              />
            </label>
          </div>
          <label className="mt-5 block text-sm font-medium text-gray-700">
            How can we help?
            <textarea
              name="message"
              rows={6}
              maxLength={5000}
              required
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us what you need help with..."
              className="mt-2 w-full resize-y rounded border border-gray-300 px-3 py-3 text-base font-normal outline-primary placeholder:text-gray-400"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full cursor-pointer rounded bg-primary py-3 font-medium text-white transition hover:bg-primary-dull disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
          >
            {isSubmitting ? "Sending..." : "Send message"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Contact;
