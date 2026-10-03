"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CircleArrowUpRight02Icon,
  DashboardSquare01Icon,
  DatabaseIcon,
  Folder02Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { projects } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const projectIcons = [DashboardSquare01Icon, DatabaseIcon, Folder02Icon];

export default function BentoCard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-[0_12px_35px_oklch(0_0_0/0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_oklch(0_0_0/0.1)]">
      <div className="border-b border-border p-4 sm:p-5">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
          Selected work
        </p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <p className="max-w-md text-sm font-medium leading-relaxed text-foreground">
            Hardware, systems, and mechanical design projects built from first principles.
          </p>
          <HugeiconsIcon
            icon={CircleArrowUpRight02Icon}
            size={18}
            className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
      </div>

      <div className="grid min-h-[280px] sm:grid-cols-[10.5rem_1fr]">
        <LayoutGroup>
          <div className="flex gap-1 overflow-x-auto border-b border-border bg-muted/15 p-2 sm:flex-col sm:border-r sm:border-b-0 sm:pt-4">
            {projects.map((project, index) => {
              const isActive = index === activeIndex;
              const Icon = projectIcons[index] ?? Folder02Icon;

              return (
                <button
                  key={project.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "relative flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-left text-[0.68rem] font-medium transition-colors",
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
                  <span className="relative z-10 max-w-28 truncate">{project.title}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        <div className="relative flex min-h-[230px] flex-col overflow-hidden p-4 sm:p-5">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeProject.title}
              initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
              transition={{ duration: 0.22 }}
              className="flex flex-1 flex-col"
            >
              <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted-foreground">
                    Project {String(activeIndex + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1.5 text-base font-semibold tracking-tight text-ink">
                    {activeProject.title}
                  </h3>
                </div>
                <a
                  href={activeProject.href}
                  aria-label={`Open ${activeProject.title}`}
                  className="grid size-8 shrink-0 place-items-center rounded-md border border-border transition-colors hover:bg-muted"
                >
                  <HugeiconsIcon icon={CircleArrowUpRight02Icon} size={15} />
                </a>
              </div>

              <p className="py-4 text-sm leading-relaxed text-muted-foreground">
                {activeProject.description}
              </p>

              <div className="mt-auto grid gap-1.5 sm:grid-cols-2">
                {activeProject.stack.map((item, index) => (
                  <div
                    key={item}
                    className="flex h-9 items-center gap-2.5 rounded-md border border-border bg-background px-3 transition-colors hover:bg-muted"
                  >
                    <span className="font-mono text-[0.55rem] tabular-nums text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <HugeiconsIcon icon={Tick01Icon} size={12} className="text-muted-foreground" />
                    <span className="truncate text-[0.7rem] font-medium text-foreground">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
