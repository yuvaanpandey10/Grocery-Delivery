import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const MainBanner = () => {
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 md:px-8 xl:px-12">
      <div className="relative mx-auto max-w-[1600px]">
        <img
          src={assets.main_banner_bg}
          alt="Banner"
          className="w-full hidden md:block rounded-2xl"
        />
        <img
          src={assets.main_banner_bg_sm}
          alt="Banner"
          className="w-full md:hidden rounded-2xl"
        />
        <div className="absolute inset-0 bottom-18 flex flex-col items-center md:items-start justify-end md:justify-center pb-6 sm:pb-10 md:pb-0 px-4 md:pl-12 lg:pl-16 xl:pl-24">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-center md:text-left text-balance max-w-[9.5em] leading-tight">
            Freshness You Can Trust, Savings You will love!
          </h1>

          <div className="flex items-center mt-6 font-medium">
            <Link
              to={"/products"}
              className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer"
            >
              Shop now
              <img
                className="md:hidden transition group-hover:translate-x-1 group-focus:translate-x-1"
                src={assets.white_arrow_icon}
                alt="arrow"
              />
            </Link>
            <Link
              to={"/products"}
              className="group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer"
            >
              Explore deals
              <img
                className="transition group-hover:translate-x-1 group-focus:translate-x-1"
                src={assets.black_arrow_icon}
                alt="arrow"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
