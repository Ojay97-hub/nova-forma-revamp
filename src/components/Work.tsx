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
  /** Gradient shown behind the screenshot while it loads. */
  cover: string;
  image: string;
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
    image: "/work/tdh-motors.jpg",
    featured: true,
  },
  {
    name: "Eden Electrical",
    blurb: "Solar, battery storage & EV charging — Kent and the South East.",
    description:
      "A trust-first site for a certified renewables installer. Built with an interactive cost calculator and a quote flow, so homeowners can price up solar, battery storage or EV charging before they ever pick up the phone.",
    url: "eden-electrical.com",
    link: "https://www.eden-electrical.com/",
    tags: ["Web Design", "Development", "Lead Gen"],
    note: "Powering Kent ⚡",
    cover: "linear-gradient(135deg, #1E3A2B 0%, #E3C567 100%)",
    image: "/work/eden-electrical.jpg",
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
    image: "/work/penmaen-village-hall.jpg",
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
    image: "/work/portfolio-v2.jpg",
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

  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

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
            Four projects so far — from a community hall in Gower to a luxury
            car dealership in the Chilterns. Every one matters deeply to me.
          </p>
        </div>

        {/* Featured project — full width */}
        {featured.map((p) => (
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
                <div className="relative aspect-[16/10] overflow-hidden" style={{ background: p.cover }}>
                  <img
                    src={p.image}
                    alt={`Homepage of the ${p.name} website`}
                    width={2000}
                    height={1250}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
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

        {/* Remaining projects — three across on large screens */}
        <div className="grid gap-y-14 gap-x-6 lg:grid-cols-3 lg:gap-y-8">
          {rest.map((p, i) => (
            <article
              key={p.name}
              data-project
              className={`group relative block ${i === 1 ? "lg:translate-y-10" : ""}`}
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
                    <img
                      src={p.image}
                      alt={`Homepage of the ${p.name} website`}
                      width={1400}
                      height={875}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                </BrowserFrame>
              </a>

              <div className="mt-7 px-1 lg:mt-4">
                <h3 className="font-display text-xl font-extrabold leading-tight text-ink group-hover:text-teal-deep">
                  {p.name}
                </h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border-2 border-ink bg-cream px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-eyebrow text-ink">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{p.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
