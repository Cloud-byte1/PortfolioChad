"use client";

import { experience } from "@/data/portfolio";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-14 px-4 py-6 sm:px-5">
      <div className="flex flex-col gap-3">
        <h2 className="section-rule text-base font-semibold text-ink">Experience</h2>
        <ul className="flex flex-col">
          {experience.map((item) => (
            <li
              key={item.company}
              className="flex flex-col gap-1 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-[0.6rem] font-semibold text-ink"
                  aria-hidden
                >
                  {item.company.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-sm font-semibold text-ink">{item.company}</h3>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
              </div>
              <p className="shrink-0 pl-11 text-xs text-muted-foreground sm:pl-0 sm:text-right">
                {item.period}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
