import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { gsap, splitWords } from "../lib/animations";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import MagneticButton from "./MagneticButton";
import LogoMark from "./ui/LogoMark";
// Lazy-loaded so three.js stays out of the critical bundle
const HeroScene = lazy(() => import("./three/HeroScene"));

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let timeout = 0;

    const ctx = gsap.context(() => {
      const h1 = el.querySelector<HTMLElement>("[data-hero-title]");
      const words = h1 ? splitWords(h1) : [];
      if (reduced) return;

      timeout = window.setTimeout(() => {
        // Entrance: words bounce up, followed by copy, CTAs, and meta.
        gsap
          .timeline({ defaults: { ease: "back.out(1.5)" } })
          .fromTo(
            words,
            { yPercent: 120, rotate: -6 },
            { yPercent: 0, rotate: 0, duration: 0.8, stagger: 0.05 },
          )
          .fromTo("[data-hero-copy]", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
          .fromTo("[data-hero-cta] > *", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 }, "-=0.4")
          .fromTo("[data-hero-meta]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, "-=0.3");

        // Gentle parallax: the 3D logo drifts as the hero scrolls out.
        gsap.to("[data-hero-scene]", {
          yPercent: 14,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
      }, 900);
    }, el);

    return () => {
      window.clearTimeout(timeout);
      ctx.revert();
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;

    const reveal = () => setShowScene(true);
    const timer = window.setTimeout(reveal, 4200);
    window.addEventListener("pointerdown", reveal, { once: true, passive: true });
    window.addEventListener("keydown", reveal, { once: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", reveal);
      window.removeEventListener("keydown", reveal);
    };
  }, [reduced]);

  return (
    <section
      ref={root}
      id="top"
      className="dotgrid relative flex min-h-[100svh] flex-col items-stretch justify-center overflow-hidden lg:items-center"
    >
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-teal-soft/30 to-transparent" />

      {/* 3D logo — contained on mobile, full-bleed to the right on desktop */}
      <div
        data-hero-scene
        aria-hidden
        className="pointer-events-auto relative order-2 z-10 mx-auto -mt-8 h-[380px] w-full max-w-md opacity-95 sm:h-[430px] lg:absolute lg:inset-y-20 lg:right-0 lg:order-none lg:mt-0 lg:h-auto lg:max-w-none lg:w-[52%] lg:z-20"
      >
        <Suspense fallback={null}>
          {showScene ? (
            <HeroScene animate={!reduced} />
          ) : (
            <div className="grid h-full w-full place-items-center">
              <LogoMark className="h-[min(78vw,360px)] w-[min(78vw,360px)] drop-shadow-[0_22px_42px_rgba(15,34,51,0.24)] lg:h-[min(38vw,520px)] lg:w-[min(38vw,520px)]" />
            </div>
          )}
        </Suspense>
      </div>

      <div className="relative z-10 order-1 mx-auto w-full max-w-6xl px-4 pb-8 pt-36 sm:px-8 lg:order-none lg:pb-24">
        <div className="max-w-xl lg:max-w-[48%]">
          <p className="eyebrow mb-7">
            <span className="text-teal-deep">✦</span> Web Design &amp; Development · UK
          </p>

          <h1
            data-hero-title
            className="display-xl font-display font-extrabold text-ink"
            style={{ overflowWrap: "break-word" }}
          >
            Tailoring digital experiences that actually work for you.
          </h1>

          <p data-hero-copy className="mt-8 max-w-sm text-lg leading-relaxed text-ink-soft">
            Hi, I&apos;m Owen &mdash; founder of Nova Forma Designs. I help small
            businesses, local organisations and independent projects get a clean,
            professional website they&apos;re proud to share.
          </p>

          <div data-hero-cta className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton href="#contact">Start a project</MagneticButton>
            <MagneticButton href="#work" variant="ghost">
              View my work
            </MagneticButton>
          </div>

          <div data-hero-meta className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-eyebrow text-ink-soft lg:mt-16">
            <span className="font-bold text-ink">nova forma</span>
            <span>&ldquo;new form&rdquo; ✶</span>
            <span aria-hidden className="hidden h-2 w-2 rounded-full bg-teal sm:block" />
            <span>Owen Cotter, Founder</span>
          </div>
        </div>
      </div>

    </section>
  );
}
