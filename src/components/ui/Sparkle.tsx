type Props = {
  className?: string;
  /** Tailwind text-* colour drives the fill via currentColor */
  size?: number;
};

/** A four-point twinkle star — decorative confetti used across the site. */
export default function Sparkle({ className = "", size = 24 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M12 0c.6 5.4 2.7 9.6 12 12-9.3 2.4-11.4 6.6-12 12-.6-5.4-2.7-9.6-12-12C9.3 9.6 11.4 5.4 12 0Z" />
    </svg>
  );
}
