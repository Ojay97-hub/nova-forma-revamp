import { useCallback, useEffect, useRef, useState } from "react";
import MagneticButton from "./MagneticButton";
import LogoMark from "./ui/LogoMark";

type StageId = "type" | "scene" | "assets";

type Stage = {
  id: StageId;
  label: string;
  /** Share of the bar this stage is worth. The three weights sum to 100. */
  weight: number;
};

/**
 * Real work the visitor is actually waiting on — every line ticks over the
 * moment its promise lands, so the bar tracks the download instead of miming it.
 */
const STAGES: Stage[] = [
  { id: "type", label: "Brand typefaces", weight: 22 },
  { id: "scene", label: "3D logo geometry", weight: 52 },
  { id: "assets", label: "Page assets", weight: 26 },
];

/** The bar never fills faster than this, so a warm cache still feels deliberate. */
const MIN_FILL_MS = 1700;
/**
 * Escape hatches, per stage. Typefaces and stray assets are cosmetic — the page
 * is fine without them, so they get a short leash. The scene is the whole point
 * of gating entry, so it gets room to land on a slow connection; its timeout is
 * only there so a dead CDN can't strand anyone at 74%.
 */
const SECONDARY_TIMEOUT_MS = 6000;
const SCENE_TIMEOUT_MS = 25000;
/** Matches the overlay's exit transition (duration-700) below. */
const EXIT_MS = 700;

/** Where each stage's segment starts and ends along the bar. */
const BOUNDS = (() => {
  let filled = 0;
  return STAGES.map((stage) => {
    const start = filled;
    filled += stage.weight;
    return { id: stage.id, start, end: filled };
  });
})();

