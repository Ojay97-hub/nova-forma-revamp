import { useEffect, useRef } from "react";
import { gsap, revealWords } from "../lib/animations";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import BrowserFrame from "./ui/BrowserFrame";

type Project = {
  name: string;
  blurb: string;
  description: string;
  url: string;
  link: string;
  tags: string[];
  note: string;
  cover: string;
  featured?: boolean;
};

const PROJECTS: Project[] = [
  {
    name: "TDH Motors",
    blurb: "Performance & luxury car dealer — Aylesbury, Buckinghamshire.",
    description:
      "A full website for a hand-picked performance and luxury car dealership. Built with a browsable inventory, vehicle detail pages and an enquiry system, designed to feel as premium as the cars they sell.",
    url: "tdhmotors.co.uk",
    link: "https://www.tdhmotors.co.uk/",
    tags: ["Web Design", "Development", "E-commerce"],
    note: "Live & running 🏎️",
    cover: "linear-gradient(135deg, #0F2233 0%, #3FD2C6 100%)",
    featured: true,
  },
  {
    name: "Penmaen & Nicholaston Village Hall",
    blurb: "Community venue on the Gower Peninsula, Wales.",
    description:
      "A practical, accessible website for a local community hall on the Gower, helping residents find event information, check availability and make bookings. My first real-world client project.",
    url: "penmaenandnicholastonvh.co.uk",
    link: "https://www.penmaenandnicholastonvh.co.uk/",
    tags: ["Community", "Accessible", "Real Client"],
    note: "Live in the community 🏡",
    cover: "linear-gradient(135deg, #3FD2C6 0%, #F7FCFC 100%)",
  },
  {
    name: "Portfolio v2.0",
    blurb: "My own portfolio — where it all began.",
    description:
      "My personal portfolio website, showcasing projects, coursework and the journey that shaped my approach to web design and development. Built and iterated as I've grown.",
    url: "ojay97-hub.github.io",
    link: "https://ojay97-hub.github.io/portfolio-website-2.0",
    tags: ["Portfolio", "UI Design", "Personal"],
    note: "The origin story ✨",
    cover: "linear-gradient(135deg, #DCEFF2 0%, #138E8D 100%)",
  },
];

export default function Work() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const title = el.querySelector<HTMLElement>("[data-work-title]");
      if (title) revealWords(title, { reduced });
      if (reduced) return;

      gsap.utils.toArray<HTMLElement>("[data-project]").forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 60, rotate: -2 },
          {
            autoAlpha: 1,
            y: 0,
            rotate: 0,
            duration: 0.9,
            ease: "back.out(1.4)",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          },
        );
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="work" className="dotgrid relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-7">📂 My work</p>
            <h2 data-work-title className="display-lg max-w-2xl font-display font-extrabold text-ink">
              Real projects, built with care.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
            Three projects so far — from a community hall in Gower to a luxury
            car dealership in the Chilterns. Every one matters deeply to me.
          </p>
        </div>

        {/* Featured project — full width */}
        {PROJECTS.filter((p) => p.featured).map((p) => (
          <article
            key={p.name}
            data-project
            className="group relative mb-16 block md:mb-8"
          >
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block transition-transform duration-300 ease-bounce group-hover:-translate-y-2"
              aria-label={`Visit ${p.name} — ${p.blurb}`}
            >
              <span
                className="absolute -right-2 -top-3 z-30 rotate-6 rounded-lg border-2 border-ink bg-ivory px-3 py-1 font-mono text-[11px] font-bold text-ink shadow-pop transition-transform duration-300 group-hover:rotate-12"
              >
                {p.note}
              </span>

              <BrowserFrame url={p.url}>
                <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/7]" style={{ background: p.cover }}>
                  <div className="absolute inset-0 p-5 sm:p-8">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg border-2 border-paper/40 bg-paper/20" />
                      <div className="h-4 w-1/3 max-w-24 rounded-full border border-paper/30 bg-paper/20" />
                    </div>
                    <div className="mt-5 h-8 w-full max-w-[72%] rounded-lg border-2 border-paper/30 bg-paper/20 sm:mt-6 sm:h-9 sm:w-3/5" />
                    <div className="mt-3 h-5 w-1/2 rounded-lg border-2 border-paper/20 bg-paper/10 sm:h-6 sm:w-2/5" />
                    <div className="mt-5 flex max-w-full gap-3">
                      <div className="h-9 flex-1 rounded-full border-2 border-paper/40 bg-paper/30 sm:h-10 sm:max-w-32" />
                      <div className="h-9 flex-1 rounded-full border-2 border-paper/20 bg-paper/10 sm:h-10 sm:max-w-28" />
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-2 sm:bottom-8 sm:left-auto sm:right-8 sm:gap-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 rounded-xl border-2 border-paper/30 bg-paper/15 sm:h-20 sm:w-28" />
                      ))}
                    </div>
                  </div>
                </div>
              </BrowserFrame>
            </a>

            <div className="mt-5 flex flex-wrap items-start justify-between gap-3 px-1">
              <div>
                <h3 className="font-display text-2xl font-extrabold text-ink group-hover:text-teal-deep">
                  {p.name}
                </h3>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink-soft">{p.description}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full border-2 border-ink bg-cream px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-eyebrow text-ink">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}

        {/* Remaining projects — two column grid */}
        <div className="grid gap-y-16 gap-x-8 md:grid-cols-2 md:gap-y-8">
          {PROJECTS.filter((p) => !p.featured).map((p, i) => (
            <article
              key={p.name}
              data-project
              className={`group relative block ${i % 2 === 1 ? "md:translate-y-10" : ""}`}
            >
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block transition-transform duration-300 ease-bounce group-hover:-translate-y-2 group-hover:rotate-[-1deg]"
                aria-label={`Visit ${p.name} — ${p.blurb}`}
              >
                <span
                  className="absolute -right-2 -top-3 z-30 rotate-6 rounded-lg border-2 border-ink bg-ivory px-3 py-1 font-mono text-[11px] font-bold text-ink shadow-pop transition-transform duration-300 group-hover:rotate-12"
                >
                  {p.note}
                </span>

                <BrowserFrame url={p.url}>
                  <div className="relative aspect-[16/10] overflow-hidden" style={{ background: p.cover }}>
                    <div className="absolute inset-0 p-5">
                      <div className="h-3.5 w-20 rounded-full border border-ink/30 bg-ivory/80" />
                      <div className="mt-4 h-6 w-4/5 rounded-lg border-2 border-ink/30 bg-ivory/80" />
                      <div className="mt-2 h-5 w-3/5 rounded-lg border border-ink/20 bg-ivory/60" />
                      <div className="mt-4 flex gap-2">
                        <div className="h-8 w-24 rounded-full border-2 border-ink/50 bg-ink/70" />
                        <div className="h-8 w-20 rounded-full border-2 border-ink/30 bg-ivory/70" />
                      </div>
                    </div>
                  </div>
                </BrowserFrame>
              </a>

              <div className="mt-7 px-1 md:mt-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-display text-xl font-extrabold text-ink group-hover:text-teal-deep">
                    {p.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="rounded-full border-2 border-ink bg-cream px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-eyebrow text-ink">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{p.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
