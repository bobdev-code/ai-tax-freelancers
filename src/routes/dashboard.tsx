import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Receipt, CheckCircle2, Search, ArrowRight, AlertCircle, Download, Plus,
  ChevronRight, LayoutDashboard, FileText, Settings, LogOut, Bell,
  Scale, ClipboardList, Inbox, FileCheck2, Info, ShieldCheck, X, Copy,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Demo — TaxPilot AI" },
      { name: "description", content: "Interactive prototype: intake, rule engine, review queue, accountant-ready export." },
    ],
  }),
  component: DashboardPage,
});

// ---------- domain types ----------
type ReviewLevel = "auto" | "review" | "block";
type Category = "Software" | "Travel" | "Equipment" | "Meals" | "Workspace" | "Other";

interface RuleHit {
  ruleId: string;
  sourceId: string;
  level: ReviewLevel;
  explanation: string;
}

interface ReceiptRow {
  id: string;
  date: string;
  vendor: string;
  category: Category;
  amountEur: number;
  vatRate: number;
  hasInvoiceNumber: boolean;
  hasVatId: boolean;
  status: "classified" | "review" | "missing_info";
  rules: RuleHit[];
  gaps: string[];
}

// ---------- Tax Rule Registry (deterministic) ----------
const RULE_REGISTRY: { id: string; source: string; title: string; description: string }[] = [
  { id: "RULE-DE-001", source: "EStG §4 Abs. 4", title: "Betriebsausgabe — deductible business expense", description: "Expenses caused by the business are deductible from taxable income." },
  { id: "RULE-DE-042", source: "EStG §4 Abs. 5 Nr. 2", title: "Meals — 70% deductibility cap", description: "Business meals with clients are deductible up to 70% of the documented cost." },
  { id: "RULE-DE-108", source: "UStG §14 Abs. 4", title: "Invoice requirements", description: "Invoices ≥ €250 must include full vendor address, VAT ID, invoice number and net/VAT split." },
  { id: "RULE-DE-114", source: "UStG §15", title: "Vorsteuerabzug — input VAT deduction", description: "Input VAT is deductible only if the invoice satisfies §14 UStG in full." },
  { id: "RULE-DE-201", source: "EStG §6 Abs. 2", title: "GWG — low-value asset", description: "Assets ≤ €800 net can be fully expensed in the year of acquisition." },
  { id: "RULE-DE-233", source: "EStG §9", title: "Travel — business trip evidence", description: "Business travel requires purpose, dates and destination on record." },
];

