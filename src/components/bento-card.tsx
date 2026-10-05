"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CircleArrowUpRight02Icon,
  CpuIcon,
  DatabaseIcon,
  GolfBallIcon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import { featuredWork } from "@/data/work";
import { SceneView } from "@/components/work/scene-view";
import { cn } from "@/lib/utils";

const projectIcons = {
  "fairlie-mat": GolfBallIcon,
  "fairlie-board": CpuIcon,
  "stirling-engine": Settings02Icon,
  nas: DatabaseIcon,
} as const;

export default function BentoCard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = featuredWork[activeIndex];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_12px_35px_oklch(0_0_0/0.06)]">
      <div className="grid sm:grid-cols-[10.5rem_1fr]">
        <LayoutGroup>
          <div
            role="tablist"
            aria-label="Featured projects"
            className="flex gap-1 overflow-x-auto border-b border-border bg-muted/15 p-2 sm:flex-col sm:border-r sm:border-b-0 sm:pt-4"
          >
            {featuredWork.map((project, index) => {
              const isActive = index === activeIndex;
              const Icon =
                projectIcons[project.id as keyof typeof projectIcons] ?? CpuIcon;

              return (
                <button
                  key={project.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "relative flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-left text-[0.7rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="project-active-tab"
                      className="absolute inset-0 rounded-md border border-border bg-background shadow-sm"
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    />
                  )}
                  <HugeiconsIcon icon={Icon} size={14} className="relative z-10 shrink-0" />
                  <span className="relative z-10 max-w-32 truncate">{project.title}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        <div role="tabpanel" className="relative flex min-w-0 flex-col p-4 sm:p-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <SceneView scene={active.scene} label={active.caption} />

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight text-ink">
                    {active.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {active.summary}
                  </p>
                </div>
                <Link
                  href={`/cad#${active.id}`}
                  aria-label={`Read more about ${active.title} in the CAD Lab`}
                  className="grid size-8 shrink-0 place-items-center rounded-md border border-border transition-colors hover:bg-muted"
                >
                  <HugeiconsIcon icon={CircleArrowUpRight02Icon} size={15} />
                </Link>
              </div>

              <ul className="flex flex-col gap-1.5 text-[0.8rem] leading-relaxed text-muted-foreground">
                {active.did.slice(0, 2).map((line) => (
                  <li
                    key={line}
                    className="relative pl-3.5 before:absolute before:top-[0.6em] before:left-0 before:size-1 before:rounded-full before:bg-foreground/50"
                  >
                    {line}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <ul className="flex flex-wrap gap-1.5" aria-label="Tools">
                  {active.tools.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-full border border-border px-2.5 py-0.5 text-[0.68rem] font-medium text-foreground"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/cad#${active.id}`}
                  className="text-xs font-medium text-foreground underline-offset-2 hover:underline"
                >
                  Full write-up
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
