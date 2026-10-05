import Link from "next/link";
import { ProjectSwitcher } from "@/components/work/project-switcher";

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-14 px-4 py-6 sm:px-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="section-rule text-base font-semibold text-ink">Projects</h2>
          <p className="text-sm text-muted-foreground">
            Pick a project to preview it. Click the drawing to make it move, or open the project
            to see what I did.
          </p>
        </div>

        <ProjectSwitcher />

        <Link
          href="/cad"
          className="w-fit text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
        >
          Go to the CAD Lab
        </Link>
      </div>
    </section>
  );
}
