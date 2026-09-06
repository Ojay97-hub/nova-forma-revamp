import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./lib/animations";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Work from "./components/Work";
import Process from "./components/Process";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  const reduced = usePrefersReducedMotion();
  /** True the moment the visitor hits "Enter the site". */
  const [entered, setEntered] = useState(false);
  /** The loading screen outlives `entered` by the length of its exit fade. */
  const [showLoader, setShowLoader] = useState(true);

  const site = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => setEntered(true), []);
  const handleExited = useCallback(() => setShowLoader(false), []);

  // Keep the page behind the gate out of the tab order too, not just hidden.
  // Set imperatively because React 18's types don't carry the `inert` prop.
  useEffect(() => {
    if (site.current) site.current.inert = !entered;
  }, [entered]);

  // Nothing scrolls while the loading screen is up, or mid-reveal.
  useEffect(() => {
    if (!showLoader) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [showLoader]);

  // Lenis drives scrolling; GSAP's ticker drives Lenis, and Lenis
  // notifies ScrollTrigger — one rAF loop, no fighting schedulers.
  useEffect(() => {
    if (reduced || !entered) return; // native scroll for reduced-motion users

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      lenis = new Lenis({ lerp: 0.1, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);

      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    };

    // The heavy lifting is already done behind the loading screen, so smooth
    // scroll can come online just after the reveal settles.
    const idle = window.setTimeout(start, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(idle);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, [reduced, entered]);

  return (
    <>
      {showLoader && <Loader onEnter={handleEnter} onExited={handleExited} />}

      {/* Mounted from the start — three.js, fonts and layout all warm up behind
          the loading screen so entering the site costs nothing. */}
      <div ref={site} aria-hidden={!entered}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:border-2 focus:border-ink focus:bg-teal-soft focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ink"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">
          <Hero entered={entered} />
          <Services />
          <Work />
          <Process />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
