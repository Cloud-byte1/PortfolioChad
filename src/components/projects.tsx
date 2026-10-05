import Link from "next/link";
import { ProjectCard } from "@/components/work/project-card";
import { featuredWork, work } from "@/data/work";

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-14 px-4 py-6 sm:px-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="section-rule text-base font-semibold text-ink">Projects</h2>
          <p className="text-sm text-muted-foreground">
            A few highlights. Open one to see how it works and what I did on it.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {featuredWork.map((item) => (
            <ProjectCard key={item.id} item={item} />
          ))}
        </div>

        <Link
          href="/cad"
          className="w-fit text-sm font-medium text-foreground underline underline-offset-4 decoration-border transition-colors hover:decoration-foreground"
        >
          See all {work.length} projects in the CAD Lab
        </Link>
      </div>
    </section>
  );
}
