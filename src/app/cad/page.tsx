import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
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
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="flex h-12 items-center justify-between px-4 sm:px-5">
          <Link href="/" className="font-brand text-[0.7rem] text-ink">
            {site.shortName}
          </Link>
          <Link
            href="/"
            className="text-[0.8rem] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to portfolio
          </Link>
        </div>
      </header>
      <main>
        <div className="border-b border-border px-4 py-3 sm:px-5">
          <p className="text-xs text-muted-foreground">
            CAD Lab is parked here until your STL files land. Drop exports below
            anytime — this page stays off the main nav for now.
          </p>
        </div>
        <CadLab />
      </main>
      <SiteFooter />
    </SiteShell>
  );
}
