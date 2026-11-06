import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import { scrollToTop, setLenisInstance } from "../utils/scroll";

const SmoothScroll = () => {
  const lenisRef = useRef(null);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let lenis;

    const updateScrollMotion = () => {
      lenis?.destroy();
      lenis = undefined;
      lenisRef.current = null;
      setLenisInstance(null);

      if (motionPreference.matches) {
        return;
      }

      lenis = new Lenis({
        autoRaf: true,
        anchors: { offset: -88 },
        duration: 1.15,
        lerp: 0.09,
        smoothWheel: true,
      });
      lenisRef.current = lenis;
      setLenisInstance(lenis);
    };

    updateScrollMotion();
    motionPreference.addEventListener("change", updateScrollMotion);

    return () => {
      motionPreference.removeEventListener("change", updateScrollMotion);
      lenis?.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (hash && lenisRef.current) {
        lenisRef.current.scrollTo(hash, { offset: -88, force: true });
      } else if (hash) {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      } else {
        scrollToTop({ immediate: true, force: true });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
};

export default SmoothScroll;
