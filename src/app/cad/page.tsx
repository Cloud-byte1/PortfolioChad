import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProjectCard } from "@/components/work/project-card";
import { Reveal } from "@/components/reveal";
import { disciplines, work } from "@/data/work";
import { site } from "@/data/portfolio";

export const metadata: Metadata = {
  title: `CAD Lab — ${site.name}`,
  description:
    "Everything Chad Carmichael has designed, wired, and coded: mechanisms, housings, a custom PCB, firmware, and apps, each with an animation of how it works.",
};

export default function CadPage() {
  return (
    <SiteShell>
      <SiteHeader />
      <main>
        <section className="border-b border-border px-4 pt-7 pb-5 sm:px-5">
          <h1 className="text-2xl font-bold tracking-tight text-ink">CAD Lab</h1>
          <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
            Everything I’ve designed, wired, and coded. Point at a project to see it
            move, then open it to see what I did.
          </p>
        </section>

        {disciplines.map((group) => (
          <Reveal key={group.name}>
            <section
              aria-labelledby={`group-${group.name}`}
              className="border-b border-border px-4 py-6 sm:px-5"
            >
              <div className="mb-4 flex flex-col gap-1">
                <h2 id={`group-${group.name}`} className="text-lg font-bold tracking-tight text-ink">
                  {group.name}
                </h2>
                <p className="text-sm text-muted-foreground">{group.blurb}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {work
                  .filter((item) => item.discipline === group.name)
                  .map((item) => (
                    <ProjectCard key={item.id} item={item} />
                  ))}
              </div>
            </section>
          </Reveal>
        ))}
      </main>
      <SiteFooter />
    </SiteShell>
  );
}
