"use client";

import { useLayoutEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Programs" },
  { href: "#contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

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

  function toggleTheme() {
    const nextTheme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("theme", nextTheme);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="flex h-12 items-center justify-between px-4 sm:px-5">
        <a href="#top" className="font-brand text-[0.7rem] text-ink">
          {site.shortName}
        </a>

        <div className="flex items-center gap-2">
          <nav className="mr-2 hidden items-center gap-5 sm:flex" aria-label="Primary">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[0.8rem] text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
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

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="sm:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        className={cn(
          "border-t border-border px-4 py-3 sm:hidden",
          open ? "block" : "hidden"
        )}
        aria-label="Mobile"
      >
        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="py-1 text-sm text-foreground"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