const initialReceipts: ReceiptRow[] = [
  {
    id: "R-0182", date: "2025-09-12", vendor: "Adobe Systems Software Ireland",
    category: "Software", amountEur: 54.99, vatRate: 19, hasInvoiceNumber: true, hasVatId: true,
    status: "classified",
    rules: [
      { ruleId: "RULE-DE-001", sourceId: "EStG §4 Abs. 4", level: "auto", explanation: "Software subscription used for client work — clear business expense." },
      { ruleId: "RULE-DE-114", sourceId: "UStG §15", level: "auto", explanation: "Invoice contains VAT ID and invoice number — input VAT deductible." },
    ],
    gaps: [],
  },
  {
    id: "R-0183", date: "2025-09-11", vendor: "Deutsche Bahn AG",
    category: "Travel", amountEur: 128.40, vatRate: 7, hasInvoiceNumber: true, hasVatId: true,
    status: "classified",
    rules: [
      { ruleId: "RULE-DE-233", sourceId: "EStG §9", level: "auto", explanation: "Business travel with purpose 'Client workshop Munich' documented." },
    ],
    gaps: [],
  },
  {
    id: "R-0184", date: "2025-09-10", vendor: "MediaMarkt Berlin",
    category: "Equipment", amountEur: 892.00, vatRate: 19, hasInvoiceNumber: true, hasVatId: true,
    status: "review",
    rules: [
      { ruleId: "RULE-DE-201", sourceId: "EStG §6 Abs. 2", level: "review",
        explanation: "Amount €892 exceeds the GWG threshold of €800 — must be depreciated over useful life, not fully expensed." },
    ],
    gaps: ["Useful-life estimation required for depreciation schedule"],
  },
  {
    id: "R-0185", date: "2025-09-09", vendor: "Café Einstein",
    category: "Meals", amountEur: 78.20, vatRate: 19, hasInvoiceNumber: false, hasVatId: false,
    status: "missing_info",
    rules: [
      { ruleId: "RULE-DE-042", sourceId: "EStG §4 Abs. 5 Nr. 2", level: "review",
        explanation: "Client meal — 70% deductibility cap will apply once business purpose is documented." },
      { ruleId: "RULE-DE-108", sourceId: "UStG §14 Abs. 4", level: "block",
        explanation: "Receipt is missing invoice number and vendor VAT ID — required for amounts on a Bewirtungsbeleg." },
    ],
    gaps: ["Invoice number missing", "Vendor VAT ID missing", "Business purpose / attendees not documented"],
  },
  {
    id: "R-0186", date: "2025-09-08", vendor: "WeWork Sony Center",
    category: "Workspace", amountEur: 245.00, vatRate: 19, hasInvoiceNumber: true, hasVatId: true,
    status: "classified",
    rules: [
      { ruleId: "RULE-DE-001", sourceId: "EStG §4 Abs. 4", level: "auto", explanation: "Coworking day passes for client meetings — business use." },
    ],
    gaps: [],
  },
  {
    id: "R-0187", date: "2025-09-07", vendor: "Figma Inc.",
    category: "Software", amountEur: 15.00, vatRate: 0, hasInvoiceNumber: true, hasVatId: false,
    status: "review",
    rules: [
      { ruleId: "RULE-DE-001", sourceId: "EStG §4 Abs. 4", level: "auto", explanation: "Design tool used in freelance workflow." },
      { ruleId: "RULE-DE-114", sourceId: "UStG §15", level: "review",
        explanation: "Non-EU vendor — reverse-charge mechanism applies. Confirm §13b UStG handling." },
    ],
    gaps: ["Reverse-charge classification pending"],
  },
];

// ---------- component ----------

