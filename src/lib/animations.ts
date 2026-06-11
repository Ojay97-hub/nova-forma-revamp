import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Wraps each word of an element in an overflow-hidden mask so headlines
 * can bounce up word-by-word. Done once per element (idempotent).
 */
export function splitWords(el: HTMLElement): HTMLSpanElement[] {
  if (el.dataset.split === "true") {
    return Array.from(el.querySelectorAll<HTMLSpanElement>(".word-mask > span"));
  }
  const words = (el.textContent ?? "").trim().split(/\s+/);
  el.textContent = "";
  const inner: HTMLSpanElement[] = [];
  words.forEach((word, i) => {
    const mask = document.createElement("span");
    mask.className = "word-mask";
    const span = document.createElement("span");
    span.textContent = word;
    mask.appendChild(span);
    el.appendChild(mask);
    if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    inner.push(span);
  });
  el.dataset.split = "true";
  return inner;
}

/** Scroll-triggered bouncy word reveal for a heading. */
export function revealWords(
  el: HTMLElement,
  opts: { reduced: boolean; delay?: number; trigger?: Element } = { reduced: false },
) {
  const words = splitWords(el);
  if (opts.reduced) return;
  gsap.fromTo(
    words,
    { yPercent: 115, rotate: -4 },
    {
      yPercent: 0,
      rotate: 0,
      duration: 0.9,
      ease: "back.out(1.6)",
      stagger: 0.05,
      delay: opts.delay ?? 0,
      scrollTrigger: {
        trigger: opts.trigger ?? el,
        start: "top 85%",
        once: true,
      },
    },
  );
}

/** Generic scroll-triggered fade-up for blocks, paragraphs. */
export function revealUp(
  targets: gsap.TweenTarget,
  opts: { reduced: boolean; trigger: Element; stagger?: number; y?: number },
) {
  if (opts.reduced) return;
  gsap.fromTo(
    targets,
    { autoAlpha: 0, y: opts.y ?? 30 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: opts.stagger ?? 0.1,
      scrollTrigger: { trigger: opts.trigger, start: "top 82%", once: true },
    },
  );
}

/** Playful pop-in for stickers, badges and cards — scales up with a spring. */
export function popIn(
  targets: gsap.TweenTarget,
  opts: { reduced: boolean; trigger: Element; stagger?: number },
) {
  if (opts.reduced) return;
  gsap.fromTo(
    targets,
    { autoAlpha: 0, scale: 0.4, rotate: -8 },
    {
      autoAlpha: 1,
      scale: 1,
      rotate: 0,
      duration: 0.7,
      ease: "back.out(2.2)",
      stagger: opts.stagger ?? 0.08,
      scrollTrigger: { trigger: opts.trigger, start: "top 85%", once: true },
    },
  );
}

export { gsap, ScrollTrigger };
