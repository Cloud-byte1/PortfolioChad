"use client";

import { useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import type { SceneKey } from "@/data/work";
import { scenes } from "@/components/work/scenes";
import {
  useInView,
  useLoopClock,
  usePrefersReducedMotion,
} from "@/lib/motion-hooks";
import { cn } from "@/lib/utils";

const noop = () => () => {};

type SceneViewProps = {
  scene: SceneKey;
  /** Read by screen readers in place of the animation. */
  label: string;
  /** Show the pause/play control. Off when the scene sits inside a link. */
  controls?: boolean;
  className?: string;
};

export function SceneView({ scene, label, controls = true, className }: SceneViewProps) {
  const spec = scenes[scene];
  const reduced = usePrefersReducedMotion();
  const [paused, setPaused] = useState<boolean | null>(null);
  const [ref, inView] = useInView<HTMLDivElement>();
  // Drawings come from float math that can differ by a bit between server
  // and browser, so they only render once hydrated.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);

  // Until someone presses the button, reduced-motion decides.
  const isPaused = paused ?? reduced;
  const t = useLoopClock(spec.duration, inView && !isPaused, spec.rest);

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-mist dot-grid",
        className
      )}
    >
      <svg
        viewBox="0 0 320 180"
        className="scene block h-auto w-full"
        role="img"
        aria-label={label}
      >
        {hydrated ? spec.render(t) : null}
      </svg>
      {controls ? (
        <button
          type="button"
          onClick={() => setPaused(!isPaused)}
          aria-label={isPaused ? "Play animation" : "Pause animation"}
          className="absolute right-2 bottom-2 grid size-7 place-items-center rounded-full border border-border bg-background/90 text-muted-foreground backdrop-blur transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {isPaused ? <Play className="size-3" aria-hidden /> : <Pause className="size-3" aria-hidden />}
        </button>
      ) : null}
    </div>
  );
}
