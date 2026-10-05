import type { ReactNode } from "react";
import { SideNav, SideStatus } from "@/components/side-panels";

/**
 * Page frame. On wide screens the left and right rails stay pinned while
 * the middle column scrolls; below that, pages use the top header instead.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-full min-w-0 w-full flex-1 overflow-x-clip bg-page">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 dot-grid opacity-70" aria-hidden />
      <div className="relative mx-auto grid w-full max-w-[1480px] xl:grid-cols-[minmax(240px,1fr)_minmax(0,760px)_minmax(240px,1fr)]">
        <aside className="sticky top-0 hidden h-svh self-start border-r border-dashed border-border xl:block">
          <SideNav />
        </aside>

        <div className="min-w-0 px-3 py-4 sm:px-4 sm:py-6 xl:px-5 xl:py-10">
          <div className="relative mx-auto min-w-0 w-full max-w-[720px] overflow-clip rounded-xl border border-border bg-background shadow-[0_1px_0_oklch(0_0_0/0.03)]">
            {children}
          </div>
        </div>

        <aside className="sticky top-0 hidden h-svh self-start border-l border-dashed border-border xl:block">
          <SideStatus />
        </aside>
      </div>
    </div>
  );
}
