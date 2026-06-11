import type { ReactNode } from "react";

type Props = {
  url?: string;
  children: ReactNode;
  className?: string;
};

/**
 * A playful browser-window chrome wrapper — traffic-light dots and a
 * fake address bar — used to frame portfolio mockups.
 */
export default function BrowserFrame({
  url = "novaforma.studio",
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border-2 border-ink bg-ivory shadow-pop-lg ${className}`}
    >
      <div className="flex items-center gap-2 border-b-2 border-ink bg-cream px-4 py-2.5">
        <span className="h-3 w-3 rounded-full border-2 border-ink bg-teal" />
        <span className="h-3 w-3 rounded-full border-2 border-ink bg-navy-mist" />
        <span className="h-3 w-3 rounded-full border-2 border-ink bg-ivory" />
        <span className="ml-3 hidden flex-1 truncate rounded-full border-2 border-ink/30 bg-ivory px-3 py-0.5 font-mono text-[10px] text-ink/60 sm:block">
          {url}
        </span>
      </div>
      {children}
    </div>
  );
}
