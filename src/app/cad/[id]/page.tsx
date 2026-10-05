import { ViewTransition } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CadLab } from "@/components/cad/cad-lab";
import { SceneView } from "@/components/work/scene-view";
import { projectHref, sceneTransitionName } from "@/components/work/project-card";
import { work } from "@/data/work";
import { site } from "@/data/portfolio";

export const dynamicParams = false;

export function generateStaticParams() {
  return work.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/cad/[id]">): Promise<Metadata> {
  const { id } = await params;
  const item = work.find((entry) => entry.id === id);
  if (!item) return {};
  return {
    title: `${item.title} — ${site.name}`,
    description: item.summary,
  };
}

export default async function ProjectPage({ params }: PageProps<"/cad/[id]">) {
  const { id } = await params;
  const index = work.findIndex((entry) => entry.id === id);
  if (index === -1) notFound();

  const item = work[index];
  const previous = work[(index - 1 + work.length) % work.length];
  const next = work[(index + 1) % work.length];

  return (
    <SiteShell>
      <SiteHeader />
      <main>
        <article className="flex flex-col gap-5 px-4 pt-5 pb-7 sm:px-5">
          <Link
            href="/cad"
            className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            CAD Lab
          </Link>

          <figure className="flex flex-col gap-2">
            <ViewTransition name={sceneTransitionName(item.id)} share="morph" default="none">
              <SceneView scene={item.scene} label={item.caption} />
            </ViewTransition>
            <figcaption className="text-xs leading-relaxed text-muted-foreground">
              {item.caption}
            </figcaption>
          </figure>

          <header className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-muted-foreground">{item.discipline}</p>
            <h1 className="text-2xl font-bold tracking-tight text-ink">{item.title}</h1>
            <p className="max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
              {item.summary}
            </p>
          </header>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-sm font-semibold text-foreground">What I did</h2>
            <ul className="flex max-w-[64ch] flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
              {item.did.map((line) => (
                <li
                  key={line}
                  className="relative pl-3.5 before:absolute before:top-[0.6em] before:left-0 before:size-1 before:rounded-full before:bg-foreground/50"
                >
                  {line}
                </li>
              ))}
            </ul>
          </section>

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

        {item.hasModel ? (
          <div className="border-t border-border">
            <CadLab />
          </div>
        ) : null}

        <nav
          aria-label="More projects"
          className="grid grid-cols-2 border-t border-border text-xs"
        >
          <Link
            href={projectHref(previous.id)}
            className="flex flex-col gap-0.5 border-r border-border px-4 py-4 transition-colors hover:bg-muted sm:px-5"
          >
            <span className="text-muted-foreground">Previous</span>
            <span className="font-semibold text-foreground">{previous.title}</span>
          </Link>
          <Link
            href={projectHref(next.id)}
            className="flex flex-col items-end gap-0.5 px-4 py-4 text-right transition-colors hover:bg-muted sm:px-5"
          >
            <span className="text-muted-foreground">Next</span>
            <span className="font-semibold text-foreground">{next.title}</span>
          </Link>
        </nav>
      </main>
      <SiteFooter />
    </SiteShell>
  );
}
