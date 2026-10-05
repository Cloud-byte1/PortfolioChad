"use client";

import { useState, ViewTransition } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CircleArrowUpRight02Icon,
  DatabaseIcon,
  EngineIcon,
  GolfBallIcon,
  Settings02Icon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";
import { work } from "@/data/work";
import { SceneView } from "@/components/work/scene-view";
import { cn } from "@/lib/utils";

export const projectHref = (id: string) => `/cad/${id}`;

/** Shared name so the preview's figure morphs into the project page's first figure. */
export const sceneTransitionName = (id: string) => `scene-${id}`;

const icons = {
  fairlie: GolfBallIcon,
  nas: DatabaseIcon,
  "stirling-engine": Settings02Icon,
  "v8-engine": EngineIcon,
  "college-app": SmartPhone01Icon,
} as const;

/** Every project as a tab; the panel previews the selected one and opens its page. */
export function ProjectSwitcher() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = work[activeIndex];
  const figure = active.figures[0];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_12px_35px_oklch(0_0_0/0.06)]">
      <div className="grid sm:grid-cols-[11rem_1fr]">
        <LayoutGroup>
          <div
            role="tablist"
            aria-label="Projects"
            className="flex gap-1 overflow-x-auto border-b border-border bg-muted/15 p-2 sm:flex-col sm:border-r sm:border-b-0 sm:pt-4"
          >
            {work.map((project, index) => {
              const isActive = index === activeIndex;
              const Icon = icons[project.id as keyof typeof icons] ?? Settings02Icon;
              return (
                <button
                  key={project.id}
                  type="button"
                  role="tab"
                  id={`tab-${project.id}`}
                  aria-selected={isActive}
                  aria-controls="project-panel"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "relative flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-left text-[0.72rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
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

        <div
          role="tabpanel"
          id="project-panel"
          aria-labelledby={`tab-${active.id}`}
          className="relative flex min-w-0 flex-col p-3 sm:p-4"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              <ViewTransition name={sceneTransitionName(active.id)} share="morph" default="none">
                <SceneView
                  scene={figure.scene}
                  label={figure.caption}
                  fig={active.discipline}
                  title={
                    active.figures.length > 1 ? `Fig 1 of ${active.figures.length}` : figure.title
                  }
                />
              </ViewTransition>

              <div className="flex items-start justify-between gap-4 px-1">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight text-ink">{active.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{active.summary}</p>
                </div>
              </div>

              <ul className="flex flex-col gap-1.5 px-1 text-[0.8rem] leading-relaxed text-muted-foreground">
                {figure.did.slice(0, 2).map((line) => (
                  <li
                    key={line}
                    className="relative pl-3.5 before:absolute before:top-[0.6em] before:left-0 before:size-1 before:rounded-full before:bg-foreground/50"
                  >
                    {line}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-1">
                <ul className="flex flex-wrap gap-1.5" aria-label="Tools">
                  {active.tools.slice(0, 4).map((tool) => (
                    <li
                      key={tool}
                      className="rounded-full border border-border px-2.5 py-0.5 text-[0.68rem] font-medium text-foreground"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
                <Link
                  href={projectHref(active.id)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Open project
                  <HugeiconsIcon icon={CircleArrowUpRight02Icon} size={14} aria-hidden />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
