import { useEffect, useState } from "react";

export const motionDurations = {
  instant: 0,
  reduced: 0.08,
  fast: 0.12,
  base: 0.18,
  comfortable: 0.24,
  slow: 0.36,
};

export const motionEasings = {
  easeOut: "power2.out",
  emphasized: "power3.out",
};

export const motionDistances = {
  sm: 8,
  md: 12,
  lg: 20,
};

export const motionStaggers = {
  tight: 0.03,
  default: 0.05,
};

export const getRevealVars = (
  reducedMotion,
  distance = motionDistances.md,
) => ({
  from: {
    autoAlpha: reducedMotion ? 1 : 0,
    y: reducedMotion ? 0 : distance,
  },
  to: {
    autoAlpha: 1,
    y: 0,
    duration: reducedMotion
      ? motionDurations.reduced
      : motionDurations.comfortable,
    ease: motionEasings.easeOut,
    stagger: reducedMotion ? 0 : motionStaggers.default,
  },
});

const getPrefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const usePrefersReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(getPrefersReducedMotion);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReducedMotion(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return reducedMotion;
};
