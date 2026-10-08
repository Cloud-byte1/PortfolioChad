import { ViewTransition } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { SceneView } from "@/components/work/scene-view";
import { accentStyle, projectHref, sceneTransitionName } from "@/components/work/links";
import { work } from "@/data/work";
import { site } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return work.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[id]">): Promise<Metadata> {
  const { id } = await params;
  const item = work.find((entry) => entry.id === id);
  if (!item) return {};
  return {
    title: `${item.title} — ${site.name}`,
    description: item.summary,
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[id]">) {
  const { id } = await params;
  const index = work.findIndex((entry) => entry.id === id);
  if (index === -1) notFound();

  const item = work[index];
  const previous = work[(index - 1 + work.length) % work.length];
  const next = work[(index + 1) % work.length];
  const single = item.figures.length === 1;

  return (
    <SiteShell>
      <SiteHeader />
      <main style={accentStyle(item.accent)}>
        <header className="flex flex-col gap-4 border-b border-border px-4 pt-5 pb-6 sm:px-5">
          <Link
            href="/projects"
            className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            All projects
          </Link>
          <div className="flex flex-col gap-2">
            <p className="w-fit rounded-full bg-[color-mix(in_oklch,var(--accent)_14%,transparent)] px-2.5 py-0.5 text-xs font-semibold text-[var(--accent-ink)]">
              {item.discipline}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-ink">{item.title}</h1>
            <span className="h-1 w-12 rounded-full bg-[var(--accent)]" aria-hidden />
            <p className="max-w-[62ch] text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
          </div>
          <ul className="flex flex-wrap gap-1.5" aria-label="Tools">
            {item.tools.map((tool) => (
              <li
                key={tool}
                className="rounded-full border border-[color-mix(in_oklch,var(--accent)_40%,transparent)] bg-[color-mix(in_oklch,var(--accent)_10%,transparent)] px-2.5 py-0.5 text-[0.7rem] font-medium text-[var(--accent-ink)]"
              >
                {tool}
              </li>
            ))}
          </ul>
        </header>

        {item.figures.map((figure, i) => {
          const scene = (
            <SceneView
              scene={figure.scene}
              label={figure.caption}
              fig={`Fig ${i + 1}`}
              title={figure.title}
            />
          );
          return (
            <Reveal key={figure.scene} className="border-b border-border px-4 py-7 sm:px-5">
              <section
                aria-labelledby={`fig-${i}`}
                className={cn("grid items-center gap-5", !single && "sm:grid-cols-[1.1fr_1fr] sm:gap-7")}
              >
                <figure className={cn("flex flex-col gap-2", !single && i % 2 === 1 && "sm:order-2")}>
                  {i === 0 ? (
                    <ViewTransition name={sceneTransitionName(item.id)} share="morph" default="none">
                      {scene}
                    </ViewTransition>
                  ) : (
                    scene
                  )}
                  <figcaption className="text-xs leading-relaxed text-muted-foreground">{figure.caption}</figcaption>
                </figure>

                <div className="flex flex-col gap-3">
                  <h2 id={`fig-${i}`} className="text-lg font-bold tracking-tight text-ink">
                    {figure.title}
                  </h2>
                  <ul className="flex max-w-[64ch] flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
                    {figure.did.map((line) => (
                      <li
                        key={line}
                        className="relative pl-3.5 before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-[var(--accent)]"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </Reveal>
          );
        })}

        {item.lessons ? (
          <Reveal className="border-b border-border px-4 py-7 sm:px-5">
            <section aria-labelledby="lessons" className="flex flex-col gap-5">
              <h2 id="lessons" className="text-lg font-bold tracking-tight text-ink">
                Challenges and what I learned
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {(
                  [
                    ["Challenges", item.lessons.challenges],
                    ["What I learned", item.lessons.learned],
                  ] as const
                ).map(([heading, lines]) => (
                  <div key={heading} className="flex flex-col gap-2.5">
                    <h3 className="text-sm font-semibold text-[var(--accent-ink)]">{heading}</h3>
                    <ul className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
                      {lines.map((line) => (
                        <li
                          key={line}
                          className="relative pl-3.5 before:absolute before:top-[0.6em] before:left-0 before:size-1.5 before:rounded-full before:bg-[var(--accent)]"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        ) : null}

        <nav aria-label="More projects" className="grid grid-cols-2 border-t border-border text-xs">
          <Link
            href={projectHref(previous.id)}
            className="flex flex-col gap-0.5 border-r border-border px-4 py-4 transition-colors hover:bg-muted sm:px-5"
          >
            <span className="text-muted-foreground">Previous</span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
              <span className="size-2 rounded-full" style={{ background: `var(--c-${previous.accent})` }} aria-hidden />
              {previous.title}
            </span>
          </Link>
          <Link
            href={projectHref(next.id)}
            className="flex flex-col items-end gap-0.5 px-4 py-4 text-right transition-colors hover:bg-muted sm:px-5"
          >
            <span className="text-muted-foreground">Next</span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
              {next.title}
              <span className="size-2 rounded-full" style={{ background: `var(--c-${next.accent})` }} aria-hidden />
            </span>
          </Link>
        </nav>
      </main>
      <SiteFooter />
    </SiteShell>
  );
}
