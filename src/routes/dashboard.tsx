import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Receipt, Brain, Camera, Banknote, Mail, FileCheck2, CheckCircle2,
  Search, Filter, TrendingUp, Sparkles, ArrowRight, AlertCircle,
  Download, Plus, ChevronRight, BarChart3, Activity, PieChart as PieIcon,
  LayoutDashboard, FileText, Wallet, Settings, LogOut, Bell,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Ledgr" },
      { name: "description", content: "Interactive AI tax dashboard preview." },
    ],
  }),
  component: DashboardPage,
});

// ---------- mock data ----------
const monthlyData = [
  { m: "Jan", expenses: 1820, deductions: 640, income: 4200 },
  { m: "Feb", expenses: 2140, deductions: 820, income: 3900 },
  { m: "Mar", expenses: 1980, deductions: 710, income: 5100 },
  { m: "Apr", expenses: 2620, deductions: 980, income: 4700 },
  { m: "May", expenses: 2210, deductions: 850, income: 6200 },
  { m: "Jun", expenses: 2980, deductions: 1140, income: 5800 },
  { m: "Jul", expenses: 2440, deductions: 920, income: 6400 },
  { m: "Aug", expenses: 3120, deductions: 1280, income: 7100 },
  { m: "Sep", expenses: 2850, deductions: 1090, income: 6800 },
];

const categoryData = [
  { name: "Software", value: 4200, color: "oklch(0.84 0.16 170)" },
  { name: "Travel", value: 3100, color: "oklch(0.72 0.14 200)" },
  { name: "Equipment", value: 2400, color: "oklch(0.78 0.13 150)" },
  { name: "Workspace", value: 1800, color: "oklch(0.68 0.16 220)" },
  { name: "Meals", value: 900, color: "oklch(0.74 0.14 110)" },
  { name: "Other", value: 600, color: "oklch(0.6 0.04 250)" },
];

const allExpenses = [
  { id: 1, date: "Sep 12", vendor: "Adobe Creative Cloud", cat: "Software", amt: 54.99, status: "deduct", conf: 99, src: "email" },
  { id: 2, date: "Sep 11", vendor: "Uber — JFK → Manhattan", cat: "Travel", amt: 72.40, status: "deduct", conf: 96, src: "bank" },
  { id: 3, date: "Sep 11", vendor: "WeWork day pass", cat: "Workspace", amt: 45.00, status: "deduct", conf: 98, src: "receipt" },
  { id: 4, date: "Sep 10", vendor: "Apple Store — USB-C hub", cat: "Equipment", amt: 89.00, status: "review", conf: 64, src: "receipt" },
  { id: 5, date: "Sep 10", vendor: "Starbucks (client mtg)", cat: "Meals", amt: 18.30, status: "deduct", conf: 82, src: "receipt" },
  { id: 6, date: "Sep 09", vendor: "Figma Pro", cat: "Software", amt: 15.00, status: "deduct", conf: 99, src: "email" },
  { id: 7, date: "Sep 08", vendor: "Notion Workspace", cat: "Software", amt: 12.00, status: "deduct", conf: 99, src: "email" },
  { id: 8, date: "Sep 07", vendor: "Delta Airlines DL402", cat: "Travel", amt: 312.50, status: "deduct", conf: 95, src: "email" },
  { id: 9, date: "Sep 06", vendor: "Whole Foods", cat: "Meals", amt: 86.20, status: "personal", conf: 78, src: "bank" },
  { id: 10, date: "Sep 05", vendor: "Logitech MX Master", cat: "Equipment", amt: 99.00, status: "deduct", conf: 92, src: "receipt" },
  { id: 11, date: "Sep 04", vendor: "Airbnb — Lisbon", cat: "Travel", amt: 410.00, status: "review", conf: 58, src: "email" },
  { id: 12, date: "Sep 03", vendor: "ChatGPT Plus", cat: "Software", amt: 20.00, status: "deduct", conf: 99, src: "email" },
];

