"use client";

import { useEffect, useState } from "react";
import { useInView, usePrefersReducedMotion } from "@/lib/motion-hooks";
import { cn } from "@/lib/utils";

type V = [number, number, number];

// A stepped block (a bracket-like part) as a wireframe: corners and edges.
const CORNERS: V[] = [
  [-1, -0.6, -0.5], [1, -0.6, -0.5], [1, 0.6, -0.5], [-1, 0.6, -0.5],
  [-1, -0.6, 0.1], [1, -0.6, 0.1], [1, 0.6, 0.1], [-1, 0.6, 0.1],
  [-1, -0.6, 0.6], [-0.2, -0.6, 0.6], [-0.2, 0.6, 0.6], [-1, 0.6, 0.6],
  [-0.2, -0.6, 0.1], [-0.2, 0.6, 0.1],
];
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [0, 4], [1, 5], [2, 6], [3, 7],
  [5, 6], [4, 8], [7, 11], [8, 9], [9, 10], [10, 11], [8, 11],
  [9, 12], [10, 13], [12, 5], [13, 6], [12, 13],
];

function project([x, y, z]: V, yaw: number): [number, number] {
  const cx = x * Math.cos(yaw) - y * Math.sin(yaw);
  const cy = x * Math.sin(yaw) + y * Math.cos(yaw);
  // Tilt the view down 30° and fit into a 200 × 120 box.
  const sx = cx;
  const sy = cy * 0.5 - z * 0.866;
  return [100 + sx * 52, 64 + sy * 52];
}

/** A small wireframe part slowly turning, as a stand-in for the 3D viewer. */
export function OrbitPreview({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLDivElement>();
  const [yaw, setYaw] = useState(0.6);

  useEffect(() => {
    if (reduced || !inView) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      setYaw((v) => v + Math.min(now - last, 64) * 0.0006);
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, inView]);

  const pts = CORNERS.map((c) => project(c, yaw));
  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden rounded-lg border border-border bg-[var(--viewport)]", className)}
    >
      <svg viewBox="0 0 200 128" className="block h-full w-full" aria-hidden>
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={Math.round(pts[a][0] * 10) / 10}
            y1={Math.round(pts[a][1] * 10) / 10}
            x2={Math.round(pts[b][0] * 10) / 10}
            y2={Math.round(pts[b][1] * 10) / 10}
            stroke="var(--ink)"
            strokeOpacity={0.7}
            strokeWidth={0.9}
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}
