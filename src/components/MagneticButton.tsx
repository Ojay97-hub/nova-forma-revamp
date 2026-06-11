import {
  useRef,
  useEffect,
  type ReactNode,
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes,
} from "react";
import { gsap } from "../lib/animations";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type Variant = "solid" | "ghost" | "ink";

type Props = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * Magnetic CTA. The element eases toward the cursor while hovered
 * (quickTo = GSAP's rAF-batched setter, so no layout thrash) and
 * springs back on leave. Disabled for touch + reduced motion.
 */
export default function MagneticButton({
  children,
  href,
  variant = "solid",
  className = "",
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || window.matchMedia("(pointer: coarse)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.4);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  const base =
    "group relative inline-flex items-center gap-2.5 rounded-full border-2 border-ink px-7 py-3.5 font-sans text-sm font-bold shadow-pop transition-[transform,background-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-pop-lg active:translate-y-0.5 active:shadow-none";
  const styles: Record<Variant, string> = {
    solid: "bg-teal text-navy hover:bg-teal-soft dark:hover:bg-teal",
    ink: "bg-navy text-paper hover:bg-teal hover:text-navy",
    ghost: "bg-ivory text-ink hover:bg-navy-mist",
  };
  const cls = `${base} ${styles[variant]} ${className}`;

  const inner = (
    <>
      <span>{children}</span>
      <span
        aria-hidden
        className="inline-block transition-transform duration-300 ease-out-expo group-hover:translate-x-1 group-hover:rotate-12"
      >
        →
      </span>
    </>
  );

  if (href) {
    return (
      <a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} className={cls} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <button ref={ref as React.RefObject<HTMLButtonElement>} className={cls} {...rest}>
      {inner}
    </button>
  );
}
