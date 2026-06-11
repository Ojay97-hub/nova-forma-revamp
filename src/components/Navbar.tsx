import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/animations";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import LogoMark from "./ui/LogoMark";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
];

export default function Navbar() {
  const nav = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = nav.current;
    if (!el || reduced) return;

    gsap.fromTo(
      el,
      { y: -24, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out", delay: 0.1 },
    );
  }, [reduced]);

  const close = () => setOpen(false);

  return (
    <header ref={nav} className="absolute inset-x-0 top-0 z-50 px-4 pt-4 sm:px-8">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between rounded-full border-2 border-ink bg-ivory/90 px-4 py-2.5 shadow-pop backdrop-blur-md sm:px-5"
      >
        <a href="#top" className="group flex items-center gap-2" onClick={close}>
          <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-ivory transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            <LogoMark className="h-7 w-7" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-ink">
            Nova Forma
          </span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-semibold text-ink-soft transition-colors duration-200 hover:text-teal-deep"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="rounded-full border-2 border-ink bg-teal px-4 py-2 text-sm font-bold text-ink shadow-pop transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-pop-lg active:translate-y-0.5 active:shadow-none"
            >
              Let's chat
            </a>
          </li>
        </ul>

        <button
          className="rounded-full border-2 border-ink bg-navy-mist px-3 py-1.5 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="font-mono text-xs font-bold uppercase tracking-eyebrow text-ink">
            {open ? "Close" : "Menu"}
          </span>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="mx-auto mt-2 max-w-6xl rounded-3xl border-2 border-ink bg-ivory p-6 shadow-pop-lg md:hidden"
        >
          <ul className="flex flex-col gap-4">
            {[...LINKS, { label: "Contact", href: "#contact" }].map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={close}
                  className="font-display text-2xl font-extrabold text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
