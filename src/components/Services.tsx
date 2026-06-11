import { useEffect, useRef } from "react";
import { gsap, revealWords, popIn } from "../lib/animations";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type Service = {
  title: string;
  copy: string;
  icon: string;
  badge: string;
  accent: string;
};

const SERVICES: Service[] = [
  {
    title: "Web Design",
    copy: "Beautiful, user-friendly websites that engage your audience, represent your brand, and are a pleasure to use.",
    icon: "🎨",
    badge: "Most loved",
    accent: "bg-teal",
  },
  {
    title: "Responsive Development",
    copy: "Seamless, reliable experiences across every device — desktop, tablet and mobile — built with clean, modern code.",
    icon: "📱",
    badge: "Every device",
    accent: "bg-navy-mist",
  },
  {
    title: "Custom Solutions",
    copy: "No templates, no shortcuts. Each site is tailored specifically around your business needs and your users.",
    icon: "⚙️",
    badge: "Bespoke",
    accent: "bg-teal-soft",
  },
  {
    title: "Brand Identity",
    copy: "Cohesive visual identities — colour, type and style — that reflect your values and make you instantly recognisable.",
    icon: "✨",
    badge: "Stand out",
    accent: "bg-ivory",
  },
];

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const title = el.querySelector<HTMLElement>("[data-services-title]");
      if (title) revealWords(title, { reduced });
      popIn("[data-service-card]", { reduced, trigger: el, stagger: 0.07 });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="eyebrow mb-7">🧰 What I offer</p>
        <h2 data-services-title className="display-lg max-w-3xl font-display font-extrabold text-ink">
          Comprehensive digital design to help your business thrive online.
        </h2>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <li key={s.title}>
              <article
                data-service-card
                className="group relative flex h-full flex-col rounded-3xl border-2 border-ink bg-ivory p-7 shadow-pop-lg transition-transform duration-300 ease-bounce hover:-translate-y-1.5 hover:rotate-[-1deg]"
              >
                <span className="absolute right-4 top-4 rounded-full border-2 border-ink bg-cream px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-eyebrow text-ink">
                  {s.badge}
                </span>

                <span
                  className={`grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink text-2xl shadow-pop transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110 ${s.accent}`}
                  aria-hidden
                >
                  {s.icon}
                </span>

                <h3 className="mt-5 font-display text-2xl font-extrabold text-ink">{s.title}</h3>
                <p className="mt-2 flex-1 text-base leading-relaxed text-ink-soft">{s.copy}</p>

                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-eyebrow text-teal-deep">
                  Learn more
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
