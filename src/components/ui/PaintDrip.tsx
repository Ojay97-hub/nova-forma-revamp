import type { CSSProperties } from "react";

/**
 * Paint dripping from the bottom of a section into the one below.
 *
 * The drips are part of the section itself, not an overlay: the section grows
 * by `--drip-h` (see `.drip-edge` in index.css) and that strip is masked to the
 * drip outline, so the section's own background (colour, dots, glow) flows
 * straight into the paint. A matching negative margin tucks the next section
 * underneath, so the page layout does not move.
 *
 * <PaintDripOutline /> draws the 2px ink rule along the drip edge, in place of
 * the straight rule that would otherwise sit at the seam.
 */

/**
 * One drip, described the way paint behaves: it breaks away from the edge
 * wide (`top`), is pulled thin by gravity (`neck`), and gathers into a heavier
 * bead at the bottom (`r`). `lean` drifts the bead sideways a little.
 */
type Drip = { cx: number; top: number; neck: number; r: number; tip: number; lean?: number };
type Board = { width: number; height: number; base: number; drips: Drip[]; waves: number[] };

// Hand-placed: two drips on the left, one on the right, deliberately unalike.
// A long thin strand sits beside a short, fat pooled drop; the right-hand
// drip is a medium run that leans. `waves` nudges the edge between drips so it
// never reads as a ruler line.
const DESKTOP: Board = {
  width: 1440,
  height: 120,
  base: 9,
  drips: [
    { cx: 56, top: 22, neck: 8, r: 7.5, tip: 119 }, // very long, thin strand
    { cx: 134, top: 24, neck: 12, r: 9.5, tip: 50 }, // short pooled drop
    { cx: 1248, top: 26, neck: 9, r: 8, tip: 90, lean: -3 }, // medium-long run
  ],
  waves: [3, 0, 4, -2],
};

const MOBILE: Board = {
  width: 400,
  height: 72,
  base: 6,
  drips: [
    { cx: 24, top: 14, neck: 5.5, r: 5.5, tip: 70 },
    { cx: 70, top: 17, neck: 8.5, r: 7, tip: 32 },
    { cx: 346, top: 17, neck: 6.5, r: 6, tip: 54, lean: -2 },
  ],
  waves: [2, 0, 3, -1],
};

const f = (n: number) => Math.round(n * 10) / 10;

function dripPath({ width: W, base: b, drips, waves }: Board) {
  let px = -2;
  let py = b;
  let d = `M -2 -2 L -2 ${b}`;

  // A long, gentle wave along the edge to (nx, b).
  const edgeTo = (nx: number, lift: number) => {
    const mx = (px + nx) / 2;
    const my = b + lift;
    d += ` C ${f(px + (mx - px) * 0.5)} ${f(py)} ${f(mx - (mx - px) * 0.45)} ${f(my)} ${f(mx)} ${f(my)}`;
    d += ` C ${f(mx + (nx - mx) * 0.45)} ${f(my)} ${f(nx - (nx - mx) * 0.5)} ${f(b)} ${f(nx)} ${f(b)}`;
    px = nx;
    py = b;
  };

  drips.forEach(({ cx, top, neck: nk, r, tip, lean = 0 }, i) => {
    const hwT = top / 2; // half-width where the drip leaves the edge
    const hwN = nk / 2; // half-width of the thin neck
    const sx = top * 0.8; // shoulders flare out into the edge...
    const sy = top * 0.5; // ...and drop away quickly
    const neckTop = b + sy;
    const neckEnd = Math.max(neckTop + 3, tip - r * 2.1);
    const ne = neckEnd - neckTop;
    const nc = cx + lean * 0.6; // the neck drifts partway towards the bead
    const bc = cx + lean; // bead centre

    edgeTo(cx - hwT - sx, waves[i] ?? 0);
    // Left shoulder, then the long taper down to the neck.
    d += ` C ${f(cx - hwT - sx * 0.45)} ${f(b)} ${f(cx - hwT)} ${f(neckTop - sy * 0.55)} ${f(cx - hwT)} ${f(neckTop)}`;
    d += ` C ${f(cx - hwT + (hwT - hwN) * 0.1)} ${f(neckTop + ne * 0.45)} ${f(nc - hwN)} ${f(neckEnd - ne * 0.25)} ${f(nc - hwN)} ${f(neckEnd)}`;
    // Neck swells into the round bead, then back up the right side.
    d += ` C ${f(nc - hwN)} ${f(neckEnd + r * 0.5)} ${f(bc - r)} ${f(tip - r * 1.45)} ${f(bc - r)} ${f(tip - r)}`;
    d += ` A ${f(r)} ${f(r)} 0 0 0 ${f(bc + r)} ${f(tip - r)}`;
    d += ` C ${f(bc + r)} ${f(tip - r * 1.45)} ${f(nc + hwN)} ${f(neckEnd + r * 0.5)} ${f(nc + hwN)} ${f(neckEnd)}`;
    d += ` C ${f(nc + hwN)} ${f(neckEnd - ne * 0.25)} ${f(cx + hwT - (hwT - hwN) * 0.1)} ${f(neckTop + ne * 0.45)} ${f(cx + hwT)} ${f(neckTop)}`;
    d += ` C ${f(cx + hwT)} ${f(neckTop - sy * 0.55)} ${f(cx + hwT + sx * 0.45)} ${f(b)} ${f(cx + hwT + sx)} ${f(b)}`;
    px = cx + hwT + sx;
  });

  edgeTo(W + 2, waves[drips.length] ?? 0);
  return `${d} L ${W + 2} -2 Z`;
}

const PATHS = { sm: dripPath(MOBILE), lg: dripPath(DESKTOP) };

const maskUrl = (board: Board, path: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${board.width} ${board.height}" preserveAspectRatio="none"><path d="${path}"/></svg>`,
  )}")`;

/** Inline style for the section that drips: hands the mask shapes to `.drip-edge`. */
export const paintDripStyle = {
  "--drip-mask-sm": maskUrl(MOBILE, PATHS.sm),
  "--drip-mask-lg": maskUrl(DESKTOP, PATHS.lg),
} as CSSProperties;

function Outline({ board, path, className }: { board: Board; path: string; className: string }) {
  return (
    <svg
      viewBox={`0 0 ${board.width} ${board.height}`}
      preserveAspectRatio="none"
      className={`absolute inset-0 h-full w-full overflow-hidden ${className}`}
      focusable="false"
    >
      {/* 4px stroke centred on the edge; the section's mask trims the outer
          half, leaving a crisp 2px rule that follows every drip. */}
      <path d={path} fill="none" stroke="currentColor" strokeWidth="4" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** The ink rule along the drip edge. Place it last inside the dripping section. */
export function PaintDripOutline() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[var(--drip-h)] text-ink">
      <Outline board={MOBILE} path={PATHS.sm} className="sm:hidden" />
      <Outline board={DESKTOP} path={PATHS.lg} className="hidden sm:block" />
    </div>
  );
}
