import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CadLab } from "@/components/cad/cad-lab";
import { site } from "@/data/portfolio";

export const metadata: Metadata = {
  title: `CAD Lab — ${site.name}`,
  description: "3D renderings of Chad Carmichael’s CAD models that you can orbit and zoom.",
};

export default function CadPage() {
  return (
    <SiteShell>
      <SiteHeader />
      <main>
        <section className="border-b border-border px-4 pt-7 pb-5 sm:px-5">
          <h1 className="text-2xl font-bold tracking-tight text-ink">CAD Lab</h1>
          <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
            3D renderings of my CAD models. Drag to orbit, scroll to zoom.
          </p>
        </section>
        <section className="px-4 pt-6 pb-8 sm:px-5">
          <CadLab />
        </section>
      </main>
      <SiteFooter />
    </SiteShell>
  );
}
