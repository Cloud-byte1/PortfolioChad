import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CadLab } from "@/components/cad/cad-lab";
import { WorkSheet } from "@/components/work/work-sheet";
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
            Everything I’ve designed, wired, and coded, in one place. Each project
            shows how the thing moves and what I did on it.
          </p>

          <nav aria-label="Projects in the CAD Lab" className="mt-5 grid gap-4 sm:grid-cols-3">
            {disciplines.map((group) => (
              <div key={group.name} className="flex flex-col gap-1.5">
                <a
                  href={`#${group.name.toLowerCase()}`}
                  className="text-xs font-semibold text-foreground underline-offset-2 hover:underline"
                >
                  {group.name}
                </a>
                <ul className="flex flex-col gap-1">
                  {work
                    .filter((item) => item.discipline === group.name)
                    .map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </nav>
        </section>

        {disciplines.map((group) => (
          <section
            key={group.name}
            id={group.name.toLowerCase()}
            className="scroll-mt-14 border-b border-border px-4 pt-6 sm:px-5"
          >
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold tracking-tight text-ink">{group.name}</h2>
              <p className="text-sm text-muted-foreground">{group.blurb}</p>
            </div>
            <div className="divide-y divide-border">
              {work
                .filter((item) => item.discipline === group.name)
                .map((item) => (
                  <WorkSheet key={item.id} item={item} />
                ))}
            </div>
          </section>
        ))}

        <CadLab />
      </main>
      <SiteFooter />
    </SiteShell>
  );
}
