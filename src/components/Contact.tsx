import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap, revealWords, revealUp } from "../lib/animations";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import MagneticButton from "./MagneticButton";
import Sparkle from "./ui/Sparkle";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const title = el.querySelector<HTMLElement>("[data-contact-title]");
      if (title) revealWords(title, { reduced });
      revealUp("[data-contact-block]", { reduced, trigger: el, stagger: 0.15 });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const body = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
    } catch {
      setError("Something went wrong. Please try emailing me directly.");
    } finally {
      setLoading(false);
    }
  };

  const field =
    "w-full rounded-xl border-2 border-ink bg-cream px-4 py-3 text-sm font-medium text-ink placeholder:text-ink/40 transition-colors duration-200 focus:border-teal focus:bg-ivory focus:outline-none";

  return (
    <section ref={root} id="contact" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="absolute -bottom-[20%] right-[-8%] h-[55vmin] w-[55vmin] rounded-full bg-teal-soft/55 blur-[120px]" />
      <Sparkle className="absolute left-[8%] top-[18%] hidden animate-spin-slow text-teal lg:block" size={44} />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <p className="eyebrow mb-7">💌 Get in touch</p>
          <h2 data-contact-title className="display-lg font-display font-extrabold text-ink">
            Ready to start your project? Let's talk.
          </h2>
          <p data-contact-block className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            I'd love to hear about what you're building. Drop me a message and
            I'll get back to you — no jargon, no pressure, just an honest
            conversation about how I can help.
          </p>

          <dl data-contact-block className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="min-w-0 rounded-2xl border-2 border-ink bg-ivory p-4 shadow-pop">
              <dt className="font-mono text-[10px] font-bold uppercase tracking-eyebrow text-teal-deep">
                Email
              </dt>
              <dd className="mt-1">
                <a
                  href="mailto:owen.cotter@novaformadesigns.com"
                  className="break-words text-sm font-semibold text-ink underline decoration-teal decoration-2 underline-offset-4 hover:text-teal-deep"
                >
                  owen.cotter@novaformadesigns.com
                </a>
              </dd>
            </div>
            <div className="min-w-0 rounded-2xl border-2 border-ink bg-ivory p-4 shadow-pop">
              <dt className="font-mono text-[10px] font-bold uppercase tracking-eyebrow text-teal-deep">
                Phone
              </dt>
              <dd className="mt-1">
                <a
                  href="tel:+447548290644"
                  className="text-sm font-semibold text-ink underline decoration-teal decoration-2 underline-offset-4 hover:text-teal-deep"
                >
                  +44 7548 290644
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div data-contact-block>
          {sent ? (
            <div className="relative flex h-full min-h-[340px] flex-col items-start justify-center rounded-3xl border-2 border-ink bg-teal-soft p-10 shadow-pop-lg">
              <span className="text-5xl">🎉</span>
              <p className="mt-4 font-display text-3xl font-extrabold text-ink">
                Message sent!
              </p>
              <p className="mt-3 text-sm font-medium text-ink-soft">
                Thanks for reaching out. I'll be in touch soon — usually within
                one working day. Looking forward to hearing more about your
                project!
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="rounded-3xl border-2 border-ink bg-ivory p-7 shadow-pop-lg sm:p-9">
              <div className="grid gap-5">
                <div>
                  <label htmlFor="name" className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-eyebrow text-ink">
                    Name *
                  </label>
                  <input id="name" name="name" required autoComplete="name" className={field} placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-eyebrow text-ink">
                    Email *
                  </label>
                  <input id="email" name="email" type="email" required autoComplete="email" className={field} placeholder="your.email@example.com" />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-eyebrow text-ink">
                    Phone
                  </label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" className={field} placeholder="+44 7XXX XXXXXX" />
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-eyebrow text-ink">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className={field}
                    placeholder="Tell me about your project..."
                  />
                </div>
                {error && (
                  <p className="text-sm font-medium text-red-600">{error}</p>
                )}
                <MagneticButton type="submit" className="justify-center" disabled={loading}>
                  {loading ? "Sending…" : "Send message"}
                </MagneticButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
