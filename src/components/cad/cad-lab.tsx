"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useState,
  type DragEvent,
} from "react";
import dynamic from "next/dynamic";
import { Box, MousePointer2, RotateCcw, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cadModels, type CadModel, type CadModelFormat } from "@/data/cad";
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

function detectFormat(name: string): CadModelFormat | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".stl")) return "stl";
  if (lower.endsWith(".glb")) return "glb";
  if (lower.endsWith(".gltf")) return "gltf";
  return null;
}

export function CadLab() {
  const [activeId, setActiveId] = useState(cadModels[0]?.id ?? "");
  const [autoRotate, setAutoRotate] = useState(true);
  const [localModel, setLocalModel] = useState<CadModel | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const catalogModel = cadModels.find((m) => m.id === activeId) ?? cadModels[0];
  const active = localModel ?? catalogModel;

  useEffect(() => {
    return () => {
      if (localModel?.src.startsWith("blob:")) {
        URL.revokeObjectURL(localModel.src);
      }
    };
  }, [localModel]);

  const loadFile = useCallback((file: File) => {
    const format = detectFormat(file.name);
    if (!format) {
      setError(
        "Use .glb, .gltf, or .stl. Native SolidWorks .sldprt / .sldasm won’t load here."
      );
      return;
    }
    setError(null);
    const url = URL.createObjectURL(file);
    startTransition(() => {
      setLocalModel({
        id: `local-${file.name}`,
        title: file.name,
        description: "Loaded from your machine — orbit like SolidWorks.",
        src: url,
        format,
        sourceNote: "Local SolidWorks export",
      });
      setActiveId("");
    });
  }, []);

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) loadFile(file);
  }

  return (
    <section id="cad-lab" className="scroll-mt-14 px-4 pt-6 pb-8 sm:px-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold tracking-tight text-ink">Orbit a model</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Spin a model in 3D, or drop in your own STL, GLB, or GLTF file. Drag to
            orbit, scroll to zoom, right-drag to pan.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {cadModels.map((model) => {
            const selected = !localModel && model.id === active?.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => {
                  setLocalModel(null);
                  setActiveId(model.id);
                  setError(null);
                }}
                className={cn(
                  "flex w-full flex-col gap-0.5 rounded-lg border px-3 py-2.5 text-left transition-colors",
                  selected
                    ? "border-foreground/25 bg-muted"
                    : "border-border hover:bg-muted/60"
                )}
              >
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  <Box className="size-3.5 text-muted-foreground" />
                  {model.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {model.description}
                </span>
              </button>
            );
          })}
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "flex flex-col gap-2 rounded-lg border border-dashed px-3 py-3 transition-colors",
            dragOver ? "border-foreground/40 bg-muted" : "border-border"
          )}
        >
          <div className="flex items-start gap-2">
            <Upload className="mt-0.5 size-3.5 text-muted-foreground" />
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-foreground">
                Drop a SolidWorks export
              </p>
              <p className="text-xs text-muted-foreground">
                Accepts <Badge variant="secondary">.glb</Badge>{" "}
                <Badge variant="secondary">.gltf</Badge>{" "}
                <Badge variant="secondary">.stl</Badge>
              </p>
            </div>
          </div>
          <label className="inline-flex w-fit cursor-pointer items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium hover:bg-muted">
            <input
              type="file"
              accept=".stl,.glb,.gltf,model/stl,model/gltf-binary"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) loadFile(file);
              }}
            />
            Browse files
          </label>
          {error ? (
            <p className="text-xs text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          {localModel ? (
            <p className="text-xs text-muted-foreground">Showing: {localModel.title}</p>
          ) : null}
        </div>

        <div className="relative h-[320px] overflow-hidden rounded-lg border border-border bg-[var(--viewport)] sm:h-[380px]">
          {active ? (
            <CadCanvas
              src={active.src}
              format={active.format}
              autoRotate={autoRotate}
            />
          ) : null}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2">
            <Badge
              variant="secondary"
              className="bg-background/90 text-[0.65rem] backdrop-blur"
            >
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

        {active?.sourceDownload ? (
          <p className="text-xs text-muted-foreground leading-relaxed">
            Browsers can’t open SolidWorks files, so the viewer shows a simplified
            version.{" "}
            <a
              className="font-medium text-foreground underline underline-offset-2"
              href={active.sourceDownload}
              download
            >
              Download the original assembly
            </a>{" "}
            to open it in SolidWorks.
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3 text-[0.65rem] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MousePointer2 className="size-3" /> Drag orbit
          </span>
          <span>Scroll zoom</span>
          <span>Right-drag pan</span>
        </div>
      </div>
    </section>
  );
}
