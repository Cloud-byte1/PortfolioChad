import { ViewTransition } from "react";
import Link from "next/link";
import type { WorkItem } from "@/data/work";
import { SceneView } from "@/components/work/scene-view";

export const projectHref = (id: string) => `/cad/${id}`;

/** Shared name so the card's drawing morphs into the project page's hero. */
export const sceneTransitionName = (id: string) => `scene-${id}`;

export function ProjectCard({ item }: { item: WorkItem }) {
  return (
    <Link
      href={projectHref(item.id)}
      className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-foreground/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <ViewTransition name={sceneTransitionName(item.id)} share="morph" default="none">
        <SceneView scene={item.scene} label={item.caption} controls={false} />
      </ViewTransition>
      <div className="flex flex-col gap-1 px-1 pb-1">
        <h3 className="text-sm font-semibold tracking-tight text-ink">{item.title}</h3>
        <p className="text-xs leading-relaxed text-muted-foreground">{item.summary}</p>
        <p className="mt-1 text-[0.7rem] font-medium text-foreground underline-offset-2 group-hover:underline">
          Open project
        </p>
      </div>
    </Link>
  );
}