const insights = [
  { icon: TrendingUp, tone: "primary", t: "Software spend up 23%", d: "You're trending toward $5,100 by year-end — still well within typical deduction patterns." },
  { icon: AlertCircle, tone: "accent", t: "4 receipts need review", d: "Low-confidence classifications detected. Confirm or reassign in one click." },
  { icon: Sparkles, tone: "primary", t: "Missed deduction found", d: "Your Lisbon Airbnb (Sep 04) looks like a business trip — tag it to add $410." },
  { icon: CheckCircle2, tone: "primary", t: "Q3 ready to export", d: "All required fields validated. Generate a tax-ready PDF or CSV anytime." },
];

type Range = "30d" | "90d" | "ytd";
type ChartType = "area" | "bar" | "line" | "pie";
type Cat = "All" | "Software" | "Travel" | "Equipment" | "Meals" | "Workspace";
type Status = "All" | "deduct" | "review" | "personal";

export default function DashboardPage() {
  const [range, setRange] = useState<Range>("90d");
  const [chart, setChart] = useState<ChartType>("area");
  const [cat, setCat] = useState<Cat>("All");
  const [status, setStatus] = useState<Status>("All");
  const [query, setQuery] = useState("");
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return allExpenses.filter(e =>
      (cat === "All" || e.cat === cat) &&
      (status === "All" || e.status === status) &&
      (query === "" || e.vendor.toLowerCase().includes(query.toLowerCase()))
    );
  }, [cat, status, query]);

  const totals = useMemo(() => {
    const tracked = filtered.reduce((s, e) => s + e.amt, 0);
    const deduct = filtered.filter(e => e.status === "deduct").reduce((s, e) => s + e.amt, 0);
    const review = filtered.filter(e => e.status === "review").length;
    return { tracked, deduct, review, count: filtered.length };
  }, [filtered]);

  const seriesSlice = range === "30d" ? monthlyData.slice(-1) : range === "90d" ? monthlyData.slice(-3) : monthlyData;

  return (
    <div className="min-h-screen flex bg-background">
      <SidebarNav />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar query={query} setQuery={setQuery} />
        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Overview</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Welcome back, Jamal. Here's what your AI assistant processed this period.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <RangeToggle range={range} setRange={setRange} />
              <button className="rounded-lg border border-border bg-card px-3 py-2 text-sm inline-flex items-center gap-2 hover:bg-secondary transition">
                <Download className="size-4" /> Export
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPI label="Tracked" value={`$${totals.tracked.toFixed(2)}`} delta={`${totals.count} expenses`} icon={Wallet} />
            <KPI label="Est. deductions" value={`$${totals.deduct.toFixed(2)}`} delta="+$430 this week" icon={Sparkles} highlight />
            <KPI label="Needs review" value={String(totals.review)} delta="low confidence" icon={AlertCircle} />
            <KPI label="Auto-classified" value="98%" delta="412 receipts" icon={Brain} />
          </div>

          {/* Filters bar */}
          <div className="rounded-2xl border border-border bg-card p-4 flex flex-wrap items-center gap-3">
            <Filter className="size-4 text-muted-foreground" />
            <FilterChips
              label="Category"
              value={cat}
              options={["All", "Software", "Travel", "Equipment", "Meals", "Workspace"] as Cat[]}
              onChange={setCat}
            />
            <div className="h-5 w-px bg-border" />
            <FilterChips
              label="Status"
              value={status}
              options={["All", "deduct", "review", "personal"] as Status[]}
              onChange={setStatus}
              renderLabel={(v) => v === "All" ? "All" : v === "deduct" ? "Deductible" : v === "review" ? "Review" : "Personal"}
            />
            {(cat !== "All" || status !== "All" || query) && (
              <button onClick={() => { setCat("All"); setStatus("All"); setQuery(""); }}
                      className="ml-auto text-xs text-primary hover:underline">
                Clear filters
              </button>
            )}
          </div>

          {/* Chart + insights */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="font-semibold text-lg">AI output explorer</h2>
                  <p className="text-xs text-muted-foreground">Switch views to see what the pipeline produces.</p>
                </div>
                <ChartSwitcher chart={chart} setChart={setChart} />
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart(chart, seriesSlice, selectedSlice, setSelectedSlice)}
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                {chart === "pie" ? (
                  <span>Click a slice to drill in. {selectedSlice && <button onClick={() => setSelectedSlice(null)} className="text-primary hover:underline ml-1">Clear</button>}</span>
                ) : (
                  <>
                    <Legend color="primary" label="Expenses" />
                    <Legend color="accent" label="Income" />
                    <Legend color="muted" label="Deductions" />
                  </>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <Brain className="size-4 text-primary" /> AI insights
                </h2>
                <span className="text-xs text-muted-foreground">live</span>
              </div>
              <div className="space-y-3">
                {insights.map(({ icon: Icon, tone, t, d }) => (
                  <div key={t} className="rounded-xl border border-border p-3 hover:border-primary/40 transition cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <div className={`size-8 shrink-0 rounded-lg flex items-center justify-center ${tone === "primary" ? "bg-mint/10 text-primary" : "bg-accent/10 text-accent"}`}>
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">{t}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{d}</div>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pipeline + table */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-semibold text-lg mb-1">Inbox</h2>
              <p className="text-xs text-muted-foreground mb-4">Sources feeding the pipeline.</p>
              <div className="space-y-3">
                {[
                  { icon: Camera, t: "Receipt scans", n: 38, color: "primary" },
                  { icon: Mail, t: "Email forwards", n: 24, color: "accent" },
                  { icon: Banknote, t: "Bank sync", n: 142, color: "primary" },
                  { icon: FileText, t: "PDF invoices", n: 17, color: "accent" },
                ].map(({ icon: Icon, t, n, color }) => (
                  <div key={t} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary/40 cursor-pointer transition">
                    <div className={`size-9 rounded-lg flex items-center justify-center ${color === "primary" ? "bg-mint/10 text-primary" : "bg-accent/10 text-accent"}`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 text-sm font-medium">{t}</div>
                    <div className="text-xs text-muted-foreground">{n} items</div>
                  </div>
                ))}
                <button className="w-full mt-2 rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary inline-flex items-center justify-center gap-2 transition">
                  <Plus className="size-4" /> Connect source
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div>
                  <h2 className="font-semibold text-lg flex items-center gap-2">
                    <Activity className="size-4 text-primary" /> Recent activity
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} of {allExpenses.length} expenses</p>
                </div>
                <button className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                  View all <ArrowRight className="size-3" />
                </button>
              </div>
              <div className="divide-y divide-border max-h-[26rem] overflow-y-auto">
                {filtered.length === 0 && (
                  <div className="p-10 text-center text-sm text-muted-foreground">No expenses match these filters.</div>
                )}
                {filtered.map(e => (
                  <ExpenseRow key={e.id} e={e} />
                ))}
              </div>
            </div>
          </div>

          <BackLink />
        </main>
      </div>
    </div>
  );
}

// ---------- pieces ----------

function SidebarNav() {
  const items = [
    { icon: LayoutDashboard, t: "Overview", active: true },
    { icon: Receipt, t: "Expenses" },
    { icon: Wallet, t: "Income" },
    { icon: Sparkles, t: "Deductions" },
    { icon: BarChart3, t: "Reports" },
    { icon: FileCheck2, t: "Filing" },
  ];
  return (
    <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-card/40 p-5">
      <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg mb-8">
        <div className="size-8 rounded-lg bg-mint flex items-center justify-center text-primary-foreground">
          <Receipt className="size-4" />
        </div>
        Ledgr<span className="text-primary">.</span>
      </Link>
      <nav className="space-y-1 text-sm flex-1">
        {items.map(({ icon: Icon, t, active }) => (
          <div key={t} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${active ? "bg-mint/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
            <Icon className="size-4" /> {t}
          </div>
        ))}
      </nav>
      <div className="space-y-1 text-sm border-t border-border pt-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer">
          <Settings className="size-4" /> Settings
        </div>
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer">
          <LogOut className="size-4" /> Sign out
        </div>
      </div>
    </aside>
  );
}

function TopBar({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur flex items-center gap-4 px-6 sticky top-0 z-20">
      <div className="flex-1 max-w-md relative">
        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search expenses, vendors, categories…"
          className="w-full pl-10 pr-3 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary"
        />
      </div>
      <button className="relative size-9 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-secondary transition">
        <Bell className="size-4" />
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
      </button>
      <div className="flex items-center gap-2">
        <div className="size-9 rounded-full bg-mint text-primary-foreground font-semibold flex items-center justify-center text-sm">J</div>
        <div className="hidden sm:block text-sm">
          <div className="font-medium leading-tight">Jamal</div>
          <div className="text-xs text-muted-foreground leading-tight">Pro plan</div>
        </div>
      </div>
    </header>
  );
}

function KPI({ label, value, delta, icon: Icon, highlight }: { label: string; value: string; delta: string; icon: typeof Wallet; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? "border-primary/40 bg-mint/5 shadow-glow" : "border-border bg-card"}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
        <Icon className={`size-4 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <div className="text-2xl font-display font-bold">{value}</div>
      <div className={`text-xs mt-1 ${highlight ? "text-primary" : "text-muted-foreground"}`}>{delta}</div>
    </div>
  );
}

function RangeToggle({ range, setRange }: { range: Range; setRange: (r: Range) => void }) {
  const opts: { v: Range; l: string }[] = [{ v: "30d", l: "30d" }, { v: "90d", l: "90d" }, { v: "ytd", l: "YTD" }];
  return (
    <div className="inline-flex rounded-lg border border-border bg-card p-1">
      {opts.map(o => (
        <button key={o.v} onClick={() => setRange(o.v)}
                className={`px-3 py-1.5 text-xs rounded-md transition ${range === o.v ? "bg-mint text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          {o.l}
        </button>
      ))}
    </div>
  );
}

function ChartSwitcher({ chart, setChart }: { chart: ChartType; setChart: (c: ChartType) => void }) {
  const opts: { v: ChartType; icon: typeof Activity; label: string }[] = [
    { v: "area", icon: Activity, label: "Area" },
    { v: "bar", icon: BarChart3, label: "Bar" },
    { v: "line", icon: TrendingUp, label: "Line" },
    { v: "pie", icon: PieIcon, label: "Categories" },
  ];
  return (
    <div className="inline-flex rounded-lg border border-border bg-secondary/30 p-1">
      {opts.map(({ v, icon: Icon, label }) => (
        <button key={v} onClick={() => setChart(v)}
                title={label}
                className={`px-2.5 py-1.5 text-xs rounded-md inline-flex items-center gap-1.5 transition ${chart === v ? "bg-card text-primary border border-primary/40" : "text-muted-foreground hover:text-foreground"}`}>
          <Icon className="size-3.5" /> <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}

function FilterChips<T extends string>({ label, value, options, onChange, renderLabel }: {
  label: string; value: T; options: T[]; onChange: (v: T) => void; renderLabel?: (v: T) => string;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-xs text-muted-foreground mr-1">{label}:</span>
      {options.map(o => (
        <button key={o} onClick={() => onChange(o)}
                className={`text-xs px-2.5 py-1 rounded-full border transition ${value === o ? "bg-mint text-primary-foreground border-transparent" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"}`}>
          {renderLabel ? renderLabel(o) : o}
        </button>
      ))}
    </div>
  );
}

function Legend({ color, label }: { color: "primary" | "accent" | "muted"; label: string }) {
  const cls = color === "primary" ? "bg-primary" : color === "accent" ? "bg-accent" : "bg-muted-foreground/50";
  return <span className="inline-flex items-center gap-2"><span className={`size-2.5 rounded-full ${cls}`} />{label}</span>;
}

function ExpenseRow({ e }: { e: typeof allExpenses[number] }) {
  const srcIcon = e.src === "email" ? Mail : e.src === "bank" ? Banknote : Camera;
  const Icon = srcIcon;
  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-3 px-5 py-3 text-sm hover:bg-secondary/40 transition">
      <div className="size-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <div className="font-medium truncate">{e.vendor}</div>
        <div className="text-xs text-muted-foreground">{e.date} · {e.cat} · {e.conf}% confidence</div>
      </div>
      <span className="hidden md:inline text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">{e.cat}</span>
      <span className="font-mono tabular-nums">${e.amt.toFixed(2)}</span>
      <StatusBadge status={e.status} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "deduct") return (
    <span className="text-xs px-2 py-1 rounded-md bg-mint/10 text-primary border border-primary/30 inline-flex items-center gap-1">
      <CheckCircle2 className="size-3" /> Deductible
    </span>
  );
  if (status === "review") return (
    <span className="text-xs px-2 py-1 rounded-md bg-accent/10 text-accent border border-accent/30">Review</span>
  );
  return <span className="text-xs px-2 py-1 rounded-md bg-secondary text-muted-foreground">Personal</span>;
}

function BackLink() {
  return (
    <div className="pt-4">
      <Link to="/" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1">
        ← Back to landing page
      </Link>
    </div>
  );
}

// ---------- chart renderer ----------
const PRIMARY = "oklch(0.84 0.16 170)";
const ACCENT = "oklch(0.72 0.14 200)";
const MUTED = "oklch(0.7 0.02 250)";

function renderChart(chart: ChartType, data: typeof monthlyData, selected: string | null, setSelected: (s: string | null) => void) {
  const tooltipStyle = {
    backgroundColor: "oklch(0.21 0.035 252)",
    border: "1px solid oklch(0.3 0.03 252)",
    borderRadius: 8,
    fontSize: 12,
    color: "oklch(0.97 0.01 240)",
  };

  if (chart === "area") return (
    <AreaChart data={data}>
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.6} />
          <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
        </linearGradient>
        <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ACCENT} stopOpacity={0.4} />
          <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid stroke="oklch(0.3 0.03 252)" strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="m" stroke={MUTED} fontSize={12} />
      <YAxis stroke={MUTED} fontSize={12} />
      <Tooltip contentStyle={tooltipStyle} />
      <Area type="monotone" dataKey="income" stroke={ACCENT} fill="url(#g2)" strokeWidth={2} />
      <Area type="monotone" dataKey="expenses" stroke={PRIMARY} fill="url(#g1)" strokeWidth={2} />
    </AreaChart>
  );
  if (chart === "bar") return (
    <BarChart data={data}>
      <CartesianGrid stroke="oklch(0.3 0.03 252)" strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="m" stroke={MUTED} fontSize={12} />
      <YAxis stroke={MUTED} fontSize={12} />
      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(0.26 0.04 252 / 0.5)" }} />
      <Bar dataKey="expenses" fill={PRIMARY} radius={[6, 6, 0, 0]} />
      <Bar dataKey="deductions" fill={ACCENT} radius={[6, 6, 0, 0]} />
    </BarChart>
  );
  if (chart === "line") return (
    <LineChart data={data}>
      <CartesianGrid stroke="oklch(0.3 0.03 252)" strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="m" stroke={MUTED} fontSize={12} />
      <YAxis stroke={MUTED} fontSize={12} />
      <Tooltip contentStyle={tooltipStyle} />
      <Line type="monotone" dataKey="income" stroke={ACCENT} strokeWidth={2.5} dot={{ r: 3 }} />
      <Line type="monotone" dataKey="expenses" stroke={PRIMARY} strokeWidth={2.5} dot={{ r: 3 }} />
      <Line type="monotone" dataKey="deductions" stroke={MUTED} strokeWidth={2} strokeDasharray="4 4" dot={false} />
    </LineChart>
  );
  // pie
  return (
    <PieChart>
      <Tooltip contentStyle={tooltipStyle} />
      <Pie
        data={categoryData}
        innerRadius={60}
        outerRadius={110}
        dataKey="value"
        nameKey="name"
        paddingAngle={3}
        onClick={(d: { name?: string }) => setSelected(d?.name === selected ? null : d?.name ?? null)}
      >
        {categoryData.map((c) => (
          <Cell
            key={c.name}
            fill={c.color}
            stroke="oklch(0.16 0.03 250)"
            strokeWidth={2}
            opacity={selected && selected !== c.name ? 0.3 : 1}
            cursor="pointer"
          />
        ))}
      </Pie>
    </PieChart>
  );
}
