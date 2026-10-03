import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CadLab } from "@/components/cad/cad-lab";
import { site } from "@/data/portfolio";

export const metadata: Metadata = {
  title: `CAD Lab — ${site.name}`,
  description:
    "Interactive SolidWorks export viewer — orbit, pan, and zoom STL/GLB parts.",
  robots: { index: false, follow: false },
};

export default function CadPage() {
  return (
    <SiteShell>
      <SiteHeader />
      <main>
        <div className="border-b border-border px-4 py-3 sm:px-5">
          <p className="text-xs text-muted-foreground">
            Interactive SolidWorks exports — choose a model below or drop in an
            STL, GLB, or GLTF file from your computer.
          </p>
        </div>
        <CadLab />
      </main>
      <SiteFooter />
    </SiteShell>
  );
}
