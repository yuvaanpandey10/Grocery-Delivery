// Import images and the features list (4 items) from assets.js
import { assets, features } from "../assets/assets";

const BottomBanner = () => {
  return (
    // Full-width wrapper (same as your other sections)
    <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 md:px-8 xl:px-12 mt-16">
      <div className="mx-auto max-w-[1600px]">
        {/* Banner box: images are the background, text sits on top */}
        <div className="relative">
          {/* Large screen image (hidden on mobile) */}
          <img
            src={assets.bottom_banner_image}
            alt="Why we are the best"
            className="hidden md:block w-full"
          />
          {/* Small screen image (hidden on md and up) */}
          <img
            src={assets.bottom_banner_image_sm}
            alt="Why we are the best"
            className="md:hidden w-full"
          />

          {/* Text layer on top of the image */}
          {/* Mobile: centered at the top | Desktop: pushed to the right, vertically centered */}
          <div className="absolute inset-0 flex flex-col items-center pt-8 md:pt-0 md:items-end md:justify-center md:pr-10 lg:pr-24 xl:pr-32">
            <div>
              {/* Section title */}
              <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-primary mb-4 lg:mb-6">
                Why We Are the Best?
              </h1>

              {/* Repeated feature items using .map() */}
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 lg:gap-4 mt-2"
                >
                  {/* Feature icon (green square is inside the SVG) */}
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-8 md:w-9 lg:w-11"
                  />
                  <div>
                    <h3 className="text-base md:text-lg lg:text-xl font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500/70 text-xs md:text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomBanner;
