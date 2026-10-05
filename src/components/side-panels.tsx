"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Mail } from "lucide-react";
import { site } from "@/data/portfolio";
import { useThemeMode } from "@/lib/motion-hooks";
import { toggleTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home", color: "var(--c-cobalt)" },
  { href: "/projects", label: "Projects", color: "var(--c-turf)" },
  { href: "/cad", label: "CAD Lab", color: "var(--c-flame)" },
  { href: "/resume", label: "Resume", color: "var(--c-violet)" },
] as const;

const palette = ["--c-turf", "--c-cobalt", "--c-flame", "--c-race", "--c-violet"];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Left rail: name, pages, and how to reach me. Stays put while the middle scrolls. */
export function SideNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col justify-between py-10">
      <div className="flex flex-col">
        <Link href="/" className="flex items-center gap-3 border-y border-dashed border-border px-6 py-4">
          <span className="flex h-6 items-end gap-[3px]" aria-hidden>
            {palette.map((c, i) => (
              <span
                key={c}
                className="w-[4px] rounded-full"
                style={{ background: `var(${c})`, height: `${10 + ((i * 7) % 15)}px` }}
              />
            ))}
          </span>
          <span className="font-brand text-[0.72rem] text-ink">{site.name}</span>
        </Link>

        <nav aria-label="Pages" className="mt-8 flex flex-col">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-2.5 border-b border-dashed border-border px-6 py-2.5 text-sm transition-colors first:border-t",
                  active ? "font-medium text-ink" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "size-2 rounded-[3px] transition-transform",
                    active ? "scale-100" : "scale-0 group-hover:scale-75"
                  )}
                  style={{ background: item.color }}
                  aria-hidden
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col text-sm">
        <p className="border-t border-dashed border-border px-6 py-2.5 text-muted-foreground">
          Drop me a message anytime
        </p>
        <a
          href={`mailto:${site.email}`}
          className="flex items-center gap-2 border-y border-dashed border-border px-6 py-2.5 font-medium text-ink transition-colors hover:text-[var(--c-race-ink)]"
        >
          <Mail className="size-4 text-[var(--c-race)]" aria-hidden />
          {site.email.toLowerCase()}
        </a>
        <div className="mt-6 flex border-y border-dashed border-border">
          {[
            { label: "LinkedIn", href: site.social.linkedin, color: "var(--c-cobalt)" },
            { label: "GitHub", href: site.social.github, color: "var(--c-violet)" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center gap-2 px-6 py-2.5 text-muted-foreground transition-colors first:border-r first:border-dashed first:border-border hover:text-foreground"
            >
              <ExternalLink className="size-3.5" style={{ color: s.color }} aria-hidden />
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

const easternTime = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/New_York",
});

function subscribeMinute(callback: () => void) {
  const id = window.setInterval(callback, 30_000);
  return () => window.clearInterval(id);
}

/** Current Eastern time, refreshed every 30 s; empty on the server. */
function useEasternTime() {
  return useSyncExternalStore(
    subscribeMinute,
    () => easternTime.format(new Date()),
    () => null
  );
}

/** Right rail: availability, where I am, and the theme switch. */
export function SideStatus() {
  const time = useEasternTime();
  const theme = useThemeMode();

  return (
    <div className="flex flex-col items-stretch py-10 text-sm">
      <div className="mt-[4.5rem] flex flex-col">
        <p className="flex items-center justify-end gap-2.5 border-y border-dashed border-border px-6 py-2.5 font-medium text-ink">
          Open to internships
          <span className="relative flex size-2.5" aria-hidden>
            <span className="absolute inset-0 animate-ping rounded-full bg-[var(--c-turf)] opacity-60 motion-reduce:animate-none" />
            <span className="relative size-2.5 rounded-full bg-[var(--c-turf)]" />
          </span>
        </p>
        <p className="flex items-center justify-end gap-2.5 border-b border-dashed border-border px-6 py-2.5 text-muted-foreground">
          Florida State University
          <span className="tabular-nums text-xs text-muted-foreground/80">
            {time ? `${time} ET` : "ET"}
          </span>
        </p>
        <div className="flex items-center justify-end gap-3 border-b border-dashed border-border px-6 py-2.5 text-muted-foreground">
          <span id="dark-mode-label">Dark mode</span>
          <button
            type="button"
            role="switch"
            aria-checked={theme === "dark"}
            aria-labelledby="dark-mode-label"
            onClick={toggleTheme}
            className={cn(
              "relative h-6 w-11 rounded-full border border-border p-0.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              theme === "dark" ? "bg-ink" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "block size-[18px] rounded-full bg-background shadow-sm transition-transform duration-200",
                theme === "dark" && "translate-x-5"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
