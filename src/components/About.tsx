import { useEffect, useRef } from "react";
import { gsap, revealWords, revealUp, popIn } from "../lib/animations";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import Sparkle from "./ui/Sparkle";

const PILLARS = [
  { icon: "🤝", label: "Personal, careful service" },
  { icon: "✏️", label: "Clean, practical design" },
  { icon: "📱", label: "Responsive, accessible websites" },
  { icon: "🌱", label: "Honest support as your site grows" },
];

export default function About() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const title = el.querySelector<HTMLElement>("[data-about-title]");
      if (title) revealWords(title, { reduced });
      revealUp("[data-about-copy]", { reduced, trigger: el, stagger: 0.12 });
      popIn("[data-about-pillar]", { reduced, trigger: el, stagger: 0.08 });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="about" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="absolute -left-[8%] top-[20%] h-[45vmin] w-[45vmin] rounded-full bg-teal-soft/50 blur-[110px]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Avatar card */}
        <div className="relative mx-auto w-full max-w-sm">
          <div className="animate-bob-tilt rounded-blob border-2 border-ink bg-gradient-to-br from-teal to-ink p-1 shadow-pop-lg">
            <div className="grid aspect-square place-items-center rounded-blob bg-ivory">
              <span className="font-display text-[8rem] font-extrabold leading-none text-ink sm:text-[10rem]">
                OC
              </span>
            </div>
          </div>
          <span className="absolute -right-3 top-6 rotate-6 rounded-full border-2 border-ink bg-ivory px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-eyebrow text-ink shadow-pop">
            👋 Hi, I'm Owen!
          </span>
          <span className="absolute -bottom-3 left-2 -rotate-6 rounded-full border-2 border-ink bg-ivory px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-eyebrow text-ink shadow-pop">
            Founder &amp; Developer
          </span>
          <Sparkle className="absolute -left-4 top-1/3 animate-spin-slow text-teal" size={32} />
        </div>

        <div>
          <p className="eyebrow mb-7">🙋 About me</p>
          <h2 data-about-title className="display-lg font-display font-extrabold text-ink">
            I make websites that work — and feel like{" "}
            <span className="marker-pink">you</span>.
          </h2>

          <p data-about-copy className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            Founded by Owen Cotter, Nova Forma Designs is a UK-based web
            design and development business helping small businesses, local
            organisations and independent projects build a clear, professional
            online presence.
          </p>
          <p data-about-copy className="mt-4 max-w-lg text-base leading-relaxed text-ink-soft">
            I&apos;m at an early and exciting stage of my career, which means
            every project gets my full attention. So far I&apos;ve built a
            community venue site for a Gower village hall, a full inventory
            website for a luxury car dealer in the Chilterns, and my own
            portfolio &mdash; and I&apos;m always looking for the next one.
          </p>
          <p data-about-copy className="mt-4 max-w-lg text-base leading-relaxed text-ink-soft">
            I believe good websites don&apos;t need to be overcomplicated. They
            need to look professional, communicate clearly, and make it easier
            for people to find, trust, and contact you. That&apos;s the kind of
            work I aim to create.
          </p>

          <ul className="mt-10 flex flex-wrap gap-3">
            {PILLARS.map((p) => (
              <li
                key={p.label}
                data-about-pillar
                className="flex items-center gap-2 rounded-full border-2 border-ink bg-ivory px-4 py-2 font-sans text-sm font-semibold text-ink shadow-pop"
              >
                <span aria-hidden>{p.icon}</span>
                {p.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
