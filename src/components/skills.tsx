import Image from "next/image";
import { skillGroups, type SkillItem } from "@/data/portfolio";

function ProgramRow({ item }: { item: SkillItem }) {
  return (
    <div
      className="group inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-md border border-l-2 border-border bg-background pr-3 pl-1.5 text-left shadow-[0_1px_0_oklch(0_0_0/0.02)] transition-all hover:-translate-y-px hover:bg-muted hover:shadow-sm"
      style={{ borderLeftColor: item.color }}
    >
      <span className="grid size-6 shrink-0 place-items-center overflow-hidden rounded bg-white p-0.5 ring-1 ring-black/8">
        <Image
          src={item.logo}
          alt=""
          width={22}
          height={22}
          className="size-5 object-contain"
        />
      </span>
      <span className="text-[0.7rem] font-medium text-foreground">{item.label}</span>
      <span
        className="ml-0.5 size-1.5 rounded-full opacity-50 transition-opacity group-hover:opacity-100"
        style={{ backgroundColor: item.color }}
        aria-hidden
      />
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-14 px-4 py-6 sm:px-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="section-rule text-base font-semibold text-ink">Programs & Tools</h2>
          <p className="text-sm text-muted-foreground">
            Software and programming tools I work with.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          {skillGroups.map((group) => (
            <div
              key={group.title}
              className="flex flex-col gap-2.5 border-b border-border px-3 py-3 last:border-b-0 sm:flex-row sm:items-start sm:gap-4"
            >
              <h3 className="w-36 shrink-0 pt-2 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {group.title}
              </h3>
              <div className="flex min-w-0 flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <ProgramRow key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
