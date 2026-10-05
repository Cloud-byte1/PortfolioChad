import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProjectSwitcher } from "@/components/work/project-switcher";
import { site } from "@/data/portfolio";

export const metadata: Metadata = {
  title: `CAD Lab — ${site.name}`,
  description:
    "Everything Chad Carmichael has designed, wired, and coded: a smart golf mat, a NAS server, Stirling and V8 engines, and a college discovery app, each with an interactive figure.",
};

export default function CadPage() {
  return (
    <SiteShell>
      <SiteHeader />
      <main>
        <section className="border-b border-border px-4 pt-7 pb-5 sm:px-5">
          <h1 className="text-2xl font-bold tracking-tight text-ink">CAD Lab</h1>
          <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
            Everything I’ve designed, wired, and coded. Pick a project, click its drawing to
            make it move, then open it to see what I did.
          </p>
        </section>
        <section className="px-4 py-6 sm:px-5">
          <ProjectSwitcher />
        </section>
      </main>
      <SiteFooter />
    </SiteShell>
  );
}
