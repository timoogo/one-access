import type { Metadata } from "next";
import { Accessibility, ArrowRight, Route, Ruler } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "ONE:ACCESS — Design System",
  description: "An inclusive, high-contrast design system for ONE:ACCESS.",
};

const principles = [
  { index: "01", icon: Route, title: "Same destination", description: "Interfaces acknowledge that people reach the same outcome through different paths." },
  { index: "02", icon: Ruler, title: "Measured contrast", description: "Hierarchy is carried by scale, spacing, shape, and language—not color alone." },
  { index: "03", icon: Accessibility, title: "Access by default", description: "Keyboard clarity, readable type, and generous targets are part of the visual system." },
];

export default function DesignSystemPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[90rem] flex-col border-x bg-background/95">
      <header className="grid min-h-20 grid-cols-[auto_1fr_auto] items-stretch border-b">
        <div className="flex items-center border-r px-5 sm:px-8"><span className="font-heading text-xl font-bold tracking-[-0.06em]">ONE:ACCESS</span></div>
        <div className="hidden items-center px-8 md:flex"><span className="oa-label text-muted-foreground">Inclusive interface reference / 2026</span></div>
        <LinkButton href="#system" className="h-full min-h-20 px-5 text-xs font-bold uppercase tracking-wider sm:px-8">Explore system <ArrowRight aria-hidden="true" data-icon="inline-end" /></LinkButton>
      </header>

      <section className="grid border-b lg:grid-cols-[5rem_1fr_22rem]">
        <aside className="hidden border-r lg:flex lg:flex-col lg:items-center lg:justify-between lg:py-8">
          <span className="oa-label text-primary [writing-mode:vertical-rl]">Reference / 2026</span>
          <span className="h-16 w-1 bg-primary" aria-hidden="true" />
          <span className="oa-label [writing-mode:vertical-rl]">Mobility · Usages · Society</span>
        </aside>
        <div className="flex min-h-[34rem] flex-col justify-between p-6 sm:p-10 lg:p-14">
          <div className="flex items-center gap-4"><Badge>System 01</Badge><Separator className="max-w-32" /><span className="oa-label text-muted-foreground">Visual language</span></div>
          <div className="max-w-4xl py-16">
            <h1 className="text-[clamp(3.5rem,9vw,8.75rem)] leading-[0.82]">One access.<span className="block text-primary">Different paths.</span></h1>
            <p className="mt-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">A reusable, high-contrast interface system shaped by public infrastructure, editorial wayfinding, and the realities of inclusive journeys.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="#system" size="lg" className="min-h-11 px-5 text-sm font-bold uppercase tracking-wide">View foundations <ArrowRight aria-hidden="true" data-icon="inline-end" /></LinkButton>
            <LinkButton href="#principles" variant="outline" size="lg" className="min-h-11 px-5 text-sm font-bold uppercase tracking-wide">Accessibility principles</LinkButton>
          </div>
        </div>
        <aside className="relative hidden overflow-hidden border-l p-8 lg:flex lg:flex-col lg:justify-between">
          <div className="oa-stripes absolute inset-x-0 top-0 h-10" aria-hidden="true" />
          <span className="oa-label mt-12 text-muted-foreground">Architectural composition</span>
          <blockquote className="border-l-2 border-primary pl-5 font-heading text-2xl font-semibold uppercase leading-tight">Accessibility is not an option. It is shared infrastructure.</blockquote>
        </aside>
      </section>

      <section id="system" aria-labelledby="system-title" className="grid border-b lg:grid-cols-[5rem_1fr]">
        <div className="hidden border-r lg:block" aria-hidden="true" />
        <div className="p-6 sm:p-10 lg:p-14">
          <div className="mb-8 flex items-center gap-4"><span className="font-heading text-xl font-bold text-primary">02</span><h2 id="system-title" className="text-2xl sm:text-3xl">System foundations</h2><Separator className="hidden max-w-40 sm:block" /></div>
          <div id="principles" className="grid border-l border-t md:grid-cols-3">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <Card key={principle.index} className="border-0 border-b border-r bg-transparent py-0 ring-0">
                  <CardHeader className="border-b p-5">
                    <div className="mb-8 flex items-center justify-between"><span className="font-heading text-lg font-bold text-primary">{principle.index}</span><Icon aria-hidden="true" className="size-6" strokeWidth={1.75} /></div>
                    <CardTitle className="text-xl uppercase">{principle.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5"><CardDescription className="text-sm leading-6">{principle.description}</CardDescription></CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="grid min-h-24 items-center gap-4 px-6 py-5 sm:grid-cols-[1fr_auto] sm:px-10 lg:px-14">
        <p className="font-heading text-xl font-semibold uppercase">Built for more human public experiences.</p>
        <span className="oa-label text-muted-foreground">Black · Concrete · Signal orange</span>
      </footer>
    </main>
  );
}
