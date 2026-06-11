import LogoMark from "./ui/LogoMark";

const QUICK_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-navy text-paper">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_auto_auto]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-teal bg-cream">
                <LogoMark className="h-8 w-8" />
              </span>
              <p className="font-display text-2xl font-extrabold text-paper">
                nova forma designs
              </p>
            </div>
            <p className="mt-2 max-w-xs text-sm text-paper/60">
              Tailoring digital experiences for small businesses, local
              organisations and independent projects across the UK.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-eyebrow text-paper/50">
              Quick links
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm font-semibold text-paper/70 transition-colors hover:text-teal">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-eyebrow text-paper/50">
              Connect
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              <li>
                <a
                  href="mailto:owen.cotter@novaformadesigns.com"
                  className="text-sm font-semibold text-paper/70 transition-colors hover:text-teal"
                >
                  owen.cotter@novaformadesigns.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+447548290644"
                  className="text-sm font-semibold text-paper/70 transition-colors hover:text-teal"
                >
                  +44 7548 290644
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div aria-hidden className="mt-14 select-none leading-none tracking-tight">
          <p className="font-display text-[14vw] font-extrabold leading-none tracking-tight text-paper/50 lg:text-[9.5rem]">
            Nova Forma
          </p>
          <p className="font-display text-[4vw] font-semibold tracking-widest text-paper/25 lg:text-[2.6rem]">
            Designs
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t-2 border-paper/10 pt-6 font-mono text-[11px] uppercase tracking-eyebrow text-paper/70">
          <span>© {new Date().getFullYear()} Nova Forma Designs. All rights reserved.</span>
          <a href="#top" className="font-bold text-paper/60 transition-colors hover:text-teal">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
