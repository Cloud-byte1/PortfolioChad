import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-full min-w-0 w-full flex-1 overflow-x-hidden bg-page px-3 py-4 sm:px-4 sm:py-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 dot-grid opacity-70" aria-hidden />
      <div className="relative mx-auto min-w-0 w-full max-w-[720px] overflow-hidden rounded-xl border border-border bg-background shadow-[0_1px_0_oklch(0_0_0/0.03)]">
        {children}
      </div>
    </div>
  );
}
