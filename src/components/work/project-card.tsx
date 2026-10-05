import { ViewTransition } from "react";
import Link from "next/link";
import type { WorkItem } from "@/data/work";
import { SceneView } from "@/components/work/scene-view";

export const projectHref = (id: string) => `/cad/${id}`;

/** Shared name so the card's figure morphs into the project page's first figure. */
export const sceneTransitionName = (id: string) => `scene-${id}`;

export function ProjectCard({ item }: { item: WorkItem }) {
  const figure = item.figures[0];
  const more = item.figures.length - 1;

  return (
    <Link
      href={projectHref(item.id)}
      className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-2.5 transition-colors hover:border-foreground/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <ViewTransition name={sceneTransitionName(item.id)} share="morph" default="none">
        <SceneView
          scene={figure.scene}
          label={figure.caption}
          fig={item.discipline}
          title={more > 0 ? `${item.figures.length} figures` : figure.title}
          mode="hover"
        />
      </ViewTransition>
      <div className="flex flex-col gap-1 px-1.5 pb-1.5">
        <h3 className="text-sm font-semibold tracking-tight text-ink">{item.title}</h3>
        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{item.summary}</p>
        <p className="mt-1 text-[0.7rem] font-medium text-foreground underline-offset-2 group-hover:underline">
          Open project
        </p>
      </div>
    </Link>
  );
}
