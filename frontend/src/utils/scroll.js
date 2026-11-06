let lenisInstance = null;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const setLenisInstance = (instance) => {
  lenisInstance = instance;
};

export const scrollToTop = (options = {}) => {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, options);
    return;
  }

  window.scrollTo({
    top: 0,
    behavior: options.immediate || prefersReducedMotion() ? "auto" : "smooth",
  });
};

export const scrollToElement = (element, options = {}) => {
  if (!element) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(element, options);
    return;
  }

  element.scrollIntoView({
    behavior: options.immediate || prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
};