function DashboardPage() {
  const [receipts, setReceipts] = useState<ReceiptRow[]>(initialReceipts);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ReceiptRow["status"]>("all");
  const [selectedId, setSelectedId] = useState<string | null>("R-0185");
  const [showIntake, setShowIntake] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const filtered = useMemo(() => receipts.filter(r =>
    (statusFilter === "all" || r.status === statusFilter) &&
    (query === "" || r.vendor.toLowerCase().includes(query.toLowerCase()) || r.id.toLowerCase().includes(query.toLowerCase()))
  ), [receipts, statusFilter, query]);

  const stats = useMemo(() => {
    const total = receipts.reduce((s, r) => s + r.amountEur, 0);
    const classified = receipts.filter(r => r.status === "classified").length;
    const review = receipts.filter(r => r.status === "review").length;
    const missing = receipts.filter(r => r.status === "missing_info").length;
    return { total, classified, review, missing, count: receipts.length };
  }, [receipts]);

  const selected = receipts.find(r => r.id === selectedId) ?? null;

  const addReceipt = (r: Omit<ReceiptRow, "id" | "rules" | "status" | "gaps">) => {
    // Toy deterministic rule engine — mirrors packages/rules behavior
    const rules: RuleHit[] = [];
    const gaps: string[] = [];
    rules.push({ ruleId: "RULE-DE-001", sourceId: "EStG §4 Abs. 4", level: "auto", explanation: "Business-caused expense — deductible in principle." });
    if (r.category === "Meals") {
      rules.push({ ruleId: "RULE-DE-042", sourceId: "EStG §4 Abs. 5 Nr. 2", level: "review", explanation: "Meals with clients — 70% deductibility cap applies once business purpose is documented." });
    }
    if (r.category === "Equipment" && r.amountEur > 800) {
      rules.push({ ruleId: "RULE-DE-201", sourceId: "EStG §6 Abs. 2", level: "review", explanation: `Amount €${r.amountEur.toFixed(2)} exceeds GWG threshold of €800 — depreciation schedule required.` });
    }
    if (r.amountEur >= 250 && (!r.hasInvoiceNumber || !r.hasVatId)) {
      rules.push({ ruleId: "RULE-DE-108", sourceId: "UStG §14 Abs. 4", level: "block", explanation: "Invoice ≥ €250 requires invoice number and vendor VAT ID." });
      if (!r.hasInvoiceNumber) gaps.push("Invoice number missing");
      if (!r.hasVatId) gaps.push("Vendor VAT ID missing");
    }
    const level: ReviewLevel = rules.some(x => x.level === "block") ? "block"
      : rules.some(x => x.level === "review") ? "review" : "auto";
    const status: ReceiptRow["status"] = level === "block" ? "missing_info" : level === "review" ? "review" : "classified";
    const id = `R-${String(200 + receipts.length).padStart(4, "0")}`;
    const newRow: ReceiptRow = { ...r, id, rules, gaps, status };
    setReceipts(prev => [newRow, ...prev]);
    setSelectedId(id);
    setShowIntake(false);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <SidebarNav />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar query={query} setQuery={setQuery} />
        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-x-hidden">
          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-primary mb-1">Prototype demo</div>
              <h1 className="text-3xl font-bold">Steuerberater-ready workspace</h1>
              <p className="text-sm text-muted-foreground mt-1">Add a receipt · watch the rule engine run · export a JSON package.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowIntake(true)}
                      className="rounded-lg bg-mint text-primary-foreground px-4 py-2 text-sm font-semibold inline-flex items-center gap-2 shadow-glow">
                <Plus className="size-4" /> Add receipt
              </button>
              <button onClick={() => setShowExport(true)}
                      className="rounded-lg border border-border bg-card px-3 py-2 text-sm inline-flex items-center gap-2 hover:bg-secondary transition">
                <Download className="size-4" /> Export for Steuerberater
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPI label="Receipts" value={String(stats.count)} delta={`€${stats.total.toFixed(2)} tracked`} icon={Receipt} />
            <KPI label="Auto-classified" value={String(stats.classified)} delta="rule engine confident" icon={CheckCircle2} highlight />
            <KPI label="Review queue" value={String(stats.review)} delta="human confirmation" icon={AlertCircle} />
            <KPI label="Missing info" value={String(stats.missing)} delta="blocking gaps" icon={Info} />
          </div>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
            {/* Left: list */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <ClipboardList className="size-4 text-primary" />
                  <div className="font-semibold text-sm">Receipts</div>
                  <span className="text-xs text-muted-foreground">· {filtered.length}/{receipts.length}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(["all", "classified", "review", "missing_info"] as const).map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                            className={`text-xs px-2.5 py-1 rounded-md border transition ${statusFilter === s ? "border-primary bg-mint/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                      {s === "all" ? "All" : s === "classified" ? "Classified" : s === "review" ? "Review" : "Missing info"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-border max-h-[32rem] overflow-y-auto">
                {filtered.length === 0 && (
                  <div className="p-10 text-center text-sm text-muted-foreground">No receipts match these filters.</div>
                )}
                {filtered.map(r => (
                  <button key={r.id} onClick={() => setSelectedId(r.id)}
                          className={`w-full text-left px-4 py-3 grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 hover:bg-secondary/40 transition ${selectedId === r.id ? "bg-mint/5" : ""}`}>
                    <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{r.vendor}</div>
                      <div className="text-xs text-muted-foreground">{r.date} · {r.category}</div>
                    </div>
                    <span className="font-mono tabular-nums text-sm">€{r.amountEur.toFixed(2)}</span>
                    <StatusBadge status={r.status} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: detail */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {selected ? <ReceiptDetail r={selected} /> : (
                <div className="p-10 text-center text-sm text-muted-foreground">Select a receipt to see its rule trace.</div>
              )}
            </div>
          </div>

          {/* Rule Registry */}
          <RuleRegistry />

          <BackLink />
        </main>
      </div>

      {showIntake && <IntakeModal onClose={() => setShowIntake(false)} onSubmit={addReceipt} />}
      {showExport && <ExportModal receipts={receipts} onClose={() => setShowExport(false)} />}
    </div>
  );
}

// ---------- receipt detail ----------

function ReceiptDetail({ r }: { r: ReceiptRow }) {
  const [tab, setTab] = useState<"overview" | "evidence" | "rules" | "export">("overview");
  const tabs = [
    { k: "overview" as const, l: "Overview" },
    { k: "evidence" as const, l: "Evidence" },
    { k: "rules" as const, l: "Rules" },
    { k: "export" as const, l: "Export" },
  ];
  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">{r.id}</div>
        <div className="font-semibold text-lg mt-1">{r.vendor}</div>
        <div className="text-xs text-muted-foreground mt-1">{r.date} · {r.category} · <span className="font-mono">€{r.amountEur.toFixed(2)}</span> ({r.vatRate}% VAT)</div>
        <div className="mt-3"><StatusBadge status={r.status} /></div>
      </div>
      <div className="flex border-b border-border text-xs">
        {tabs.map(t => (
          <button key={t.k} onClick={() => setTab(t.k)}
                  className={`px-4 py-3 border-b-2 -mb-px transition ${tab === t.k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t.l}
          </button>
        ))}
      </div>
      <div className="p-5 flex-1 overflow-y-auto text-sm">
        {tab === "overview" && (
          <dl className="space-y-3">
            <Field k="Vendor" v={r.vendor} />
            <Field k="Date" v={r.date} />
            <Field k="Category" v={r.category} />
            <Field k="Amount (gross)" v={`€${r.amountEur.toFixed(2)}`} />
            <Field k="VAT rate" v={`${r.vatRate}%`} />
            <Field k="Net" v={`€${(r.amountEur / (1 + r.vatRate/100)).toFixed(2)}`} />
            <Field k="VAT amount" v={`€${(r.amountEur - r.amountEur / (1 + r.vatRate/100)).toFixed(2)}`} />
          </dl>
        )}
        {tab === "evidence" && (
          <div className="space-y-3">
            <EvidenceRow label="Invoice number present" ok={r.hasInvoiceNumber} />
            <EvidenceRow label="Vendor VAT ID present" ok={r.hasVatId} />
            <EvidenceRow label="Date documented" ok={true} />
            <EvidenceRow label="Vendor address" ok={r.hasVatId} />
            {r.gaps.length > 0 && (
              <div className="rounded-lg border border-accent/40 bg-accent/10 p-3 mt-4">
                <div className="text-xs uppercase tracking-wide text-accent font-semibold mb-2">Missing info</div>
                <ul className="text-xs space-y-1">
                  {r.gaps.map(g => <li key={g} className="flex items-start gap-2"><AlertCircle className="size-3 mt-0.5 text-accent shrink-0" /> {g}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
        {tab === "rules" && (
          <div className="space-y-3">
            {r.rules.map(h => (
              <div key={h.ruleId} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-secondary text-foreground">{h.ruleId}</span>
                    <LevelPill level={h.level} />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{h.sourceId}</span>
                </div>
                <div className="text-xs uppercase tracking-wide text-primary mb-1">Why flagged?</div>
                <div className="text-sm text-muted-foreground">{h.explanation}</div>
              </div>
            ))}
          </div>
        )}
        {tab === "export" && (
          <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-auto max-h-96 font-mono leading-relaxed">
{JSON.stringify(toExport(r), null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

function toExport(r: ReceiptRow) {
  return {
    receipt_id: r.id,
    date: r.date,
    vendor: r.vendor,
    category: r.category,
    amount_gross_eur: r.amountEur,
    vat_rate_pct: r.vatRate,
    amount_net_eur: +(r.amountEur / (1 + r.vatRate/100)).toFixed(2),
    vat_eur: +(r.amountEur - r.amountEur / (1 + r.vatRate/100)).toFixed(2),
    status: r.status,
    rule_hits: r.rules.map(h => ({ rule_id: h.ruleId, source_id: h.sourceId, review_level: h.level, explanation: h.explanation })),
    gaps: r.gaps,
  };
}

// ---------- rule registry panel ----------

function RuleRegistry() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-1">
        <Scale className="size-4 text-primary" />
        <h2 className="font-semibold">Tax Rule Registry</h2>
        <span className="text-xs text-muted-foreground">· @taxpilot/rules</span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Every classification is traceable to a rule in this deterministic registry.</p>
      <div className="grid md:grid-cols-2 gap-3">
        {RULE_REGISTRY.map(r => (
          <div key={r.id} className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-secondary">{r.id}</span>
              <span className="text-xs text-muted-foreground font-mono">{r.source}</span>
            </div>
            <div className="font-semibold text-sm mt-2">{r.title}</div>
            <div className="text-xs text-muted-foreground mt-1">{r.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- intake modal ----------

function IntakeModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (r: Omit<ReceiptRow, "id" | "rules" | "status" | "gaps">) => void }) {
  const [vendor, setVendor] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState<Category>("Software");
  const [amount, setAmount] = useState("");
  const [vatRate, setVatRate] = useState(19);
  const [hasInvoiceNumber, setHasInvoiceNumber] = useState(true);
  const [hasVatId, setHasVatId] = useState(true);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!vendor || isNaN(amt)) return;
    onSubmit({ vendor, date, category, amountEur: amt, vatRate, hasInvoiceNumber, hasVatId });
  };

  return (
    <Modal onClose={onClose} title="Add receipt · manual intake">
      <form onSubmit={submit} className="space-y-4 text-sm">
        <Row label="Vendor"><input value={vendor} onChange={e => setVendor(e.target.value)} required placeholder="e.g. Deutsche Bahn AG" className={inputCls} /></Row>
        <Row label="Date"><input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} /></Row>
        <Row label="Category">
          <select value={category} onChange={e => setCategory(e.target.value as Category)} className={inputCls}>
            {(["Software","Travel","Equipment","Meals","Workspace","Other"] as Category[]).map(c => <option key={c}>{c}</option>)}
          </select>
        </Row>
        <div className="grid grid-cols-2 gap-3">
          <Row label="Amount (gross €)"><input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="0.00" className={inputCls} /></Row>
          <Row label="VAT %">
            <select value={vatRate} onChange={e => setVatRate(+e.target.value)} className={inputCls}>
              <option value={19}>19%</option><option value={7}>7%</option><option value={0}>0% / reverse-charge</option>
            </select>
          </Row>
        </div>
        <div className="rounded-lg border border-border p-3 space-y-2">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Evidence flags</div>
          <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={hasInvoiceNumber} onChange={e => setHasInvoiceNumber(e.target.checked)} /> Invoice number on receipt</label>
          <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={hasVatId} onChange={e => setHasVatId(e.target.checked)} /> Vendor VAT ID present</label>
        </div>
        <div className="rounded-lg border border-primary/30 bg-mint/5 p-3 text-xs text-muted-foreground flex gap-2">
          <ShieldCheck className="size-4 text-primary shrink-0" />
          The deterministic rule engine (@taxpilot/rules) evaluates this receipt on submit — no ML classification.
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm border border-border hover:bg-secondary">Cancel</button>
          <button type="submit" className="rounded-lg bg-mint text-primary-foreground px-4 py-2 text-sm font-semibold inline-flex items-center gap-2">
            Run rule engine <ArrowRight className="size-4" />
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ---------- export modal ----------

function ExportModal({ receipts, onClose }: { receipts: ReceiptRow[]; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const payload = {
    export_id: `EXP-${Date.now()}`,
    generated_at: new Date().toISOString(),
    period: "2025-Q3",
    country: "DE",
    disclaimer: "TaxPilot AI is not a certified tax advisor. This package is decision-support material for the Steuerberater.",
    receipts: receipts.map(toExport),
    summary: {
      total_receipts: receipts.length,
      classified: receipts.filter(r => r.status === "classified").length,
      review: receipts.filter(r => r.status === "review").length,
      missing_info: receipts.filter(r => r.status === "missing_info").length,
      total_gross_eur: +receipts.reduce((s, r) => s + r.amountEur, 0).toFixed(2),
    },
  };
  const text = JSON.stringify(payload, null, 2);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); };
  return (
    <Modal onClose={onClose} title="Accountant export · JSON package">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Hand this package to the Steuerberater. Every line is traceable to a rule ID.</p>
        <pre className="text-xs bg-background border border-border rounded-lg p-4 overflow-auto max-h-96 font-mono leading-relaxed">{text}</pre>
        <div className="flex justify-end gap-2">
          <button onClick={copy} className="rounded-lg px-4 py-2 text-sm border border-border hover:bg-secondary inline-flex items-center gap-2">
            <Copy className="size-4" /> {copied ? "Copied" : "Copy JSON"}
          </button>
          <button onClick={onClose} className="rounded-lg bg-mint text-primary-foreground px-4 py-2 text-sm font-semibold inline-flex items-center gap-2">
            <Download className="size-4" /> Download (demo)
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ---------- shared pieces ----------

const inputCls = "w-full rounded-lg bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</div>
      {children}
    </label>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/50 pb-2">
      <dt className="text-xs text-muted-foreground uppercase tracking-wide">{k}</dt>
      <dd className="font-mono text-sm">{v}</dd>
    </div>
  );
}

function EvidenceRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
      <span className="text-sm">{label}</span>
      {ok ? <CheckCircle2 className="size-4 text-primary" /> : <AlertCircle className="size-4 text-accent" />}
    </div>
  );
}

function StatusBadge({ status }: { status: ReceiptRow["status"] }) {
  if (status === "classified") return <span className="text-xs px-2 py-1 rounded-md bg-mint/10 text-primary border border-primary/30 inline-flex items-center gap-1"><CheckCircle2 className="size-3" /> Classified</span>;
  if (status === "review") return <span className="text-xs px-2 py-1 rounded-md bg-accent/10 text-accent border border-accent/30 inline-flex items-center gap-1"><AlertCircle className="size-3" /> Review</span>;
  return <span className="text-xs px-2 py-1 rounded-md bg-destructive/10 text-destructive border border-destructive/30 inline-flex items-center gap-1"><Info className="size-3" /> Missing info</span>;
}

function LevelPill({ level }: { level: ReviewLevel }) {
  const map = {
    auto: { l: "auto-classify", cls: "bg-mint/10 text-primary border-primary/30" },
    review: { l: "review", cls: "bg-accent/10 text-accent border-accent/30" },
    block: { l: "block", cls: "bg-destructive/10 text-destructive border-destructive/30" },
  }[level];
  return <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${map.cls}`}>{map.l}</span>;
}

function KPI({ label, value, delta, icon: Icon, highlight }: { label: string; value: string; delta: string; icon: React.ComponentType<{ className?: string }>; highlight?: boolean }) {
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

function SidebarNav() {
  const items = [
    { icon: LayoutDashboard, t: "Overview", active: true },
    { icon: Receipt, t: "Receipts" },
    { icon: Inbox, t: "Review queue" },
    { icon: Scale, t: "Rule registry" },
    { icon: FileCheck2, t: "Export" },
    { icon: FileText, t: "Docs" },
  ];
  return (
    <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-card/40 p-5">
      <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg mb-8">
        <div className="size-8 rounded-lg bg-mint flex items-center justify-center text-primary-foreground">
          <Receipt className="size-4" />
        </div>
        TaxPilot<span className="text-primary"> AI</span>
      </Link>
      <nav className="space-y-1 text-sm flex-1">
        {items.map(({ icon: Icon, t, active }) => (
          <div key={t} className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${active ? "bg-mint/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
            <Icon className="size-4" /> {t}
          </div>
        ))}
      </nav>
      <div className="rounded-xl border border-primary/30 bg-mint/5 p-3 text-xs text-muted-foreground mb-4">
        <ShieldCheck className="size-4 text-primary mb-1.5" />
        Not a certified tax advisor. Decision-support only.
      </div>
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
        <input value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search receipts, vendors, IDs…"
          className="w-full pl-10 pr-3 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary" />
      </div>
      <button className="relative size-9 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-secondary transition">
        <Bell className="size-4" />
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
      </button>
      <div className="flex items-center gap-2">
        <div className="size-9 rounded-full bg-mint text-primary-foreground font-semibold flex items-center justify-center text-sm">R</div>
        <div className="hidden sm:block text-sm">
          <div className="font-medium leading-tight">Robert</div>
          <div className="text-xs text-muted-foreground leading-tight">Freiberufler · DE</div>
        </div>
      </div>
    </header>
  );
}

function BackLink() {
  return (
    <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground pt-4">
      <ChevronRight className="size-4 rotate-180" /> Back to landing
    </Link>
  );
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-glow" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="font-semibold">{title}</div>
          <button onClick={onClose} className="size-8 rounded-lg hover:bg-secondary flex items-center justify-center">
            <X className="size-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
