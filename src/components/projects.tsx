"use client";

import BentoCard from "@/components/bento-card";

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-14 px-4 py-6 sm:px-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="section-rule text-base font-semibold text-ink">Projects</h2>
          <p className="text-sm text-muted-foreground">
            Assemblies you can orbit and software that keeps engineering context clear.
          </p>
        </div>

        <BentoCard />
      </div>
    </section>
  );
}
