"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/data/portfolio";
import { work } from "@/data/work";
import { SceneView } from "@/components/work/scene-view";
import { cn } from "@/lib/utils";

type AvatarMode = "photo" | "character";

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [avatarMode, setAvatarMode] = useState<AvatarMode>("photo");

  useEffect(() => {
    const id = window.setInterval(() => {
      setRoleIndex((i) => (i + 1) % site.roles.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, []);

  function toggleAvatar() {
    setAvatarMode((current) => {
      return current === "photo" ? "character" : "photo";
    });
  }

  return (
    <section id="top" className="px-4 pt-6 pb-2 sm:px-5">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)]">
        <div className="flex min-w-0 flex-col gap-5 rounded-xl border border-border bg-card p-4 shadow-[0_10px_30px_oklch(0_0_0/0.04)]">
          <div className="flex items-start gap-4">
            <div className="flex shrink-0 flex-col items-center gap-1.5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={avatarMode}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                >
                  <Image
                    src={avatarMode === "photo" ? site.photo : site.character}
                    alt={
                      avatarMode === "photo"
                        ? `${site.name} profile photo`
                        : `${site.name} pixel character`
                    }
                    width={96}
                    height={96}
                    priority
                    className={cn(
                      "size-16 rounded-lg border border-border object-cover sm:size-[4.5rem]",
                      avatarMode === "character" && "[image-rendering:pixelated]"
                    )}
                  />
                </motion.div>
              </AnimatePresence>
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  role="switch"
                  aria-checked={avatarMode === "character"}
                  aria-label="Toggle between profile photo and pixel character"
                  onClick={toggleAvatar}
                  className={cn(
                    "relative h-5 w-9 rounded-full border border-border p-0.5 transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    avatarMode === "character" ? "bg-ink" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "block size-3.5 rounded-full border border-border bg-background shadow-sm transition-transform duration-200",
                      avatarMode === "character" && "translate-x-4"
                    )}
                  />
                </button>
              </div>
            </div>
            <div className="flex min-w-0 flex-col gap-2 pt-0.5">
              <h1 className="text-[1.65rem] font-bold leading-tight tracking-tight text-ink sm:text-3xl">
                {site.name}
              </h1>
              <div className="min-h-[1.25rem] text-sm text-muted-foreground">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={site.roles[roleIndex]}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="inline-block"
                  >
                    {site.roles[roleIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button asChild size="sm" className="h-8 rounded-full px-3.5 text-xs">
                  <a href="#contact">
                    <MessageSquare data-icon="inline-start" />
                    Contact
                  </a>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="h-8 rounded-full px-3.5 text-xs"
                >
                  <a href={`mailto:${site.email}`}>
                    <Mail data-icon="inline-start" />
                    Email
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-auto text-sm leading-relaxed text-muted-foreground">
            {site.tagline}
          </p>
        </div>

        <Link
          href="/cad"
          className="group relative flex min-h-52 min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card p-4 shadow-[0_10px_30px_oklch(0_0_0/0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-[0_16px_36px_oklch(0_0_0/0.09)]"
          aria-label="Open the interactive CAD Lab"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-ink">CAD Lab</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {work.length} projects, each one animated
              </p>
            </div>
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-background transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
              <ArrowUpRight className="size-3.5" />
            </span>
          </div>

          <SceneView
            scene="stirling"
            label="Animated Stirling engine: the flywheel turns and both pistons move 90 degrees apart."
            controls={false}
            className="my-3 flex-1"
          />

          <div className="flex items-center justify-between gap-3 text-[0.68rem]">
            <span className="text-muted-foreground">Mechanisms, boards, and apps</span>
            <span className="font-medium text-foreground">Enter the lab</span>
          </div>
        </Link>
      </div>
    </section>
  );
}
