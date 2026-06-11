import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** Reactive prefers-reduced-motion flag. All GSAP timelines and
 *  Three.js animation loops check this before moving anything. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
