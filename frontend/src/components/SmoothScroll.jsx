import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

const SmoothScroll = () => {
  const lenisRef = useRef(null);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let lenis;

    const updateScrollMotion = () => {
      if (motionPreference.matches) {
        lenis?.destroy();
        lenis = undefined;
        lenisRef.current = null;
        return;
      }

      lenis = new Lenis({
        autoRaf: true,
        anchors: { offset: -88 },
        duration: 1,
        smoothWheel: true,
      });
      lenisRef.current = lenis;
    };

    updateScrollMotion();
    motionPreference.addEventListener("change", updateScrollMotion);

    return () => {
      motionPreference.removeEventListener("change", updateScrollMotion);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        lenisRef.current?.scrollTo(hash, { offset: -88 });
      } else {
        lenisRef.current?.scrollTo(0, { immediate: true });
      }

      if (!lenisRef.current) {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
};

export default SmoothScroll;
