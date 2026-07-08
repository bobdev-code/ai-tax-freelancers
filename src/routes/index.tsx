import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import {
  Receipt, ShieldCheck, Sparkles, FileCheck2, CheckCircle2, ArrowRight,
  Scale, AlertTriangle, ClipboardList, FileSearch, Landmark, Github,
  BadgeCheck, GitBranch, Code2, Cpu, Database, Layers, XCircle, Rocket,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TaxPilot AI — The intelligent OS for German freelancers" },
      { name: "description", content: "A workflow & decision-support tool for freelance tax preparation in Germany. Deterministic rules, explainable flags, accountant-ready exports. Not a certified tax advisor." },
    ],
  }),
  component: Landing,
});

function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-display font-bold text-lg">
          <div className="size-8 rounded-lg bg-mint flex items-center justify-center text-primary-foreground">
            <Receipt className="size-4" />
          </div>
          TaxPilot<span className="text-primary"> AI</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#problem" className="hover:text-foreground transition">Problem</a>
          <a href="#workflow" className="hover:text-foreground transition">Workflow</a>
          <a href="#prototype" className="hover:text-foreground transition">Prototype</a>
          <Link to="/dashboard" className="hover:text-foreground transition">Demo</Link>
          <a href="#legal" className="hover:text-foreground transition">Legal</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="https://github.com/bobdev-code/Taxpilot" target="_blank" rel="noreferrer"
             className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline-flex items-center gap-1.5">
            <Github className="size-4" /> Repo
          </a>
          <Link to="/dashboard" className="rounded-lg bg-mint text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition">
            Open demo
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-hero relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground mb-6">
            <Sparkles className="size-3 text-primary" /> Group project · MVP prototype · Germany-only
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.05]">
            The intelligent OS for<br />
            <span className="text-gradient">German freelancers.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-lg">
            TaxPilot AI helps Freiberufler prepare tax documentation throughout the year. It structures receipts, flags gaps with plain-language explanations, and produces an accountant-ready export — <em className="text-foreground/80 not-italic font-medium">it does not replace a Steuerberater.</em>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/dashboard" className="rounded-lg bg-mint text-primary-foreground px-5 py-3 text-sm font-semibold inline-flex items-center gap-2 shadow-glow">
              Try the prototype <ArrowRight className="size-4" />
            </Link>
            <a href="#workflow" className="rounded-lg border border-border bg-card/50 px-5 py-3 text-sm font-medium hover:bg-card transition inline-flex items-center gap-2">
              See the workflow
            </a>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            <Stat k="5" v="workflow stages" />
            <Stat k="100%" v="deterministic rules" />
            <Stat k="0" v="black-box AI decisions" />
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-8 bg-mint opacity-20 blur-3xl rounded-full" />
          <img src={heroImg} alt="TaxPilot AI dashboard preview" width={1536} height={1024}
               className="relative rounded-2xl border border-border shadow-glow" />
        </div>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-2xl font-display font-bold text-gradient">{k}</div>
      <div className="text-xs text-muted-foreground mt-1">{v}</div>
    </div>
  );
}

