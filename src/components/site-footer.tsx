import { site } from "@/data/portfolio";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {site.name}</p>
        <div className="flex gap-4">
          <a href={site.social.github} className="hover:text-foreground" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={site.social.linkedin} className="hover:text-foreground" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${site.email}`} className="hover:text-foreground">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
