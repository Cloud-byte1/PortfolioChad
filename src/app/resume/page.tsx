import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download, ExternalLink, FileText } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { site } from "@/data/portfolio";

export const metadata: Metadata = {
  title: `Resume — ${site.name}`,
  description: `${site.name}'s mechanical engineering resume.`,
};

export default function ResumePage() {
  return (
    <SiteShell>
      <SiteHeader />
      <main>
        <section className="px-4 py-6 sm:px-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Professional profile
                </p>
                <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-ink">
                  Resume
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {site.name} · {site.title}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline" className="rounded-full">
                  <Link href="/">
                    <ArrowLeft data-icon="inline-start" />
                    Back to portfolio
                  </Link>
                </Button>
                <Button asChild size="sm" className="rounded-full">
                  <a href={site.resumeFile} download>
                    <Download data-icon="inline-start" />
                    Download PDF
                  </a>
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-muted/30 shadow-[0_12px_35px_oklch(0_0_0/0.06)]">
              <div className="flex items-center justify-between border-b border-border bg-background px-3 py-2.5 sm:px-4">
                <span className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <FileText className="size-3.5 text-muted-foreground" aria-hidden />
                  Chad_Carmichael_Resume.pdf
                </span>
                <a
                  href={site.resumeFile}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Open PDF
                  <ExternalLink className="size-3" aria-hidden />
                </a>
              </div>

              <object
                data={`${site.resumeFile}#view=FitH&toolbar=1&navpanes=0`}
                type="application/pdf"
                className="h-[68svh] min-h-[560px] w-full bg-white"
                aria-label={`${site.name} resume PDF`}
              >
                <div className="grid min-h-[560px] place-items-center p-6 text-center">
                  <div className="max-w-sm">
                    <FileText className="mx-auto size-8 text-muted-foreground" aria-hidden />
                    <p className="mt-3 text-sm font-semibold text-foreground">
                      PDF preview is unavailable in this browser.
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Open or download the resume using the controls above.
                    </p>
                  </div>
                </div>
              </object>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteShell>
  );
}