function Problem() {
  const items = [
    { icon: ClipboardList, t: "Hours lost sorting receipts", d: "Freelancers scramble to sort invoices and receipts, often catching up at the last minute." },
    { icon: FileSearch, t: "Unclear deductibility", d: "Hard to know in the moment whether an expense qualifies — rules vary by category and context." },
    { icon: AlertTriangle, t: "Missing documentation", d: "Receipts arrive incomplete — no date, no category, no context — creating review headaches later." },
    { icon: Landmark, t: "Expensive accountant time", d: "Steuerberater spend billable hours on basic sorting instead of actual tax expertise." },
  ];
  return (
    <section id="problem" className="py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-primary mb-3">01 · The problem</div>
          <h2 className="text-4xl font-bold">Freelance tax prep in Germany is manual, stressful, and error-prone.</h2>
          <p className="mt-4 text-muted-foreground">
            The risk isn't just time — it's missed deductions, and that means lost money.
          </p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-2xl bg-card border border-border p-6 hover:border-primary/40 transition">
              <div className="size-10 rounded-lg bg-secondary flex items-center justify-center text-primary mb-4">
                <Icon className="size-5" />
              </div>
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TargetUser() {
  const items = [
    { t: "No dedicated bookkeeper", d: "Too small for a full-time accountant, too complex for a spreadsheet." },
    { t: "Files receipts irregularly", d: "Documentation happens in bursts, not consistently — context gets lost." },
    { t: "Wants confidence, not just software", d: "Needs to know what's missing and why something is flagged, in plain language." },
    { t: "Still needs their Steuerberater", d: "Wants to arrive with organized, review-ready documentation — not replace them." },
  ];
  return (
    <section className="py-24 border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary mb-3">02 · Target user</div>
          <h2 className="text-4xl font-bold">The German Freelancer.</h2>
          <p className="mt-4 text-muted-foreground">
            Self-employed professionals — Freiberufler and Einzelunternehmer — juggling client work and admin. Designers, consultants, developers, coaches.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-mint/10 text-primary">
            <BadgeCheck className="size-3.5" /> Scope: Germany only
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map(({ t, d }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-semibold text-sm">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  const steps = [
    { n: "01", t: "Intake", d: "Freelancer logs a receipt manually via the API-first creation flow." },
    { n: "02", t: "Rule Check", d: "The deterministic rule engine evaluates it — no black-box output." },
    { n: "03", t: "Missing Info", d: "The system flags gaps needing input, per-receipt." },
    { n: "04", t: "Review", d: "Uncertain cases enter the review queue for a human to confirm." },
    { n: "05", t: "Export", d: "A structured JSON package ready for the Steuerberater." },
  ];
  return (
    <section id="workflow" className="py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-widest text-primary mb-3">04 · Core workflow</div>
        <h2 className="text-4xl font-bold max-w-3xl">From receipt to accountant-ready export.</h2>
        <div className="mt-14 grid md:grid-cols-5 gap-4 relative">
          {steps.map(({ n, t, d }, i) => (
            <div key={n} className="rounded-2xl bg-card border border-border p-5 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-muted-foreground font-mono">{n}</span>
                <div className="size-7 rounded-full bg-mint text-primary-foreground text-xs font-semibold flex items-center justify-center">
                  {i + 1}
                </div>
              </div>
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-xl border border-primary/30 bg-mint/5 p-4 text-sm text-muted-foreground">
          Every flagged item shows a plain-language <span className="text-primary font-medium">"Why flagged?"</span> explanation with <span className="font-mono text-foreground">rule ID</span>, <span className="font-mono text-foreground">source ID</span>, and <span className="font-mono text-foreground">review level</span>.
        </div>
      </div>
    </section>
  );
}

function Prototype() {
  const cards = [
    { t: "Manual receipt intake", d: "API-first creation flow", icon: ClipboardList },
    { t: "Category classification", d: "Rule-based, transparent", icon: Layers },
    { t: "Review queue", d: "Surfaces uncertain cases", icon: FileSearch },
    { t: "Missing-info detection", d: "Per-receipt gap flags", icon: AlertTriangle },
    { t: "Deterministic rule engine", d: "@taxpilot/rules package", icon: Cpu },
    { t: "\"Why flagged?\" explanations", d: "Rule ID + source ID + level", icon: Sparkles },
    { t: "Tax Rule Registry panel", d: "Visible rule cockpit", icon: Scale },
    { t: "Receipt detail tabs", d: "Overview · Evidence · Rules · Export", icon: FileCheck2 },
    { t: "Accountant export package", d: "JSON preview + download", icon: Database },
  ];
  return (
    <section id="prototype" className="py-24 border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-widest text-primary mb-3">05 · Current prototype</div>
        <h2 className="text-4xl font-bold max-w-3xl">What's actually built and working today.</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl">Real, running code — not mockups.</p>
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {cards.map(({ t, d, icon: Icon }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-5 hover:border-primary/40 transition">
              <Icon className="size-5 text-primary mb-3" />
              <div className="font-semibold text-sm">{t}</div>
              <div className="text-xs text-muted-foreground mt-1">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Architecture() {
  const parts = [
    { t: "apps/web", d: "React + TypeScript + Vite, Tailwind SaaS dashboard shell", icon: Code2 },
    { t: "api / apps/api", d: "Vercel serverless routes + local Node API foundation", icon: Cpu },
    { t: "packages/shared", d: "Domain model & receipt input validation", icon: Layers },
    { t: "packages/rules", d: "Deterministic rule engine (@taxpilot/rules)", icon: Scale },
    { t: "packages/db", d: "Prisma / SQLite schema — foundation, not yet wired in", icon: Database },
    { t: "Deployment", d: "Single Vercel project — web app and API routes served together", icon: Rocket },
  ];
  return (
    <section className="py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-widest text-primary mb-3">07 · Technical architecture</div>
        <h2 className="text-4xl font-bold max-w-3xl">How the prototype is put together.</h2>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parts.map(({ t, d, icon: Icon }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-6">
              <Icon className="size-5 text-primary mb-3" />
              <div className="font-mono text-sm">{t}</div>
              <div className="text-sm text-muted-foreground mt-2">{d}</div>
            </div>
          ))}
        </div>
        <a href="https://github.com/bobdev-code/Taxpilot" target="_blank" rel="noreferrer"
           className="mt-8 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm hover:border-primary/40 transition">
          <Github className="size-4" /> github.com/bobdev-code/Taxpilot
          <span className="text-xs text-muted-foreground ml-2">· 98% TypeScript · phases 1–4</span>
        </a>
      </div>
    </section>
  );
}

function Legal() {
  const items = [
    { t: "Deterministic, not black-box", d: "Every classification comes from a transparent rule engine — no opaque model output." },
    { t: "Traceable explanations", d: "Rule ID, source ID, and review level attached to every flagged item." },
    { t: "Human-in-the-loop", d: "The review queue routes uncertain cases to a person before anything is finalized." },
    { t: "Accountant stays in charge", d: "Output is a prep package for the Steuerberater — the final call is always theirs." },
  ];
  return (
    <section id="legal" className="py-24 border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-widest text-primary mb-3">08 · Legal & safety</div>
        <h2 className="text-4xl font-bold max-w-3xl">Explainable by design, not a decision-maker.</h2>
        <div className="mt-8 rounded-2xl border border-primary/40 bg-mint/5 p-6 text-sm md:text-base leading-relaxed">
          <ShieldCheck className="size-6 text-primary mb-3" />
          TaxPilot AI is <span className="font-semibold">not a certified tax advisor</span> and does not provide legally binding tax advice. It supports preparation, documentation, and review — <span className="font-semibold">never the final tax decision</span>.
        </div>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(({ t, d }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-5">
              <div className="font-semibold text-sm">{t}</div>
              <div className="mt-2 text-sm text-muted-foreground">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Limitations() {
  const nope = [
    "No login / production authentication",
    "No real multi-user database (memory-demo + browser fallback only)",
    "No OCR or PDF receipt recognition",
    "No DATEV or ELSTER integration",
    "No real tax calculation engine",
    "No legally binding recommendation of any kind",
  ];
  const roadmap = [
    { t: "Auth & multi-user", d: "Real authentication and a durable Postgres-backed store." },
    { t: "OCR / PDF intake", d: "Automatic receipt reading to replace manual entry." },
    { t: "DATEV / ELSTER links", d: "Direct integration paths into accountant and filing systems." },
    { t: "Round 2 improvements", d: "Refine based on Round 1 feedback (Class 13 → Class 17)." },
  ];
  return (
    <section className="py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary mb-3">09 · Limitations</div>
          <h2 className="text-3xl font-bold">What the MVP does not do yet.</h2>
          <p className="mt-3 text-sm text-muted-foreground">Honesty here is intentional — the sharpest MVPs are clear about scope, not maximal about claims.</p>
          <ul className="mt-6 space-y-2">
            {nope.map(n => (
              <li key={n} className="flex items-start gap-3 text-sm rounded-lg border border-border bg-card px-4 py-3">
                <XCircle className="size-4 text-destructive shrink-0 mt-0.5" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-primary mb-3">10 · Roadmap</div>
          <h2 className="text-3xl font-bold">From MVP to production-ready assistant.</h2>
          <div className="mt-6 space-y-3">
            {roadmap.map(({ t, d }, i) => (
              <div key={t} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                <div className="size-8 shrink-0 rounded-full bg-mint text-primary-foreground text-sm font-semibold flex items-center justify-center">{i + 1}</div>
                <div>
                  <div className="font-semibold">{t}</div>
                  <div className="text-sm text-muted-foreground mt-1">{d}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-primary/30 bg-mint/5 p-4 text-sm">
            <GitBranch className="size-4 text-primary inline-block mr-2" />
            Next milestone: <span className="font-semibold">Round 2 presentation, Class 17</span> — real persistence, real receipt automation.
          </div>
        </div>
      </div>
    </section>
  );
}

function Conclusion() {
  const items = [
    { t: "Real problem", d: "German freelancers lose time and money to manual, unclear tax prep." },
    { t: "Real prototype", d: "A working, deployed app — intake, rules, review, export — today." },
    { t: "Real boundaries", d: "Explainable, human-reviewed, never a substitute for a tax advisor." },
  ];
  return (
    <section className="py-24 border-t border-border bg-hero">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="text-xs uppercase tracking-widest text-primary mb-3">11 · Conclusion</div>
        <h2 className="text-4xl md:text-5xl font-bold max-w-3xl mx-auto">
          A sharp problem, a working prototype, an <span className="text-gradient">honest roadmap</span>.
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
          {items.map(({ t, d }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-6">
              <CheckCircle2 className="size-5 text-primary mb-3" />
              <div className="font-semibold">{t}</div>
              <div className="mt-2 text-sm text-muted-foreground">{d}</div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link to="/dashboard" className="rounded-lg bg-mint text-primary-foreground px-5 py-3 text-sm font-semibold inline-flex items-center gap-2 shadow-glow">
            Open the prototype <ArrowRight className="size-4" />
          </Link>
          <a href="https://github.com/bobdev-code/Taxpilot" target="_blank" rel="noreferrer"
             className="rounded-lg border border-border bg-card/50 px-5 py-3 text-sm font-medium hover:bg-card transition inline-flex items-center gap-2">
            <Github className="size-4" /> View source
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-6 flex flex-wrap justify-between items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-mint flex items-center justify-center text-primary-foreground">
            <Receipt className="size-3" />
          </div>
          <span className="font-display font-semibold text-foreground">TaxPilot AI</span>
          <span className="ml-3">· MVP prototype · Group project</span>
        </div>
        <div className="flex items-center gap-6">
          <span>Team: Robert · Julie · Alex</span>
          <a href="https://github.com/bobdev-code/Taxpilot" target="_blank" rel="noreferrer" className="hover:text-foreground inline-flex items-center gap-1.5">
            <Github className="size-4" /> bobdev-code/Taxpilot
          </a>
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <Problem />
      <TargetUser />
      <Workflow />
      <Prototype />
      <Architecture />
      <Legal />
      <Limitations />
      <Conclusion />
      <Footer />
    </div>
  );
}
