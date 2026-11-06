import { motion, useReducedMotion } from "motion/react";
import { assets } from "../assets/assets";

const produce = ["🥬", "🍊", "🥑", "🍅"];

const LoadingScreen = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main
      role="status"
      aria-live="polite"
      aria-label="Loading GreenCart"
      className="fixed inset-0 z-[200] flex min-h-screen items-center justify-center overflow-hidden bg-[#f7fbf8] px-6 text-gray-700"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,rgba(75,251,139,0.16),transparent_38%)]"
      />

      <motion.section
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex w-full max-w-sm flex-col items-center text-center"
      >
        <div className="relative mb-9 flex h-48 w-48 items-center justify-center">
          {!shouldReduceMotion && (
            <>
              <motion.div
                aria-hidden="true"
                className="absolute inset-3 rounded-full border border-primary/25"
                animate={{ scale: [0.88, 1.08, 0.88], opacity: [0.35, 0.8, 0.35] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute inset-7 rounded-full border border-primary/35"
                animate={{ scale: [1.08, 0.9, 1.08], opacity: [0.7, 0.25, 0.7] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              >
                {produce.map((item, index) => (
                  <span
                    key={item}
                    className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-white text-xl shadow-[0_8px_24px_rgba(27,65,41,0.10)]"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${index * 90}deg) translateY(-82px) rotate(-${index * 90}deg)`,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </motion.div>
            </>
          )}

          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : { y: [0, -5, 0], scale: [1, 1.025, 1] }
            }
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[28px] bg-white shadow-[0_16px_48px_rgba(35,81,51,0.14)] ring-1 ring-black/[0.03]"
          >
            <img src={assets.logo} alt="" className="h-12 w-12 object-contain" />
          </motion.div>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-dull">
          GreenCart
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-800">
          Freshness is on the way
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Getting your market ready
        </p>

        <div
          aria-hidden="true"
          className="mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-primary/15"
        >
          <motion.div
            className="h-full w-2/5 rounded-full bg-primary-dull"
            animate={shouldReduceMotion ? undefined : { x: ["-110%", "260%"] }}
            transition={{
              duration: 1.25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.section>
    </main>
  );
};

export default LoadingScreen;
