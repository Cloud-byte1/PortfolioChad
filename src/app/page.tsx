import { SiteShell } from "@/components/site-shell";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { About, Connect } from "@/components/about";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { Contact } from "@/components/contact";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <SiteShell>
      <SiteHeader />
      <main>
        <Connect />
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <SiteFooter />
    </SiteShell>
  );
}