export default function Loader({
  onEnter,
  onExited,
}: {
  /** Fired the instant the visitor commits — the site animates in behind us. */
  onEnter: () => void;
  /** Fired once the veil has finished lifting and this can unmount. */
  onExited: () => void;
}) {
  const [done, setDone] = useState<Record<StageId, boolean>>({
    type: false,
    scene: false,
    assets: false,
  });
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const startedAt = useRef(0);
  const progressRef = useRef(0);

  // Kick off the real work and tick each stage as it completes.
  useEffect(() => {
    startedAt.current = performance.now();
    // Hand off from the static splash in index.html the moment we paint.
    document.getElementById("boot")?.remove();

    let cancelled = false;
    const timers: number[] = [];

    const complete = (id: StageId) => {
      if (cancelled) return;
      setDone((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
    };

    const track = (id: StageId, work: Promise<unknown>, timeout: number) => {
      const timer = window.setTimeout(() => complete(id), timeout);
      timers.push(timer);
      const finish = () => {
        window.clearTimeout(timer);
        complete(id);
      };
      work.then(finish, finish);
    };

    track("type", document.fonts.ready, SECONDARY_TIMEOUT_MS);

    // Pulling the scene in here is the whole point: three.js is fetched,
    // parsed and cached now, so the hero is already live when the site opens.
    track("scene", import("./three/HeroScene"), SCENE_TIMEOUT_MS);

    track(
      "assets",
      new Promise<void>((resolve) => {
        if (document.readyState === "complete") resolve();
        else window.addEventListener("load", () => resolve(), { once: true });
      }),
      SECONDARY_TIMEOUT_MS,
    );

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  // Ease the bar toward whatever has actually landed, floored by MIN_FILL_MS so
  // it never snaps to full on a cached reload.
  useEffect(() => {
    // Only credit an unbroken run of finished stages, so the bar sweeps in
    // order and passing a stage's mark always means it genuinely landed.
    let banked = 0;
    let activeWeight = 0;
    for (const stage of STAGES) {
      if (done[stage.id]) {
        banked += stage.weight;
        continue;
      }
      activeWeight = stage.weight;
      break;
    }

    // A dynamic import reports no byte progress, so the live stage creeps
    // asymptotically across its own segment — always moving, never arriving.
    // Only the promise landing can carry the bar over that segment's line.
    const stageStartedAt = performance.now();
    let current = progressRef.current;
    let raf = 0;

    const tick = (now: number) => {
      const creep = activeWeight * 0.9 * (1 - 1 / (1 + (now - stageStartedAt) / 3000));
      const allowance = ((now - startedAt.current) / MIN_FILL_MS) * 100;
      const ceiling = Math.min(banked + creep, allowance);

      if (current < ceiling) {
        current = Math.min(ceiling, current + (ceiling - current) * 0.12 + 0.25);
        progressRef.current = current;
        setProgress(current);
      }

      if (banked >= 100 && current >= 100) return;
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [done]);

  useEffect(() => {
    if (!exiting) return;
    const timer = window.setTimeout(onExited, EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [exiting, onExited]);

  const handleEnter = useCallback(() => {
    setExiting(true);
    onEnter();
  }, [onEnter]);

  const ready = progress >= 100;
  const value = Math.floor(progress);
  const digits = String(value).padStart(3, "0");
  const leading = digits.slice(0, digits.length - String(value).length);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Nova Forma Designs is loading"
      className={`dotgrid fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-cream px-6 transition-[opacity,transform] duration-700 ease-out-expo ${
        exiting ? "pointer-events-none opacity-0 motion-safe:scale-105" : "opacity-100"
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-teal-soft/40 to-transparent"
      />

      <div className="relative flex w-[min(92vw,25rem)] flex-col items-center gap-6">
        <p className="eyebrow">
          <span className="text-teal-deep">✦</span> Nova Forma Designs
        </p>

        {/* The mark, spinning like a struck coin — a flat cousin of the hero's
            3D logo. Two faces, the back one mirrored twice so the bird always
            reads the right way round as it turns. */}
        <div className="relative h-28 w-28 [perspective:1200px] sm:h-32 sm:w-32">
          <div
            className={`absolute inset-0 [transform-style:preserve-3d] ${
              ready ? "motion-safe:animate-coin-land" : "motion-safe:animate-coin-spin"
            }`}
          >
            <div className="absolute inset-0 grid place-items-center rounded-full border-2 border-ink bg-ivory shadow-pop-lg [backface-visibility:hidden]">
              <LogoMark className="h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]" />
            </div>
            <div className="absolute inset-0 grid place-items-center rounded-full border-2 border-ink bg-ivory shadow-pop-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <LogoMark className="h-16 w-16 [transform:scaleX(-1)] sm:h-[4.5rem] sm:w-[4.5rem]" />
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 font-display text-6xl font-extrabold leading-none tabular-nums text-ink">
          <span>
            <span className="text-ink-faint/40">{leading}</span>
            {value}
          </span>
          <span className="font-mono text-xl font-bold text-teal-deep">%</span>
        </div>

        <div className="h-4 w-full overflow-hidden rounded-full border-2 border-ink bg-ivory shadow-pop">
          <div
            className="h-full rounded-full bg-teal transition-[width] duration-150 ease-linear motion-safe:animate-stripes"
            style={{
              width: `${progress}%`,
              backgroundImage:
                "repeating-linear-gradient(-45deg, rgb(15 34 51 / 0.18) 0 8px, transparent 8px 16px)",
              backgroundSize: "32px 100%",
            }}
          />
        </div>

        <ul className="w-full rounded-2xl border-2 border-ink bg-ivory px-4 py-2.5 shadow-pop">
          {STAGES.map((stage, i) => {
            const { start, end } = BOUNDS[i];
            const complete = progress >= end;
            const active = !complete && progress >= start;
            return (
              <li
                key={stage.id}
                className="flex items-center gap-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-eyebrow"
              >
                <span aria-hidden className={complete || active ? "text-teal-deep" : "text-ink-faint"}>
                  {complete ? "✓" : "▸"}
                </span>
                <span className={complete || active ? "text-ink" : "text-ink-faint"}>{stage.label}</span>
                <span
                  className={`ml-auto ${
                    complete
                      ? "text-teal-deep"
                      : active
                        ? "text-ink-soft motion-safe:animate-pulse"
                        : "text-ink-faint"
                  }`}
                >
                  {complete ? "done" : active ? "loading" : "···"}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="flex h-14 items-center justify-center">
          {ready ? (
            <div className="motion-safe:animate-pop-in">
              <MagneticButton autoFocus onClick={handleEnter}>
                Enter the site
              </MagneticButton>
            </div>
          ) : (
            <p className="font-mono text-[10px] font-bold uppercase tracking-eyebrow text-ink-faint">
              Preparing your experience
            </p>
          )}
        </div>

        <p role="status" aria-live="polite" className="sr-only">
          {ready
            ? "Loading complete. Activate the enter the site button to continue."
            : `Loading, ${Math.round(progress / 10) * 10} percent complete.`}
        </p>
      </div>

      <p
        aria-hidden
        className="absolute inset-x-0 bottom-6 text-center font-mono text-[10px] uppercase tracking-eyebrow text-ink-faint"
      >
        nova forma — &ldquo;new form&rdquo; ✶
      </p>
    </div>
  );
}
