import type { WorkItem } from "@/data/work";
import { SceneView } from "@/components/work/scene-view";

export function WorkSheet({ item }: { item: WorkItem }) {
  return (
    <article id={item.id} className="scroll-mt-16 flex flex-col gap-3 py-5">
      <figure className="flex flex-col gap-2">
        <SceneView scene={item.scene} label={item.caption} />
        <figcaption className="text-xs leading-relaxed text-muted-foreground">
          {item.caption}
        </figcaption>
      </figure>

      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold tracking-tight text-ink">{item.title}</h3>
        <p className="max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
          {item.summary}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-semibold text-foreground">What I did</h4>
        <ul className="flex max-w-[64ch] flex-col gap-1.5 text-sm leading-relaxed text-muted-foreground">
          {item.did.map((line) => (
            <li
              key={line}
              className="relative pl-3.5 before:absolute before:top-[0.6em] before:left-0 before:size-1 before:rounded-full before:bg-foreground/50"
            >
              {line}
            </li>
          ))}
        </ul>
      </div>

      <ul className="flex flex-wrap gap-1.5" aria-label="Tools">
        {item.tools.map((tool) => (
          <li
            key={tool}
            className="rounded-full border border-border px-2.5 py-0.5 text-[0.7rem] font-medium text-foreground"
          >
            {tool}
          </li>
        ))}
      </ul>
    </article>
  );
}
