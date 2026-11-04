// Import the categories array from assets.js
// Each item has: text, path, image, bgColor
import { categories } from "../assets/assets";
// Import the context hook so we can use `navigate` from AppContext.jsx
import { useAppContext } from "../context/AppContext";

const Category = () => {
  // Get the navigate function from AppContext
  // (it is the same useNavigate from react-router-dom, shared through context)
  const { navigate } = useAppContext();

  return (
    // OUTER WRAPPER (same trick as MainBanner)
    // relative left-1/2 w-screen -translate-x-1/2 = break out of App.jsx padding
    //   and use the full screen width
    // px-4 md:px-8 xl:px-12 = our own side padding for each screen size
    // mt-16 = space between the banner and this section
    <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 md:px-8 xl:px-12 mt-16">
      {/* INNER WRAPPER: stops the content from getting too wide on huge screens
          and centers it (mx-auto) */}
      <div className="mx-auto max-w-[1600px]">
        {/* SECTION TITLE */}
        <h2 className="text-2xl md:text-3xl font-medium text-gray-800">
          Categories
        </h2>

        {/* GRID: this makes the responsive layout
            grid-cols-2    = 2 cards per row on small phones
            sm:grid-cols-3 = 3 per row on small tablets (640px+)
            lg:grid-cols-4 = 4 per row on laptops (1024px+)
            xl:grid-cols-7 = all 7 in one row on big screens (1280px+)
            gap-4 md:gap-6 = space between cards */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 md:gap-6">
          {/* MAP METHOD: loops over every category and makes one card for each.
              "category" = the current item, "index" = its position (0, 1, 2...) */}
          {categories.map((category, index) => (
            <div
              // key is required by React when using map. It must be unique.
              key={index}
              // group = lets the image react when the CARD is hovered
              // cursor-pointer = shows the hand cursor because the card is clickable
              // py-5 px-3 = padding inside the card
              // gap-2 = space between the image and the text
              // rounded-lg = rounded corners
              // flex flex-col justify-center items-center = stack image + text
              //   vertically and center them
              className="group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center"
              // Background color comes from assets.js (category.bgColor).
              // We use inline style because Tailwind can't make classes
              // from values that are only known at runtime.
              style={{ backgroundColor: category.bgColor }}
              // ON CLICK:
              // 1. navigate to /products/<category path in lowercase>
              //    Example: "Vegetables" -> /products/vegetables
              // 2. scroll the page to the top after navigating
              onClick={() => {
                navigate(`/products/${category.path.toLowerCase()}`);
                window.scrollTo(0, 0);
              }}
            >
              {/* CATEGORY IMAGE
                  group-hover:scale-108 = zoom in a little when the card is hovered
                  (if no zoom appears, change it to group-hover:scale-105)
                  transition = makes the zoom smooth
                  max-w-28 = limits the image width */}
              <img
                src={category.image}
                alt={category.text}
                className="group-hover:scale-108 transition max-w-28"
              />

              {/* CATEGORY NAME (for example "Organic veggies") */}
              <p className="text-sm font-medium text-center">{category.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
