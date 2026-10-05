"use client";

import Link from "next/link";
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
      <div className="flex flex-col gap-4">
        <h2 className="section-rule text-base font-semibold text-ink">{about.heading}</h2>
        <div className="flex max-w-[62ch] flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          {about.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <dl className="overflow-hidden rounded-lg border border-border text-sm">
          {about.facts.map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col gap-0.5 border-b border-border px-3 py-2.5 last:border-b-0 sm:flex-row sm:gap-4"
            >
              <dt className="w-28 shrink-0 text-xs font-semibold text-foreground sm:pt-px">
                {fact.label}
              </dt>
              <dd className="leading-relaxed text-muted-foreground">{fact.value}</dd>
            </div>
          ))}
        </dl>
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
            const isInternalPage = link.href.startsWith("/");
            return (
              <Button
                key={link.label}
                asChild
                size="sm"
                className="h-8 rounded-full px-3 text-xs"
              >
                {isInternalPage ? (
                  <Link href={link.href}>
                    <Icon data-icon="inline-start" />
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    {...(link.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                  >
                    <Icon data-icon="inline-start" />
                    {link.label}
                  </a>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
