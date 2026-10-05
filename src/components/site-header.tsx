"use client";

import { useLayoutEffect } from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/data/portfolio";
import { toggleTheme } from "@/lib/theme";

const links = [
  { href: "/#about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/cad", label: "CAD Lab" },
  { href: "/#skills", label: "Programs" },
] as const;

export function SiteHeader() {
  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const theme =
      savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);


  return (
    <header className="sticky top-0 z-[100] xl:hidden border-b border-border bg-background/95 shadow-[0_1px_0_oklch(0_0_0/0.03)] backdrop-blur-md">
      <div className="flex h-12 min-w-0 items-center justify-between gap-3 px-3 sm:px-5">
        <Link href="/#top" className="shrink-0 font-brand text-[0.65rem] text-ink sm:text-[0.7rem]">
          {site.shortName}
        </Link>

        <div className="flex min-w-0 items-center gap-2">
          <nav className="flex min-w-0 items-center gap-2 sm:mr-2 sm:gap-5" aria-label="Primary">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-[0.65rem] font-medium text-muted-foreground transition-colors hover:text-foreground sm:text-[0.8rem]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={toggleTheme}
            aria-label="Toggle black and white theme"
            title="Toggle black and white theme"
          >
            <Sun className="theme-icon-light" aria-hidden />
            <Moon className="theme-icon-dark" aria-hidden />
          </Button>
        </div>
      </div>
    </header>
  );
}
