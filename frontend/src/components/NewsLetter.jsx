// Import toast (already installed) to show a message after subscribing
import toast from "react-hot-toast";

const NewsLetter = () => {
  // Runs when the form is submitted (button click or Enter key)
  const handleSubmit = (e) => {
    e.preventDefault(); // stop the page from reloading
    toast.success("Subscribed successfully"); // show success message
    e.target.reset(); // clear the email input
  };

  return (
    // Full-width wrapper (same as your other sections)
    <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 md:px-8 xl:px-12 mt-16 mb-24">
      <div className="mx-auto max-w-[1600px]">
        {/* Everything is centered */}
        <div className="flex flex-col items-center justify-center text-center">
          {/* Title: 30px mobile, 36px tablet, 40px large screens */}
          <h1 className="text-3xl md:text-4xl lg:text-[2.5rem] font-semibold text-gray-800">
            Never Miss a Deal!
          </h1>

          {/* Subtitle: 16px mobile, 18px tablet, 20px large screens */}
          <p className="text-base md:text-lg lg:text-xl text-gray-500/70 mt-3 max-w-xs sm:max-w-none">
            Subscribe to get the latest offers, new arrivals, and exclusive
            discounts
          </p>

          {/* Email form: input and button side by side */}
          {/* Height: 56px on all screens | Max width: 48rem (768px) */}
          <form
            onSubmit={handleSubmit}
            className="flex items-stretch w-full max-w-3xl mt-8 md:mt-10 h-14"
          >
            {/* Email input (takes all remaining width) */}
            <input
              type="email"
              required
              placeholder="Enter your email id"
              className="flex-1 min-w-0 border border-gray-300 rounded-md rounded-r-none px-4 md:px-5 text-base md:text-lg text-gray-600 outline-none placeholder:text-gray-400"
            />

            {/* Subscribe button */}
            <button
              type="submit"
              className="px-7 md:px-12 text-base md:text-lg font-medium text-white bg-primary hover:bg-primary-dull transition rounded-md rounded-l-none cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
