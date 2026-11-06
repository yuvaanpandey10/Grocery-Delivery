import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { assets } from "../assets/assets";
import MagicShimmer from "./MagicShimmer";

const MainBanner = () => {
  const shouldReduceMotion = useReducedMotion();

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
          <motion.h1
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: "easeOut" }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-center md:text-left text-balance max-w-[9.5em] leading-tight"
          >
            Freshness You Can Trust, Savings You will love!
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.55,
              delay: shouldReduceMotion ? 0 : 0.12,
              ease: "easeOut",
            }}
            className="flex items-center mt-6 font-medium"
          >
            <Link
              to={"/products"}
              className="magic-shimmer group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer"
            >
              Shop now
              <MagicShimmer />
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
