import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, revealWords } from "../lib/animations";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type Step = {
  n: string;
  title: string;
  copy: string;
  icon: string;
  accent: string;
};

const STEPS: Step[] = [
  {
    n: "01",
    title: "Chat",
    icon: "💬",
    accent: "bg-teal",
    copy: "We have a friendly conversation about your project — your goals, your audience, your budget. No jargon, no pressure.",
  },
  {
    n: "02",
    title: "Sketch",
    icon: "✏️",
    accent: "bg-navy-mist",
    copy: "I map out a clear plan and rough wireframes. Cheap to change at this stage, and we're both aligned before anything is built.",
  },
  {
    n: "03",
    title: "Design",
    icon: "🎨",
    accent: "bg-teal-soft",
    copy: "High-fidelity screens with your colour, type and personality. We refine together until it feels right and represents you.",
  },
  {
    n: "04",
    title: "Build",
    icon: "🛠️",
    accent: "bg-ivory",
    copy: "Clean, responsive, accessible code — tested across all devices. Your site is built to be fast and easy to maintain.",
  },
  {
    n: "05",
    title: "Launch",
    icon: "🚀",
    accent: "bg-teal",
    copy: "Final checks, accessibility review and go-live on a date that suits you. I'll walk you through everything before we ship.",
  },
  {
    n: "06",
    title: "Support",
    icon: "🌱",
    accent: "bg-navy-mist",
    copy: "Honest support as your site grows. I'm not going anywhere — and I'll always give you a straight answer.",
  },
];

export default function Process() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr) return;

    const ctx = gsap.context(() => {
      const title = el.querySelector<HTMLElement>("[data-process-title]");
      if (title) revealWords(title, { reduced });
      if (reduced) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const distance = () => tr.scrollWidth - el.clientWidth;
        // Lenis already smooths the scroll, so the tween tracks it 1:1
        // (scrub: true) — a numeric scrub here double-smooths and makes
        // direction changes feel laggy.
        const tween = gsap.to(tr, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
          gsap.fromTo(
            step,
            { autoAlpha: 0, y: 40, rotate: -2 },
            {
              autoAlpha: 1,
              y: 0,
              rotate: 0,
              duration: 0.8,
              ease: "back.out(1.4)",
              scrollTrigger: { trigger: step, start: "top 88%", once: true },
            },
          );
        });
      });

      return () => mm.revert();
    }, el);

    const t = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      clearTimeout(t);
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section ref={root} id="process" className="overflow-hidden bg-ink text-cream">
      <div className="flex min-h-[100svh] flex-col justify-center py-24 lg:py-0">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-cream bg-ink px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-eyebrow text-cream">
            ✨ How I work
          </span>
          <h2 data-process-title className="display-lg mt-7 max-w-3xl font-display font-extrabold text-cream">
            A clear, honest process — no surprises.
          </h2>
        </div>

        <div
          ref={track}
          className="mt-14 flex flex-col gap-6 px-5 sm:px-8 lg:w-max lg:flex-row lg:gap-8 lg:will-change-transform lg:pl-[max(1.25rem,calc((100vw-72rem)/2+2rem))] lg:pr-24"
        >
          {STEPS.map((s) => (
            <article
              key={s.n}
              data-step
              className="relative flex flex-col justify-between rounded-3xl border-2 border-ink bg-ivory p-8 text-ink shadow-pop-lg lg:h-[320px] lg:w-[340px] lg:shrink-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-ink text-xl shadow-pop sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl ${s.accent}`}
                    aria-hidden
                  >
                    {s.icon}
                  </span>
                  <h3 className="font-display text-2xl font-extrabold text-ink sm:text-3xl lg:hidden">
                    {s.title}
                  </h3>
                </div>
                <span className="font-display text-5xl font-extrabold text-ink/10">{s.n}</span>
              </div>
              <div>
                <h3 className="hidden font-display text-3xl font-extrabold text-ink lg:block">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{s.copy}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-10 hidden w-full max-w-6xl px-8 font-mono text-[11px] font-bold uppercase tracking-eyebrow text-cream/50 lg:block">
          Keep scrolling →
        </p>
      </div>
    </section>
  );
}
