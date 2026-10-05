"use client";

import { FormEvent, useState, startTransition } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { site } from "@/data/portfolio";

type Status = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setError("Please fill in your name, email, and a short message.");
      setStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That email doesn’t look quite right.");
      setStatus("error");
      return;
    }

    setError(null);
    setStatus("submitting");

    window.setTimeout(() => {
      startTransition(() => {
        setStatus("success");
        form.reset();
      });
    }, 650);
  }

  return (
    <section id="contact" className="scroll-mt-14 px-4 py-6 sm:px-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="section-rule text-base font-semibold text-ink" style={{ "--rule": "var(--c-violet)" } as React.CSSProperties}>Contact</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Open to internships, collaboration, and engineering work.{" "}
            <a
              className="font-medium text-foreground underline underline-offset-2"
              href={`mailto:${site.email}`}
            >
              {site.email}
            </a>
            {" · "}
            {site.location}
          </p>
        </div>

        {status === "success" ? (
          <div
            className="flex flex-col gap-2 rounded-lg border border-border bg-muted/50 p-4"
            role="status"
          >
            <h3 className="text-sm font-semibold text-ink">Message ready</h3>
            <p className="text-sm text-muted-foreground">
              Thanks — this demo form confirms your note locally. For a real reply,
              email {site.email}.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit rounded-full"
              onClick={() => setStatus("idle")}
            >
              Send another
            </Button>
          </div>
        ) : (
          <form className="flex flex-col gap-3" onSubmit={onSubmit} noValidate>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-xs">
                <span className="font-medium text-foreground">Name</span>
                <Input name="name" placeholder="Your name" autoComplete="name" required />
              </label>
              <label className="flex flex-col gap-1.5 text-xs">
                <span className="font-medium text-foreground">Email</span>
                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </label>
            </div>
            <label className="flex flex-col gap-1.5 text-xs">
              <span className="font-medium text-foreground">Message</span>
              <Textarea
                name="message"
                placeholder="What are you working on?"
                rows={4}
                required
              />
            </label>
            {status === "error" && error ? (
              <p className="text-xs text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <Button
              type="submit"
              size="sm"
              className="h-8 w-fit rounded-full px-3.5 text-xs"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Sending…" : "Send message"}
              <Send data-icon="inline-end" />
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
