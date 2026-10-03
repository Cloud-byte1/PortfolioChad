"use client";

import type { ComponentType } from "react";
import { useState } from "react";
import {
  ArrowRight,
  DraftingCompass,
  FlagTriangleRight,
  HardDrive,
} from "lucide-react";
import { motion } from "motion/react";

type FolderCardItem = {
  id: string;
  number: string;
  title: string;
  description: string;
  detail: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

const cards: FolderCardItem[] = [
  {
    id: "fairlie",
    number: "01",
    title: "FairLie",
    description: "Smart golf training mat",
    detail: "Pressure sensing · IMU · 60GHz radar · BLE",
    href: "#contact",
    icon: FlagTriangleRight,
  },
  {
    id: "nas",
    number: "02",
    title: "Personal NAS Server",
    description: "Purpose-built 8TB media and coursework archive",
    detail: "SolidWorks enclosure · Automated ingest · Systems",
    href: "#contact",
    icon: HardDrive,
  },
  {
    id: "solidworks",
    number: "03",
    title: "SolidWorks CAD Lab",
    description: "Interactive mechanical assemblies and part studies",
    detail: "CAD · Design documentation · 3D models",
    href: "/cad",
    icon: DraftingCompass,
  },
];

export default function FolderCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const activeCard = cards[activeIndex];

  function showNext() {
    setActiveIndex((current) => (current + 1) % cards.length);
  }

  return (
    <div className="w-full py-1">
      <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
          {activeCard.number} / {String(cards.length).padStart(2, "0")}
        </p>
        <button
          type="button"
          onClick={showNext}
          className="group inline-flex h-8 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-medium text-ink transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label={`Show next project after ${activeCard.title}`}
        >
          Next project
          <ArrowRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </button>
      </div>

      <div className="relative h-[286px] overflow-hidden sm:h-[270px]">
        {cards.map((card, index) => {
          const position = (index - activeIndex + cards.length) % cards.length;
          const Icon = card.icon;
          const isActive = position === 0;
          const isHovered = hoveredIndex === index;

          return (
            <motion.a
              key={card.id}
              href={card.href}
              aria-current={isActive ? "true" : undefined}
              aria-label={`${card.title}${isActive ? ", current project" : ", bring project to front"}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
              onClick={(event) => {
                if (!isActive) {
                  event.preventDefault();
                  setActiveIndex(index);
                }
              }}
              className="group absolute inset-x-0 top-9 block h-[220px] origin-top rounded-xl border border-border bg-background text-ink shadow-[0_12px_35px_oklch(0_0_0/0.08)] transition-colors hover:border-foreground/45 hover:bg-muted/20 hover:shadow-[0_18px_45px_oklch(0_0_0/0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:h-[210px]"
              style={{
                zIndex: isHovered ? cards.length + 1 : cards.length - position,
              }}
              animate={{
                x: position * 10,
                y: isHovered ? Math.max(-7, position * 8 - 12) : position * 8,
                scale: isHovered ? 1.01 : 1 - position * 0.035,
                opacity: isHovered ? 1 : 1 - position * 0.12,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <span
                className="absolute -top-7 flex h-7 w-[30%] items-center truncate rounded-t-lg border border-b-0 border-border bg-background px-2 font-mono text-[0.52rem] tracking-[0.08em] text-muted-foreground transition-all duration-200 group-hover:-translate-y-2 group-hover:border-foreground/45 group-hover:bg-muted group-hover:text-foreground sm:px-3 sm:text-[0.58rem] sm:tracking-[0.12em]"
                style={{ left: `${2 + index * 32}%` }}
              >
                {card.number} · {card.title.split(" ")[0]}
              </span>

              <div className="flex h-full flex-col justify-between p-5 sm:p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-muted/60">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="font-mono text-[0.65rem] tracking-[0.14em] text-muted-foreground">
                        PROJECT {card.number}
                      </p>
                      <h3 className="mt-1 text-base font-semibold tracking-tight sm:text-lg">
                        {card.title}
                      </h3>
                    </div>
                  </div>
                  <ArrowRight className="mt-2 size-4 shrink-0" aria-hidden />
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium">{card.description}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {card.detail}
                  </p>
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
