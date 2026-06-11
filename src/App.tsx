import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./lib/animations";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
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

  // Lenis drives scrolling; GSAP's ticker drives Lenis, and Lenis
  // notifies ScrollTrigger — one rAF loop, no fighting schedulers.
  useEffect(() => {
    if (reduced) return; // native scroll for reduced-motion users

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

    const idle = window.setTimeout(start, 1800);

    return () => {
      cancelled = true;
      window.clearTimeout(idle);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, [reduced]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:border-2 focus:border-ink focus:bg-teal-soft focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ink"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Services />
        <Work />
        <Process />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
