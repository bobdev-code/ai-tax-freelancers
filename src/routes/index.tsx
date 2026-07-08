import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import {
  Receipt, ShieldCheck, Sparkles, ArrowRight, Scale, FileCheck2,
  Github, Cpu, ClipboardList, FileSearch, AlertTriangle, CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TaxPilot AI — Tax documentation for German freelancers" },
      { name: "description", content: "Structure receipts, get plain-language 'Why flagged?' explanations backed by rule IDs, and export an accountant-ready JSON package. Not a certified tax advisor." },
    ],
  }),
  component: Landing,
});

function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <div className="size-8 rounded-lg bg-mint flex items-center justify-center text-primary-foreground">
            <Receipt className="size-4" />
          </div>
          TaxPilot<span className="text-primary"> AI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <a href="#rules" className="hover:text-foreground transition">Rule engine</a>
          <a href="#safety" className="hover:text-foreground transition">Safety</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="https://github.com/bobdev-code/Taxpilot" target="_blank" rel="noreferrer"
             className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline-flex items-center gap-1.5">
            <Github className="size-4" />
          </a>
          <Link to="/dashboard" className="rounded-lg bg-mint text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition inline-flex items-center gap-1.5">
            Open app <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="bg-hero relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground mb-6">
            <Sparkles className="size-3 text-primary" /> Built for Freiberufler in Germany
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.05]">
            Tax documentation,<br />
            <span className="text-gradient">actually explainable.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-lg">
            Log a receipt. A deterministic rule engine classifies it, flags missing evidence with plain-language reasons, and prepares a JSON package your Steuerberater can consume in one click.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/dashboard" className="rounded-lg bg-mint text-primary-foreground px-5 py-3 text-sm font-semibold inline-flex items-center gap-2 shadow-glow">
              Open the app <ArrowRight className="size-4" />
            </Link>
            <a href="#how" className="rounded-lg border border-border bg-card/50 px-5 py-3 text-sm font-medium hover:bg-card transition">
              See how it works
            </a>
          </div>
          <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            Decision-support tool. Not a certified tax advisor.
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-8 bg-mint opacity-20 blur-3xl rounded-full" />
          <Link to="/dashboard" className="block relative group">
            <img src={heroImg} alt="TaxPilot AI app preview" width={1536} height={1024}
                 className="relative rounded-2xl border border-border shadow-glow" />
            <div className="absolute inset-0 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-background/40">
              <div className="rounded-full bg-mint text-primary-foreground px-4 py-2 text-sm font-semibold inline-flex items-center gap-2">
                Open live demo <ArrowRight className="size-4" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: ClipboardList, t: "Intake", d: "Log a receipt manually — vendor, amount, VAT rate, evidence flags." },
    { icon: Cpu, t: "Rule check", d: "The deterministic engine (@taxpilot/rules) evaluates it — no black-box output." },
    { icon: AlertTriangle, t: "Missing info", d: "Per-receipt gap flags: missing VAT ID, missing invoice number, threshold breaches." },
    { icon: FileSearch, t: "Review", d: "Uncertain cases enter the review queue with a plain-language explanation." },
    { icon: FileCheck2, t: "Export", d: "Structured JSON, traceable to rule IDs, ready for the Steuerberater." },
  ];
  return (
    <section id="how" className="py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-primary mb-3">Workflow</div>
          <h2 className="text-4xl font-bold">From a single receipt to accountant-ready.</h2>
          <p className="mt-4 text-muted-foreground">Five stages. Every classification traceable to a rule ID and its legal source.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-5 gap-4">
          {steps.map(({ icon: Icon, t, d }, i) => (
            <div key={t} className="rounded-2xl bg-card border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-muted-foreground font-mono">0{i + 1}</span>
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-mint text-primary-foreground px-5 py-3 text-sm font-semibold shadow-glow">
            Try it now <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function RuleEngine() {
  const samples = [
    { id: "RULE-DE-042", src: "EStG §4 Abs. 5 Nr. 2", t: "Meals — 70% deductibility cap" },
    { id: "RULE-DE-108", src: "UStG §14 Abs. 4", t: "Invoice ≥ €250 requires VAT ID + invoice number" },
    { id: "RULE-DE-201", src: "EStG §6 Abs. 2", t: "GWG threshold — €800 net" },
    { id: "RULE-DE-114", src: "UStG §15", t: "Vorsteuerabzug — input VAT deduction" },
  ];
  return (
    <section id="rules" className="py-24 border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-[1fr_1.2fr] gap-12 items-start">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary mb-3">Rule engine</div>
          <h2 className="text-4xl font-bold">Every flag has a rule ID.</h2>
          <p className="mt-4 text-muted-foreground">
            When something is flagged, you see <span className="text-foreground font-medium">why</span> — with the rule ID, the legal source, a review level (auto / review / block), and a plain-language explanation.
          </p>
          <p className="mt-4 text-muted-foreground">
            No opaque model output. Just a transparent registry your Steuerberater can audit.
          </p>
          <Link to="/dashboard" className="mt-8 inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline">
            Browse the rule registry in the app <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="size-4 text-primary" />
            <div className="font-semibold text-sm">Tax Rule Registry</div>
            <span className="text-xs text-muted-foreground">· sample</span>
          </div>
          <div className="space-y-3">
            {samples.map(r => (
              <div key={r.id} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-secondary">{r.id}</span>
                  <span className="text-xs text-muted-foreground font-mono">{r.src}</span>
                </div>
                <div className="text-sm mt-1.5">{r.t}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Safety() {
  const items = [
    { t: "Deterministic", d: "Rule-based, not model-based. Reproducible outputs." },
    { t: "Traceable", d: "Every flag carries a rule ID and a legal source ID." },
    { t: "Human-in-the-loop", d: "Uncertain cases go to the review queue — never auto-finalized." },
    { t: "Accountant stays in charge", d: "The output is prep material. The final call is the Steuerberater's." },
  ];
  return (
    <section id="safety" className="py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-widest text-primary mb-3">Safety</div>
        <h2 className="text-4xl font-bold max-w-3xl">Explainable by design. Not a decision-maker.</h2>
        <div className="mt-8 rounded-2xl border border-primary/40 bg-mint/5 p-6 text-sm md:text-base leading-relaxed">
          <ShieldCheck className="size-6 text-primary mb-3" />
          TaxPilot AI is <span className="font-semibold">not a certified tax advisor</span> and does not provide legally binding tax advice. It supports preparation, documentation, and review — <span className="font-semibold">never the final tax decision</span>.
        </div>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(({ t, d }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-5">
              <CheckCircle2 className="size-5 text-primary mb-3" />
              <div className="font-semibold text-sm">{t}</div>
              <div className="mt-2 text-sm text-muted-foreground">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 border-t border-border bg-hero">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold">
          Ready to <span className="text-gradient">try it</span>?
        </h2>
        <p className="mt-4 text-muted-foreground">
          Add a receipt, watch the rule engine run, and download a Steuerberater-ready export — in under a minute.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/dashboard" className="rounded-lg bg-mint text-primary-foreground px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 shadow-glow">
            Open the app <ArrowRight className="size-4" />
          </Link>
          <a href="https://github.com/bobdev-code/Taxpilot" target="_blank" rel="noreferrer"
             className="rounded-lg border border-border bg-card/50 px-6 py-3 text-sm font-medium hover:bg-card transition inline-flex items-center gap-2">
            <Github className="size-4" /> View source
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto max-w-7xl px-6 flex flex-wrap justify-between items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-mint flex items-center justify-center text-primary-foreground">
            <Receipt className="size-3" />
          </div>
          <span className="font-display font-semibold text-foreground">TaxPilot AI</span>
          <span className="ml-3 text-xs">· Germany-only · MVP</span>
        </div>
        <a href="https://github.com/bobdev-code/Taxpilot" target="_blank" rel="noreferrer" className="hover:text-foreground inline-flex items-center gap-1.5 text-xs">
          <Github className="size-4" /> bobdev-code/Taxpilot
        </a>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <HowItWorks />
      <RuleEngine />
      <Safety />
      <CTA />
      <Footer />
    </div>
  );
}
