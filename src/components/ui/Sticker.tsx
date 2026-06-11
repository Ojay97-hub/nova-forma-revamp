import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Rotation in degrees for that hand-placed sticker feel */
  rotate?: number;
};

/**
 * A small rotated label chip with chunky border + offset shadow.
 * Used for badges, tags and floating captions.
 */
export default function Sticker({ children, className = "", rotate = -4 }: Props) {
  return (
    <span
      style={{ rotate: `${rotate}deg` }}
      className={`inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1
        font-mono text-[11px] font-bold uppercase tracking-eyebrow shadow-pop ${className}`}
    >
      {children}
    </span>
  );
}
