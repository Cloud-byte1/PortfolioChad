"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Box, MousePointer2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cadModels } from "@/data/cad";
import { cn } from "@/lib/utils";

const CadCanvas = dynamic(
  () => import("@/components/cad/cad-canvas").then((m) => m.CadCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
        Loading viewport…
      </div>
    ),
  }
);

/** 3D viewer for the rendered CAD models in src/data/models.ts. */
export function CadLab() {
  const [activeId, setActiveId] = useState(cadModels[0]?.id ?? "");
  const [autoRotate, setAutoRotate] = useState(true);
  const active = cadModels.find((m) => m.id === activeId) ?? cadModels[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-[340px] overflow-hidden rounded-xl border border-border bg-[var(--viewport)] sm:h-[420px]">
        {active ? (
          <CadCanvas src={active.src} format={active.format} autoRotate={autoRotate} />
        ) : null}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2">
          <Badge variant="secondary" className="bg-background/90 text-[0.65rem] backdrop-blur">
            {active?.sourceNote ?? "CAD viewport"}
          </Badge>
          <Button
            type="button"
            size="xs"
            variant="outline"
            className="rounded-full bg-background/90 backdrop-blur"
            onClick={() => setAutoRotate((v) => !v)}
          >
            <RotateCcw data-icon="inline-start" />
            {autoRotate ? "Stop spin" : "Auto-spin"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-[0.68rem] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MousePointer2 className="size-3" aria-hidden /> Drag to orbit
        </span>
        <span>Scroll to zoom</span>
        <span>Right-drag to pan</span>
      </div>

      <div className="flex flex-col gap-2">
        {cadModels.map((model) => {
          const selected = model.id === active?.id;
          return (
            <button
              key={model.id}
              type="button"
              onClick={() => setActiveId(model.id)}
              aria-pressed={selected}
              className={cn(
                "flex w-full flex-col gap-0.5 rounded-lg border px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                selected ? "border-foreground/25 bg-muted" : "border-border hover:bg-muted/60"
              )}
            >
              <span className="flex items-center gap-2 text-sm font-medium text-ink">
                <Box className="size-3.5 text-muted-foreground" aria-hidden />
                {model.title}
              </span>
              <span className="text-xs text-muted-foreground">{model.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
