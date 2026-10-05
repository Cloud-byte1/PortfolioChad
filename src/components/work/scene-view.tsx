"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import type { SceneKey } from "@/data/work";
import { scenes, type SceneState } from "@/components/work/scenes";
import { useInView, usePrefersReducedMotion } from "@/lib/motion-hooks";
import { cn } from "@/lib/utils";

const noop = () => () => {};

type SceneViewProps = {
  scene: SceneKey;
  /** Read by screen readers in place of the animation. */
  label: string;
  /** Top-left tag, e.g. "Fig 1". */
  fig?: string;
  /** Top-right tag: what the figure shows. */
  title?: string;
  /**
   * "interactive": click (or Enter) runs the scene's action; has a pause button.
   * "hover": for scenes inside a link; pointing at the card runs the action.
   */
  mode?: "interactive" | "hover";
  className?: string;
};

export function SceneView({
  scene,
  label,
  fig,
  title,
  mode = "interactive",
  className,
}: SceneViewProps) {
  const spec = scenes[scene];
  const reduced = usePrefersReducedMotion();
  const [paused, setPaused] = useState<boolean | null>(null);
  const [ref, inView] = useInView<HTMLDivElement>();
  // Drawings come from float math that can differ by a bit between server
  // and browser, so they only render once hydrated.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);

  const isPaused = paused ?? reduced;
  const running = inView && !isPaused;

  const [state, setState] = useState<SceneState>({ t: spec.rest, a: -1, n: 0 });
  const elapsed = useRef(spec.rest * spec.duration);
  const actionStart = useRef<number | null>(null);
  const count = useRef(0);
  const settleTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      let a = -1;
      if (actionStart.current !== null) {
        a = (now - actionStart.current) / spec.action;
        if (a >= 1) {
          actionStart.current = null;
          a = -1;
        }
      }
      elapsed.current += dt * (spec.rate?.(a) ?? 1);
      setState({ t: (elapsed.current % spec.duration) / spec.duration, a, n: count.current });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, spec]);

  useEffect(() => () => {
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
  }, []);

  function trigger() {
    if (actionStart.current !== null) return;
    count.current += 1;
    if (running) {
      actionStart.current = performance.now();
      return;
    }
    // Paused or reduced motion: show the action's end state, then settle.
    setState((s) => ({ ...s, a: 0.99, n: count.current }));
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(
      () => setState((s) => ({ ...s, a: -1, n: count.current })),
      2200
    );
  }

  const busy = state.a >= 0;
  const drawing = (
    <svg viewBox="0 0 320 240" className="scene block h-auto w-full" role="img" aria-label={label}>
      {hydrated ? spec.render(state) : null}
    </svg>
  );

  return (
    <div
      ref={ref}
      onPointerEnter={mode === "hover" ? trigger : undefined}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl border border-border bg-mist dot-grid",
        className
      )}
    >
      {fig || title ? (
        <div className="flex items-center justify-between gap-3 px-3 pt-2.5 text-[0.68rem] text-muted-foreground">
          <span className="font-semibold text-foreground">{fig}</span>
          <span className="truncate">{title}</span>
        </div>
      ) : null}

      {mode === "interactive" ? (
        <button
          type="button"
          onClick={trigger}
          aria-label={`${spec.verb}: ${label}`}
          className="block w-full cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
        >
          {drawing}
        </button>
      ) : (
        drawing
      )}

      <div className="flex min-h-9 items-center gap-2 px-3 pb-2.5 text-[0.7rem] text-muted-foreground">
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full bg-[var(--signal)] transition-opacity",
            busy ? "opacity-100" : "opacity-40"
          )}
          aria-hidden
        />
        <span className="min-w-0 flex-1 truncate" aria-live={mode === "interactive" ? "polite" : undefined}>
          {spec.status(state)}
        </span>
        {mode === "interactive" ? (
          <button
            type="button"
            onClick={() => setPaused(!isPaused)}
            aria-label={isPaused ? "Play animation" : "Pause animation"}
            className="grid size-6 shrink-0 place-items-center rounded-full border border-border bg-background/90 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {isPaused ? <Play className="size-2.5" aria-hidden /> : <Pause className="size-2.5" aria-hidden />}
          </button>
        ) : null}
      </div>
    </div>
  );
}
