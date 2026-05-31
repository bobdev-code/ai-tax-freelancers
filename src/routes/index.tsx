import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import {
  Receipt, Brain, ShieldCheck, Sparkles, Upload, Wand2, FileCheck2,
  CheckCircle2, ArrowRight, Camera, Banknote, Mail, TrendingUp, Lock, Users
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ledgr — AI Tax Assistant for Freelancers" },
      { name: "description", content: "Automate receipts, maximize deductions, file with confidence." },
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
          Ledgr<span className="text-primary">.</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <Link to="/dashboard" className="hover:text-foreground transition">Dashboard</Link>
          <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          <button className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline">Sign in</button>
          <button className="rounded-lg bg-mint text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition">
            Get early access
          </button>
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
            <Sparkles className="size-3 text-primary" /> Pitch Deck 2026 · Now in private beta
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.05]">
            Less tax friction.<br />
            <span className="text-gradient">More confidence.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-lg">
            Ledgr is the AI co-pilot for freelancers. We extract every receipt, classify every expense, and apply deduction logic so you keep more of what you earn.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="rounded-lg bg-mint text-primary-foreground px-5 py-3 text-sm font-semibold inline-flex items-center gap-2 shadow-glow">
              Start free trial <ArrowRight className="size-4" />
            </button>
            <button className="rounded-lg border border-border bg-card/50 px-5 py-3 text-sm font-medium hover:bg-card transition">
              Watch demo
            </button>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            <Stat k="81%" v="feel taxes are confusing" />
            <Stat k="70M+" v="US freelancers" />
            <Stat k="57%" v="SMBs adopting AI" />
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-8 bg-mint opacity-20 blur-3xl rounded-full" />
          <img src={heroImg} alt="Ledgr dashboard preview" width={1536} height={1024}
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
    { icon: Wand2, t: "Unclear deductibility", d: "Freelancers struggle to know which expenses qualify, leaving money on the table." },
    { icon: Upload, t: "Fragmented records", d: "Receipts scattered across email, drawers, banking apps and screenshots." },
    { icon: ShieldCheck, t: "Compliance anxiety", d: "Fear of mistakes turns tax season into a recurring source of stress." },
  ];
  return (
    <section className="py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-primary mb-3">The problem</div>
          <h2 className="text-4xl font-bold">Tax prep is still opaque for independent workers.</h2>
          <p className="mt-4 text-muted-foreground">
            Most freelancers manage hundreds of small purchases across tools, subscriptions and travel — with limited tax knowledge and no time for paperwork.
          </p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-2xl bg-card border border-border p-6 hover:border-primary/40 transition">
              <div className="size-10 rounded-lg bg-secondary flex items-center justify-center text-primary mb-4">
                <Icon className="size-5" />
              </div>
              <h3 className="font-semibold text-lg">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", icon: Banknote, t: "Connect", d: "Securely link bank accounts and email for automatic tracking." },
    { n: "02", icon: Camera, t: "Capture", d: "Snap photos of paper receipts or forward digital invoices." },
    { n: "03", icon: Brain, t: "Process", d: "AI extracts data and categorizes against current tax rules." },
    { n: "04", icon: CheckCircle2, t: "Review", d: "Verify suggestions and add notes — you stay in control." },
    { n: "05", icon: FileCheck2, t: "File", d: "Export tax-ready reports or file with integrated partners." },
  ];
  return (
    <section id="how" className="py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-widest text-primary mb-3">How it works</div>
        <h2 className="text-4xl font-bold max-w-2xl">From scattered evidence to tax-ready, in five steps.</h2>
        <div className="mt-14 grid md:grid-cols-5 gap-4 relative">
          {steps.map(({ n, icon: Icon, t, d }) => (
            <div key={n} className="rounded-2xl bg-card border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-muted-foreground font-mono">{n}</span>
                <Icon className="size-5 text-primary" />
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

function Pipeline() {
  return (
    <section id="features" className="py-24 border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary mb-3">The pipeline</div>
            <h2 className="text-4xl font-bold">One modular AI pipeline. Every kind of evidence.</h2>
            <p className="mt-4 text-muted-foreground">
              Broader intake means better coverage. A modular processing layer turns fragmented inputs into consistent, defensible tax logic.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: Camera, t: "Receipt images", d: "Mobile capture surfaces date, merchant, amount from paper." },
                { icon: Receipt, t: "PDF invoices", d: "Structured transaction details with high extraction accuracy." },
                { icon: Banknote, t: "Bank data", d: "Transaction streams reveal recurring patterns documents miss." },
                { icon: Mail, t: "Email forwarding", d: "Forward a subscription receipt — it's filed in seconds." },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="flex gap-4">
                  <div className="size-10 shrink-0 rounded-lg bg-mint/10 border border-primary/30 flex items-center justify-center text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{t}</div>
                    <div className="text-sm text-muted-foreground">{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-card border border-border p-8">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Processing stages</div>
            <ol className="space-y-5">
              {[
                ["Data extraction", "OCR + parsing convert raw documents into structured fields."],
                ["Classification", "Models assign categories: travel, equipment, software, meals…"],
                ["Tax rule engine", "Deduction logic evaluates eligibility and applies thresholds."],
                ["Learning loop", "Your corrections improve future classification confidence."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4 pb-5 last:pb-0 border-b border-border/50 last:border-0">
                  <div className="size-8 shrink-0 rounded-full bg-mint text-primary-foreground font-semibold text-sm flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{t}</div>
                    <div className="text-sm text-muted-foreground mt-1">{d}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function Dashboard() {
  const expenses = [
    { v: "Adobe Creative Cloud", c: "Software", a: "$54.99", s: "deduct" },
    { v: "Uber — JFK to Manhattan", c: "Travel", a: "$72.40", s: "deduct" },
    { v: "WeWork day pass", c: "Workspace", a: "$45.00", s: "deduct" },
    { v: "Apple Store — USB-C hub", c: "Equipment", a: "$89.00", s: "review" },
    { v: "Starbucks (client meeting)", c: "Meals 50%", a: "$18.30", s: "deduct" },
  ];
  return (
    <section id="dashboard" className="py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-widest text-primary mb-3">Product preview</div>
        <h2 className="text-4xl font-bold max-w-2xl">A dashboard built for review, not data entry.</h2>

        <div className="mt-12 rounded-2xl border border-border bg-card overflow-hidden shadow-glow">
          {/* fake browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/40">
            <div className="flex gap-1.5">
              <div className="size-3 rounded-full bg-destructive/60" />
              <div className="size-3 rounded-full bg-primary/40" />
              <div className="size-3 rounded-full bg-primary/60" />
            </div>
            <div className="mx-auto text-xs text-muted-foreground">app.ledgr.ai / dashboard</div>
          </div>

          <div className="grid lg:grid-cols-[220px_1fr]">
            {/* sidebar */}
            <aside className="border-r border-border p-5 hidden lg:block">
              <div className="text-xs text-muted-foreground mb-3">WORKSPACE</div>
              <div className="space-y-1 text-sm">
                {["Overview", "Expenses", "Income", "Deductions", "Reports", "Filing"].map((x, i) => (
                  <div key={x} className={`px-3 py-2 rounded-lg ${i===0 ? "bg-mint/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                    {x}
                  </div>
                ))}
              </div>
            </aside>

            {/* main */}
            <div className="p-6">
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <KPI label="Tracked YTD" value="$24,318" delta="+12.4%" />
                <KPI label="Est. deductions" value="$8,742" delta="+$430 this week" />
                <KPI label="Receipts processed" value="412" delta="98% auto-classified" />
              </div>

              <div className="rounded-xl border border-border">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="font-semibold flex items-center gap-2">
                    <TrendingUp className="size-4 text-primary" /> Recent activity
                  </div>
                  <div className="text-xs text-muted-foreground">Auto-synced 2 min ago</div>
                </div>
                <div className="divide-y divide-border">
                  {expenses.map((e) => (
                    <div key={e.v} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-4 py-3 text-sm">
                      <div>
                        <div className="font-medium">{e.v}</div>
                        <div className="text-xs text-muted-foreground">Today · auto-imported</div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">{e.c}</span>
                      <span className="font-mono tabular-nums">{e.a}</span>
                      {e.s === "deduct" ? (
                        <span className="text-xs px-2 py-1 rounded-md bg-mint/10 text-primary border border-primary/30 inline-flex items-center gap-1">
                          <CheckCircle2 className="size-3" /> Deductible
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-md bg-accent/10 text-accent border border-accent/30">
                          Review
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function KPI({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-display font-bold">{value}</div>
      <div className="mt-1 text-xs text-primary">{delta}</div>
    </div>
  );
}

function Trust() {
  const items = [
    { icon: Lock, t: "Bank-grade security", d: "End-to-end encryption and SOC2-aligned controls protect your data." },
    { icon: Users, t: "Human in the loop", d: "You review every AI-driven decision before anything is filed." },
    { icon: ShieldCheck, t: "Dynamic rule engine", d: "Tax rules update automatically as regulations change." },
  ];
  return (
    <section className="py-24 border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-widest text-primary mb-3">Built on trust</div>
        <h2 className="text-4xl font-bold max-w-2xl">Designed around the risks freelancers actually worry about.</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-6">
              <Icon className="size-6 text-primary mb-4" />
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    { name: "Starter", price: "$0", desc: "For freelancers getting organized.", features: ["50 receipts / month", "Basic categorization", "CSV export"], cta: "Start free" },
    { name: "Pro", price: "$14", desc: "Most popular for full-time independents.", features: ["Unlimited receipts", "Bank + email sync", "Deduction engine", "Quarterly reports"], cta: "Start free trial", featured: true },
    { name: "Studio", price: "$39", desc: "For agencies and small teams.", features: ["Everything in Pro", "Multi-entity", "Advisor access", "Priority support"], cta: "Talk to us" },
  ];
  return (
    <section id="pricing" className="py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-widest text-primary mb-3">Pricing</div>
        <h2 className="text-4xl font-bold max-w-2xl">Pays for itself with one missed deduction.</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div key={p.name} className={`rounded-2xl border p-6 ${p.featured ? "border-primary bg-card shadow-glow" : "border-border bg-card"}`}>
              <div className="flex items-baseline justify-between">
                <h3 className="font-display font-bold text-xl">{p.name}</h3>
                {p.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-mint text-primary-foreground">Popular</span>}
              </div>
              <div className="mt-4 text-4xl font-bold">{p.price}<span className="text-base text-muted-foreground font-normal">/mo</span></div>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {p.features.map(f => (
                  <li key={f} className="flex gap-2"><CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />{f}</li>
                ))}
              </ul>
              <button className={`mt-6 w-full rounded-lg py-2.5 text-sm font-semibold transition ${p.featured ? "bg-mint text-primary-foreground" : "border border-border hover:bg-secondary"}`}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24 border-t border-border">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-5xl font-bold">
          Build the future of <span className="text-gradient">freelancer financial health</span> with us.
        </h2>
        <p className="mt-6 text-muted-foreground max-w-xl mx-auto">
          Join the private beta. We'll onboard you personally and migrate your last 12 months of receipts for free.
        </p>
        <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="you@freelance.com"
                 className="flex-1 rounded-lg bg-card border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
          <button className="rounded-lg bg-mint text-primary-foreground px-5 py-3 text-sm font-semibold">
            Request access
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-mint" />
          <span>© 2026 Ledgr — info@taxassistant.ai</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Security</a>
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Pipeline />
        <Dashboard />
        <Trust />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
