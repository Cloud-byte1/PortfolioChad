"use client";

import { ExternalLink, FileText, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { about, connect } from "@/data/portfolio";

const connectIcons = {
  Resume: FileText,
  Contact: MessageSquare,
  GitHub: ExternalLink,
  LinkedIn: ExternalLink,
  Email: Mail,
} as const;

export function About() {
  return (
    <section id="about" className="scroll-mt-14 px-4 py-6 sm:px-5">
      <div className="flex flex-col gap-3">
        <h2 className="section-rule text-base font-semibold text-ink">About</h2>
        <ul className="flex flex-col gap-2.5 text-sm leading-relaxed text-muted-foreground">
          {about.bullets.map((item) => (
            <li
              key={item}
              className="relative pl-3.5 before:absolute before:left-0 before:content-['•']"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Connect() {
  return (
    <section id="connect" className="scroll-mt-14 px-4 py-5 sm:px-5">
      <div className="flex flex-col gap-3">
        <h2 className="section-rule text-base font-semibold text-ink">Connect</h2>
        <div className="flex flex-wrap gap-2">
          {connect.map((link) => {
            const Icon =
              connectIcons[link.label as keyof typeof connectIcons] ?? Mail;
            return (
              <Button
                key={link.label}
                asChild
                size="sm"
                className="h-8 rounded-full px-3 text-xs"
              >
                <a
                  href={link.href}
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  <Icon data-icon="inline-start" />
                  {link.label}
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
