import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type Status = "done" | "active" | "planned";
type EventType = "focus" | "meeting" | "break" | "task" | "admin";
type Severity = "error" | "warn" | "info";
type PhaseType = "research" | "design" | "dev" | "qa" | "release";

// ── Data ─────────────────────────────────────────────────────────────────────

const roadmap: { year: string; title: string; desc: string; status: Status }[] = [
  { year: "2020", title: "Company Founded", desc: "Seed funding secured, team of 5", status: "done" },
  { year: "2021", title: "Beta Launch", desc: "First 1,000 users onboarded", status: "done" },
  { year: "2022", title: "Series A — $12M", desc: "Expanded to 3 markets", status: "done" },
  { year: "2023", title: "Product–Market Fit", desc: "ARR crossed $2M milestone", status: "done" },
  { year: "2024", title: "Series B — $45M", desc: "Platform v2 shipped, 50-person team", status: "done" },
  { year: "2025", title: "Global Expansion", desc: "APAC & EU offices opened", status: "active" },
  { year: "2026", title: "IPO Preparation", desc: "Targeting public markets", status: "planned" },
];

const career = [
  { period: "2018 – 2019", role: "Junior Developer", org: "Acorn Systems", loc: "Austin, TX", note: "1 yr" },
  { period: "2019 – 2021", role: "Software Engineer", org: "Meridian Labs", loc: "Seattle, WA", note: "2 yrs" },
  { period: "2021 – 2022", role: "Senior Engineer", org: "Meridian Labs", loc: "Seattle, WA", note: "1 yr" },
  { period: "2022 – 2024", role: "Staff Engineer", org: "Vertex Platform", loc: "San Francisco, CA", note: "2 yrs" },
  { period: "2024 –", role: "Principal Engineer", org: "Vertex Platform", loc: "Remote", note: "current" },
];

const projectMilestones: { month: string; event: string; detail: string; status: Status }[] = [
  { month: "Jan 2024", event: "Project Kickoff", detail: "Requirements finalized, team assembled", status: "done" },
  { month: "Mar 2024", event: "Design Complete", detail: "System architecture approved by CTO", status: "done" },
  { month: "Jun 2024", event: "Alpha Release", detail: "Internal testing, 12 users enrolled", status: "done" },
  { month: "Aug 2024", event: "Beta Launch", detail: "500 beta users, NPS: 62", status: "done" },
  { month: "Oct 2024", event: "General Availability", detail: "Full public launch, all features live", status: "done" },
  { month: "Jan 2025", event: "v2 Roadmap", detail: "Planning next major version cycle", status: "active" },
  { month: "Q3 2025", event: "v2 Launch", detail: "AI-powered features, revised pricing", status: "planned" },
];

const sprints = [
  { week: "Wk 01", task: "Backlog grooming & sprint planning", done: true, active: false },
  { week: "Wk 02", task: "Core API endpoints — auth & sessions", done: true, active: false },
  { week: "Wk 03", task: "Frontend data layer integration", done: true, active: false },
  { week: "Wk 04", task: "Permissions & RBAC implementation", done: true, active: false },
  { week: "Wk 05", task: "Database migration scripts", done: false, active: true },
  { week: "Wk 06", task: "End-to-end test coverage", done: false, active: false },
  { week: "Wk 07", task: "Performance benchmarking", done: false, active: false },
  { week: "Wk 08", task: "Staging deploy & stakeholder sign-off", done: false, active: false },
];

const daySchedule: { time: string; end: string; event: string; type: EventType; detail: string }[] = [
  { time: "09:00", end: "09:30", event: "Standup", type: "meeting", detail: "6 attendees" },
  { time: "09:30", end: "11:30", event: "Deep Work — Auth refactor", type: "focus", detail: "2 hrs" },
  { time: "11:30", end: "12:15", event: "1:1 with Emma (EM)", type: "meeting", detail: "2 attendees" },
  { time: "12:15", end: "13:15", event: "Lunch", type: "break", detail: "" },
  { time: "13:15", end: "14:30", event: "API design review", type: "meeting", detail: "4 attendees" },
  { time: "14:30", end: "16:30", event: "Deep Work — Feature build", type: "focus", detail: "2 hrs" },
  { time: "16:30", end: "17:00", event: "Code review queue", type: "task", detail: "4 PRs" },
  { time: "17:00", end: "17:30", event: "EOD wrap-up & notes", type: "admin", detail: "" },
];

const incidentLog: { ts: string; sev: Severity; msg: string; svc: string }[] = [
  { ts: "14:02:31", sev: "warn", msg: "Elevated error rate on api-gateway (4.2%)", svc: "api-gateway" },
  { ts: "14:03:07", sev: "error", msg: "Circuit breaker opened — payments-svc", svc: "payments-svc" },
  { ts: "14:05:22", sev: "error", msg: "DB connection pool exhausted (100/100)", svc: "postgres-primary" },
  { ts: "14:08:15", sev: "info", msg: "On-call engineer acknowledged #INC-4921", svc: "pagerduty" },
  { ts: "14:12:44", sev: "info", msg: "Connection pool expanded: 100 → 200", svc: "postgres-primary" },
  { ts: "14:19:03", sev: "warn", msg: "Error rate declining: 8.2% → 3.1%", svc: "api-gateway" },
  { ts: "14:31:18", sev: "info", msg: "Circuit breaker closed — normal operation", svc: "payments-svc" },
  { ts: "14:47:00", sev: "info", msg: "Incident resolved. Duration: 44 min.", svc: "ops" },
];

const companyHistory = [
  { year: "2015", title: "Founded", desc: "3 co-founders, $250K angel", pos: "above" },
  { year: "2017", title: "Seed Round", desc: "$3.2M · NYC office", pos: "below" },
  { year: "2019", title: "Series A", desc: "$15M · 40 employees", pos: "above" },
  { year: "2020", title: "Remote Pivot", desc: "Global distributed team", pos: "below" },
  { year: "2022", title: "Series B", desc: "$60M · International", pos: "above" },
  { year: "2024", title: "Profitability", desc: "Q2 first profitable qtr", pos: "below" },
  { year: "2025", title: "IPO Filed", desc: "NYSE: MRDX · S-1 submitted", pos: "above" },
];

const versions = [
  { date: "Mar '21", ver: "v1.0", name: "Orion", note: "Initial release", pos: "above" },
  { date: "Sep '21", ver: "v1.5", name: "Orion", note: "Mobile apps shipped", pos: "below" },
  { date: "Apr '22", ver: "v2.0", name: "Lyra", note: "New rendering engine", pos: "above" },
  { date: "Nov '22", ver: "v2.3", name: "Lyra", note: "Performance update", pos: "below" },
  { date: "Jun '23", ver: "v3.0", name: "Cassini", note: "AI integration", pos: "above" },
  { date: "Feb '24", ver: "v3.5", name: "Cassini", note: "API v2, webhooks", pos: "below" },
  { date: "Oct '24", ver: "v4.0", name: "Volta", note: "Real-time collab", pos: "above" },
];

const gantt: { phase: string; start: number; end: number; type: PhaseType }[] = [
  { phase: "Discovery & Research", start: 0, end: 1, type: "research" },
  { phase: "System Design", start: 1, end: 2.5, type: "design" },
  { phase: "Core Engineering", start: 2, end: 5, type: "dev" },
  { phase: "QA & Testing", start: 3.5, end: 5.5, type: "qa" },
  { phase: "Launch & Rollout", start: 5, end: 6.5, type: "release" },
  { phase: "Post-Launch Tuning", start: 6, end: 7, type: "research" },
];
const ganttMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

const sprintDays = [
  { day: "Mon 2", done: 3, total: 3, today: false },
  { day: "Tue 3", done: 4, total: 4, today: false },
  { day: "Wed 4", done: 3, total: 3, today: false },
  { day: "Thu 5", done: 4, total: 5, today: false },
  { day: "Fri 6", done: 1, total: 2, today: false },
  { day: "Mon 9", done: 2, total: 4, today: true },
  { day: "Tue 10", done: 0, total: 3, today: false },
  { day: "Wed 11", done: 0, total: 4, today: false },
  { day: "Thu 12", done: 0, total: 3, today: false },
  { day: "Fri 13", done: 0, total: 2, today: false },
];

const timeBlocks: { label: string; type: string; start: number; span: number }[] = [
  { label: "Email", type: "admin", start: 0, span: 0.5 },
  { label: "Deep Work: Feature build", type: "focus", start: 0.5, span: 2.5 },
  { label: "Team sync", type: "meeting", start: 3, span: 1 },
  { label: "Lunch", type: "break", start: 4, span: 1 },
  { label: "Async review", type: "admin", start: 5, span: 1 },
  { label: "Architecture session", type: "focus", start: 6, span: 2 },
  { label: "1:1 x3", type: "meeting", start: 8, span: 1 },
  { label: "Wrap", type: "admin", start: 9, span: 0.5 },
];

const sysEvents = [
  { ts: "12:00", label: "Deploy #847 to prod", type: "deploy" },
  { ts: "12:08", label: "Health check ✓", type: "ok" },
  { ts: "12:23", label: "p99 latency: 2.1s", type: "warn" },
  { ts: "12:31", label: "+4 instances scaled", type: "scale" },
  { ts: "12:44", label: "Latency normalized", type: "ok" },
  { ts: "13:01", label: "Backup completed", type: "ok" },
  { ts: "13:15", label: "SSL cert renewal", type: "info" },
  { ts: "13:29", label: "Error rate: 2.8%", type: "warn" },
  { ts: "13:35", label: "Root cause found", type: "error" },
  { ts: "13:41", label: "Rollback #847→#846", type: "deploy" },
  { ts: "13:48", label: "Error rate: 0.1%", type: "ok" },
  { ts: "14:00", label: "Incident closed", type: "info" },
];

// ── Shared helpers ────────────────────────────────────────────────────────────

const dotBase = (status: Status) =>
  status === "done"
    ? "bg-primary"
    : status === "active"
    ? "bg-amber-500"
    : "bg-background border-2 border-border";

const ganttColors: Record<PhaseType, string> = {
  research: "bg-violet-400",
  design:   "bg-amber-400",
  dev:      "bg-primary",
  qa:       "bg-emerald-400",
  release:  "bg-red-400",
};

const blockColors: Record<string, { bg: string; bar: string; text: string }> = {
  focus:   { bg: "bg-primary/8",   bar: "bg-primary",         text: "text-primary"   },
  meeting: { bg: "bg-violet-500/8",bar: "bg-violet-500",      text: "text-violet-600"},
  break:   { bg: "bg-emerald-500/8",bar:"bg-emerald-500",     text: "text-emerald-600"},
  task:    { bg: "bg-amber-500/8",  bar: "bg-amber-500",       text: "text-amber-600" },
  admin:   { bg: "bg-muted/50",     bar: "bg-muted-foreground/30", text: "text-muted-foreground" },
};

const hBlockColors: Record<string, { bg: string; text: string }> = {
  focus:   { bg: "bg-primary",         text: "text-white" },
  meeting: { bg: "bg-violet-500",      text: "text-white" },
  break:   { bg: "bg-emerald-500",     text: "text-white" },
  admin:   { bg: "bg-muted-foreground/40", text: "text-foreground" },
};

const sevStyle: Record<Severity, string> = {
  error: "text-red-400 bg-red-500/15",
  warn:  "text-amber-400 bg-amber-500/15",
  info:  "text-blue-400 bg-blue-500/15",
};

const eventDotColor: Record<string, string> = {
  deploy: "bg-primary",
  ok:     "bg-emerald-500",
  warn:   "bg-amber-500",
  scale:  "bg-violet-500",
  info:   "bg-muted-foreground",
  error:  "bg-red-500",
};

// ── Card shell ────────────────────────────────────────────────────────────────

function TCard({
  id, scale, title, dark = false, children,
}: {
  id: string; scale: string; title: string; dark?: boolean; children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col border border-border ${dark ? "bg-[#0C0C0B] text-white border-white/10" : "bg-card"}`}>
      <div className="flex items-center justify-between px-5 pt-4">
        <span className={`font-mono-alt text-[10px] ${dark ? "text-white/35" : "text-muted-foreground"}`}>{id}</span>
        <span
          className={`font-mono-alt text-[9px] tracking-[0.16em] px-2 py-0.5
            ${dark ? "bg-white/10 text-white/50" : "bg-primary/10 text-primary"}`}
        >
          {scale}
        </span>
      </div>
      <div className={`px-5 pb-3 pt-1 border-b ${dark ? "border-white/8" : "border-border"}`}>
        <h3 className={`font-condensed text-[22px] font-semibold leading-tight tracking-tight ${dark ? "text-white" : ""}`}>
          {title}
        </h3>
      </div>
      <div className="px-5 py-4 flex-1">{children}</div>
    </div>
  );
}

// ── Vertical 1 — Alternating roadmap (years) ─────────────────────────────────

function V1() {
  return (
    <TCard id="V — 01" scale="YEARS" title="Company Roadmap 2020–2026">
      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 z-0" />
        {roadmap.map((item, i) => {
          const left = i % 2 === 0;
          return (
            <div key={item.year} className="grid grid-cols-[1fr_20px_1fr] items-start min-h-[68px]">
              <div className={`pr-5 text-right py-0.5 ${left ? "" : "invisible"}`}>
                <div className="font-mono-alt text-[10px] text-muted-foreground mb-0.5">{item.year}</div>
                <div className="font-medium text-sm leading-snug">{item.title}</div>
                <div className="text-[11px] text-muted-foreground">{item.desc}</div>
              </div>
              <div className="flex justify-center pt-1.5 relative z-10">
                {item.status === "active" && (
                  <div className="absolute w-5 h-5 rounded-full bg-amber-500/20 animate-ping top-0.5" />
                )}
                <div className={`w-3 h-3 rounded-full relative z-10 ${dotBase(item.status)}`} />
              </div>
              <div className={`pl-5 py-0.5 ${!left ? "" : "invisible"}`}>
                <div className="font-mono-alt text-[10px] text-muted-foreground mb-0.5">{item.year}</div>
                <div className="font-medium text-sm leading-snug">{item.title}</div>
                <div className="text-[11px] text-muted-foreground">{item.desc}</div>
              </div>
            </div>
          );
        })}
        <div className="flex gap-4 mt-4 pt-3 border-t border-border">
          {(["done", "active", "planned"] as Status[]).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${dotBase(s)}`} />
              <span className="font-mono-alt text-[9px] text-muted-foreground capitalize">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </TCard>
  );
}

// ── Vertical 2 — Career progression (years) ──────────────────────────────────

function V2() {
  return (
    <TCard id="V — 02" scale="YEARS" title="Career Journey 2018–Present">
      <div className="flex flex-col">
        {career.map((c, i) => (
          <div key={i} className="grid grid-cols-[56px_16px_1fr] items-start gap-x-3">
            <div className="text-right pt-0.5">
              <span className="font-mono-alt text-[9px] text-muted-foreground leading-none">
                {c.period.split(" – ")[0]}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-1 z-10" />
              {i < career.length - 1 && <div className="w-px flex-1 bg-border min-h-[52px]" />}
            </div>
            <div className="pb-7 last:pb-0">
              <div className="font-semibold text-sm leading-snug">{c.role}</div>
              <div className="text-sm text-muted-foreground">{c.org}</div>
              <div className="font-mono-alt text-[9px] text-muted-foreground/60 mt-0.5">
                {c.loc} · {c.note}
              </div>
            </div>
          </div>
        ))}
      </div>
    </TCard>
  );
}

// ── Vertical 3 — Monthly milestones with status badges ───────────────────────

function V3() {
  return (
    <TCard id="V — 03" scale="MONTHS" title="Project Milestones Jan 2024–2025">
      <div className="relative pl-2">
        <div className="absolute left-[9px] top-0 bottom-0 w-px bg-border" />
        {projectMilestones.map((m, i) => (
          <div key={i} className="relative flex gap-4 pb-5 last:pb-0">
            <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-1 z-10 relative ${dotBase(m.status)}`} />
            <div className="flex-1 min-w-0">
              <div className="font-mono-alt text-[9px] text-muted-foreground mb-0.5">{m.month}</div>
              <div className="font-semibold text-sm leading-snug">{m.event}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{m.detail}</div>
            </div>
            <div
              className={`flex-shrink-0 font-mono-alt text-[8px] px-1.5 py-0.5 self-start mt-1 tracking-wide
                ${m.status === "done"
                  ? "bg-primary/10 text-primary"
                  : m.status === "active"
                  ? "bg-amber-500/12 text-amber-600"
                  : "bg-muted text-muted-foreground"}`}
            >
              {m.status === "done" ? "DONE" : m.status === "active" ? "ACTIVE" : "PLANNED"}
            </div>
          </div>
        ))}
      </div>
    </TCard>
  );
}

// ── Vertical 4 — Sprint checklist (weeks) ────────────────────────────────────

function V4() {
  const doneCount = sprints.filter((s) => s.done).length;
  return (
    <TCard id="V — 04" scale="WEEKS" title="Q1 2025 Engineering Sprint">
      <div className="mb-4">
        <div className="flex justify-between mb-1.5">
          <span className="font-mono-alt text-[9px] text-muted-foreground tracking-widest">PROGRESS</span>
          <span className="font-mono-alt text-[9px] text-primary">
            {doneCount} / {sprints.length} weeks complete
          </span>
        </div>
        <div className="h-1 bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-700"
            style={{ width: `${(doneCount / sprints.length) * 100}%` }}
          />
        </div>
      </div>
      <div className="flex flex-col">
        {sprints.map((s, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 py-2.5 border-b border-border last:border-0
              ${s.active ? "-mx-5 px-5 bg-amber-500/6" : ""}`}
          >
            <span className="font-mono-alt text-[9px] text-muted-foreground w-10 flex-shrink-0 pt-0.5">
              {s.week}
            </span>
            <span className="flex-1 text-[13px] leading-snug">{s.task}</span>
            <div className="flex-shrink-0 mt-0.5">
              {s.done ? (
                <div className="w-4 h-4 bg-primary flex items-center justify-center">
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              ) : s.active ? (
                <div className="w-4 h-4 border-2 border-amber-500 bg-amber-500/20" />
              ) : (
                <div className="w-4 h-4 border border-border" />
              )}
            </div>
          </div>
        ))}
      </div>
    </TCard>
  );
}

// ── Vertical 5 — Daily time blocks (hours) ───────────────────────────────────

function V5() {
  return (
    <TCard id="V — 05" scale="HOURS" title="Tuesday Work Schedule">
      <div className="flex flex-col gap-1">
        {daySchedule.map((item, i) => {
          const c = blockColors[item.type] ?? blockColors.admin;
          return (
            <div key={i} className={`flex items-stretch gap-0 ${c.bg}`}>
              <div className={`w-0.5 flex-shrink-0 ${c.bar}`} />
              <div className="py-2 px-3 flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className={`font-mono-alt text-[10px] ${c.text}`}>{item.time}</span>
                  <span className="font-mono-alt text-[9px] text-muted-foreground/50">→ {item.end}</span>
                </div>
                <div className="font-medium text-[13px] leading-snug mt-0.5">{item.event}</div>
                {item.detail && (
                  <div className="font-mono-alt text-[9px] text-muted-foreground mt-0.5">{item.detail}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-border">
        {(Object.entries(blockColors) as [EventType, typeof blockColors[string]][]).map(([t, c]) => (
          <div key={t} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 ${c.bar}`} />
            <span className="font-mono-alt text-[9px] text-muted-foreground capitalize">{t}</span>
          </div>
        ))}
      </div>
    </TCard>
  );
}

// ── Vertical 6 — Incident log (minutes, dark terminal) ───────────────────────

function V6() {
  return (
    <TCard id="V — 06" scale="MINUTES" title="Incident Log #INC-4921" dark>
      <div className="border border-white/8 overflow-hidden">
        {incidentLog.map((entry, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-3 py-2 border-b border-white/5 last:border-0 hover:bg-white/4 transition-colors"
          >
            <span className="font-mono-alt text-[9px] text-white/35 flex-shrink-0 pt-0.5 tabular-nums">
              {entry.ts}
            </span>
            <span className={`font-mono-alt text-[8px] px-1.5 py-0.5 flex-shrink-0 mt-0.5 tracking-wide ${sevStyle[entry.sev]}`}>
              {entry.sev.toUpperCase()}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-mono-alt text-[11px] text-white/75 leading-snug">{entry.msg}</div>
              <div className="font-mono-alt text-[9px] text-white/28 mt-0.5 italic">{entry.svc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
        <span className="font-mono-alt text-[9px] text-white/35">DURATION: 44 MIN 29 SEC</span>
        <span className="font-mono-alt text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 tracking-wide">
          RESOLVED
        </span>
      </div>
    </TCard>
  );
}

// ── Horizontal 1 — Decade company history (years, absolute alternating) ──────

function H1() {
  const n = companyHistory.length;
  const spineY = 106;
  const cardH = 224;
  return (
    <TCard id="H — 01" scale="DECADE" title="Meridian Inc. — Company History 2015–2025">
      <div className="overflow-x-auto">
        <div className="relative min-w-[760px]" style={{ height: `${cardH}px` }}>
          {/* Spine */}
          <div
            className="absolute h-0.5 bg-border"
            style={{ top: `${spineY}px`, left: "3%", right: "3%" }}
          />
          {companyHistory.map((item, i) => {
            const xPct = 3 + (i / (n - 1)) * 94;
            const isCurrent = i === n - 1;
            const above = item.pos === "above";
            return (
              <div key={i} className="absolute" style={{ left: `${xPct}%` }}>
                {/* Dot */}
                <div
                  className="absolute -translate-x-1/2 z-10"
                  style={{ top: `${spineY - 8}px` }}
                >
                  {isCurrent && (
                    <div className="absolute -inset-2 rounded-full bg-amber-500/20 animate-ping" />
                  )}
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-card relative z-10
                      ${isCurrent ? "bg-amber-500" : "bg-primary"}`}
                  />
                </div>
                {/* Year */}
                <div
                  className="absolute font-mono-alt text-[9px] text-muted-foreground text-center"
                  style={{ top: `${spineY + 12}px`, width: "40px", marginLeft: "-20px" }}
                >
                  {item.year}
                </div>
                {/* Above label + connector */}
                {above && (
                  <div
                    className="absolute text-center"
                    style={{ bottom: `${cardH - spineY + 16}px`, width: "112px", marginLeft: "-56px" }}
                  >
                    <div className="font-condensed text-[13px] font-semibold leading-snug">{item.title}</div>
                    <div className="font-mono-alt text-[9px] text-muted-foreground mt-0.5 leading-snug">{item.desc}</div>
                    <div className="w-px h-3 bg-border/60 mx-auto mt-2" />
                  </div>
                )}
                {/* Below label + connector */}
                {!above && (
                  <div
                    className="absolute text-center"
                    style={{ top: `${spineY + 30}px`, width: "112px", marginLeft: "-56px" }}
                  >
                    <div className="w-px h-3 bg-border/60 mx-auto mb-2" />
                    <div className="font-condensed text-[13px] font-semibold leading-snug">{item.title}</div>
                    <div className="font-mono-alt text-[9px] text-muted-foreground mt-0.5 leading-snug">{item.desc}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </TCard>
  );
}

// ── Horizontal 2 — Version history (years/months, absolute alternating) ───────

function H2() {
  const n = versions.length;
  const spineY = 88;
  const cardH = 192;
  return (
    <TCard id="H — 02" scale="YEARS / MONTHS" title="Product Version Timeline v1.0–v4.0">
      <div className="overflow-x-auto">
        <div className="relative min-w-[680px]" style={{ height: `${cardH}px` }}>
          {/* Spine */}
          <div
            className="absolute h-px bg-border"
            style={{ top: `${spineY}px`, left: "3%", right: "3%" }}
          />
          {versions.map((v, i) => {
            const xPct = 3 + (i / (n - 1)) * 94;
            const above = v.pos === "above";
            return (
              <div key={i} className="absolute" style={{ left: `${xPct}%` }}>
                {/* Dot */}
                <div
                  className="absolute w-3 h-3 rounded-full bg-primary border-2 border-card z-10 -translate-x-1/2"
                  style={{ top: `${spineY - 6}px` }}
                />
                {/* Date label (always below spine) */}
                <div
                  className="absolute font-mono-alt text-[8px] text-muted-foreground/60 text-center"
                  style={{ top: `${spineY + 10}px`, width: "48px", marginLeft: "-24px" }}
                >
                  {v.date}
                </div>
                {/* Above label */}
                {above && (
                  <div
                    className="absolute text-center"
                    style={{ bottom: `${cardH - spineY + 12}px`, width: "96px", marginLeft: "-48px" }}
                  >
                    <div className="font-mono-alt text-xs font-semibold text-foreground">{v.ver}</div>
                    <div className="font-condensed text-xs text-muted-foreground">{v.name}</div>
                    <div className="font-mono-alt text-[9px] text-muted-foreground/50 mt-0.5">{v.note}</div>
                    <div className="w-px h-2.5 bg-border/60 mx-auto mt-1.5" />
                  </div>
                )}
                {/* Below label */}
                {!above && (
                  <div
                    className="absolute text-center"
                    style={{ top: `${spineY + 28}px`, width: "96px", marginLeft: "-48px" }}
                  >
                    <div className="w-px h-2.5 bg-border/60 mx-auto mb-1.5" />
                    <div className="font-mono-alt text-xs font-semibold text-foreground">{v.ver}</div>
                    <div className="font-condensed text-xs text-muted-foreground">{v.name}</div>
                    <div className="font-mono-alt text-[9px] text-muted-foreground/50 mt-0.5">{v.note}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </TCard>
  );
}

// ── Horizontal 3 — Gantt chart with grid lines + today marker (months) ────────

function H3() {
  const total = 7;
  const todayX = (1.5 / total) * 100; // mid-Feb
  return (
    <TCard id="H — 03" scale="MONTHS" title="Project Gantt — H1 2025">
      <div className="overflow-x-auto">
        <div className="min-w-[580px]">
          {/* Month headers with grid alignment */}
          <div className="relative flex mb-0 border-b border-border pb-2">
            {ganttMonths.map((m, i) => (
              <div key={i} className="flex-1 font-mono-alt text-[9px] text-muted-foreground">{m}</div>
            ))}
          </div>
          {/* Phase rows */}
          <div className="flex flex-col gap-1.5 mt-3">
            {gantt.map((phase, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-36 flex-shrink-0 font-mono-alt text-[10px] text-muted-foreground truncate">
                  {phase.phase}
                </div>
                <div className="flex-1 relative h-8 bg-muted/25 overflow-hidden">
                  {/* Vertical month grid lines */}
                  {ganttMonths.map((_, j) => (
                    <div
                      key={j}
                      className="absolute top-0 bottom-0 border-l border-border/40"
                      style={{ left: `${(j / total) * 100}%` }}
                    />
                  ))}
                  {/* Phase bar */}
                  <div
                    className={`absolute top-1 bottom-1 ${ganttColors[phase.type]} flex items-center px-2 overflow-hidden z-10`}
                    style={{
                      left: `${(phase.start / total) * 100}%`,
                      width: `${((phase.end - phase.start) / total) * 100}%`,
                    }}
                  >
                    <span className="font-mono-alt text-[9px] text-white/80 truncate">{phase.phase}</span>
                  </div>
                  {/* Today marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-accent z-20"
                    style={{ left: `${todayX}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <div className="flex flex-wrap gap-4">
              {(["research", "design", "dev", "qa", "release"] as PhaseType[]).map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <div className={`w-3 h-2 ${ganttColors[t]}`} />
                  <span className="font-mono-alt text-[9px] text-muted-foreground capitalize">{t}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-0.5 h-3 bg-accent" />
              <span className="font-mono-alt text-[9px] text-muted-foreground">Today · Feb 14</span>
            </div>
          </div>
        </div>
      </div>
    </TCard>
  );
}

// ── Horizontal 4 — Sprint day columns with velocity (days) ────────────────────

function H4() {
  const totalDone = sprintDays.reduce((a, d) => a + d.done, 0);
  const totalTasks = sprintDays.reduce((a, d) => a + d.total, 0);
  return (
    <TCard id="H — 04" scale="DAYS" title="Sprint 12 — Daily Task Completion">
      <div className="flex justify-between mb-3">
        <span className="font-mono-alt text-[9px] text-muted-foreground tracking-widest">SPRINT VELOCITY</span>
        <span className="font-mono-alt text-[9px] text-primary">{totalDone} / {totalTasks} tasks · Week 2 of 2</span>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[580px]">
          <div className="flex gap-px" style={{ background: "var(--border)" }}>
            {sprintDays.map((d, i) => {
              const pct = d.total > 0 ? (d.done / d.total) * 100 : 0;
              const isPast = !d.today && i < sprintDays.findIndex((x) => x.today);
              return (
                <div
                  key={i}
                  className={`flex-1 flex flex-col items-center overflow-hidden ${d.today ? "bg-card" : isPast ? "bg-card" : "bg-background"}`}
                >
                  <div
                    className={`font-mono-alt text-[9px] w-full text-center py-1.5 border-b border-border
                      ${d.today ? "text-primary font-medium bg-primary/6" : "text-muted-foreground"}`}
                  >
                    {d.day}
                  </div>
                  <div className="w-full px-1.5 mt-2 mb-1">
                    <div className="relative h-24 bg-muted/30 overflow-hidden">
                      <div
                        className={`absolute bottom-0 left-0 right-0
                          ${d.today ? "bg-amber-400" : pct === 100 ? "bg-primary" : isPast ? "bg-primary/60" : "bg-muted"}`}
                        style={{ height: `${pct}%` }}
                      />
                      {pct > 0 && pct < 100 && (
                        <div
                          className="absolute left-0 right-0 font-mono-alt text-[8px] text-center text-primary/60"
                          style={{ bottom: `${pct + 2}%` }}
                        >
                          {Math.round(pct)}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="font-mono-alt text-[8px] text-muted-foreground pb-1.5 tabular-nums">
                    {d.done}/{d.total}
                  </div>
                  {d.today && (
                    <div className="font-mono-alt text-[7px] text-amber-500 pb-1.5 tracking-widest">NOW</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TCard>
  );
}

// ── Horizontal 5 — Proportional time blocks, aligned axis (hours) ─────────────

function H5() {
  const startH = 8;
  const totalH = 9.5; // 8:00–17:30
  const hours = Array.from({ length: 10 }, (_, i) => startH + i);
  const nowOffset = 10.5 - startH; // 10:30am marker
  return (
    <TCard id="H — 05" scale="HOURS" title="Wednesday — Time Block Schedule">
      <div className="overflow-x-auto">
        <div className="min-w-[580px]">
          {/* Aligned hour labels (absolute, keyed to block positions) */}
          <div className="relative h-5">
            {hours.map((h) => (
              <div
                key={h}
                className="absolute font-mono-alt text-[9px] text-muted-foreground"
                style={{ left: `${((h - startH) / totalH) * 100}%` }}
              >
                {h < 12 ? `${h}am` : h === 12 ? "12p" : `${h - 12}pm`}
              </div>
            ))}
          </div>
          {/* Tick marks aligned to same positions */}
          <div className="relative h-2 mb-0.5">
            {hours.map((h) => (
              <div
                key={h}
                className="absolute bottom-0 w-px h-2 bg-border"
                style={{ left: `${((h - startH) / totalH) * 100}%` }}
              />
            ))}
          </div>
          {/* Proportional block strip */}
          <div className="relative h-16 bg-muted/20 border border-border overflow-hidden">
            {timeBlocks.map((block, i) => {
              const c = hBlockColors[block.type] ?? { bg: "bg-muted", text: "text-foreground" };
              return (
                <div
                  key={i}
                  className={`absolute top-0 bottom-0 ${c.bg} flex items-center px-1.5 overflow-hidden border-r border-white/10`}
                  style={{
                    left: `${(block.start / totalH) * 100}%`,
                    width: `${(block.span / totalH) * 100}%`,
                  }}
                >
                  {block.span >= 0.6 && (
                    <span className={`font-mono-alt text-[9px] truncate leading-tight ${c.text}`}>
                      {block.label}
                    </span>
                  )}
                </div>
              );
            })}
            {/* Now marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-accent z-10"
              style={{ left: `${(nowOffset / totalH) * 100}%` }}
            />
          </div>
          <div className="h-px bg-border" />
          <div className="flex flex-wrap gap-4 mt-3 items-center">
            {(["focus", "meeting", "break", "admin"] as string[]).map((t) => {
              const c = hBlockColors[t];
              return (
                <div key={t} className="flex items-center gap-1.5">
                  <div className={`w-3 h-2 ${c.bg}`} />
                  <span className="font-mono-alt text-[9px] text-muted-foreground capitalize">{t}</span>
                </div>
              );
            })}
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="w-0.5 h-3 bg-accent" />
              <span className="font-mono-alt text-[9px] text-muted-foreground">Now · 10:30am</span>
            </div>
          </div>
        </div>
      </div>
    </TCard>
  );
}

// ── Horizontal 6 — Time-proportional event stream, angled labels (minutes) ────

function H6() {
  const startMin = 12 * 60; // 720
  const totalMin = 120;     // 12:00–14:00
  const toMin = (ts: string) => {
    const [h, m] = ts.split(":").map(Number);
    return h * 60 + m;
  };
  const axisMarks = [12, 12.5, 13, 13.5, 14];

  return (
    <TCard id="H — 06" scale="MINUTES" title="System Event Stream — 12:00–14:00">
      <div className="overflow-x-auto">
        <div className="relative min-w-[720px]">
          {/* Angled labels — absolutely positioned per time offset */}
          <div className="relative" style={{ height: "104px" }}>
            {sysEvents.map((e, i) => {
              const xPct = ((toMin(e.ts) - startMin) / totalMin) * 100;
              return (
                <div
                  key={i}
                  className="absolute bottom-0"
                  style={{
                    left: `${xPct}%`,
                    transform: "rotate(-42deg)",
                    transformOrigin: "bottom left",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span className="font-mono-alt text-[9px] text-muted-foreground">{e.label}</span>
                </div>
              );
            })}
          </div>
          {/* Spine */}
          <div className="relative" style={{ height: "20px" }}>
            <div className="absolute inset-x-0 h-0.5 bg-border" style={{ top: "8px" }} />
            {/* Time-proportional dots */}
            {sysEvents.map((e, i) => {
              const xPct = ((toMin(e.ts) - startMin) / totalMin) * 100;
              return (
                <div
                  key={i}
                  className={`absolute w-3.5 h-3.5 rounded-full border-2 border-card z-10 -translate-x-1/2 ${eventDotColor[e.type]}`}
                  style={{ left: `${xPct}%`, top: "1px" }}
                />
              );
            })}
          </div>
          {/* Time axis */}
          <div className="relative h-6 mt-0.5">
            {axisMarks.map((h) => {
              const xPct = ((h * 60 - startMin) / totalMin) * 100;
              const label = Number.isInteger(h)
                ? `${h}:00`
                : `${Math.floor(h)}:30`;
              return (
                <div
                  key={h}
                  className="absolute flex flex-col items-center -translate-x-1/2"
                  style={{ left: `${xPct}%` }}
                >
                  <div className="w-px h-2 bg-border mb-0.5" />
                  <span className="font-mono-alt text-[9px] text-muted-foreground tabular-nums">{label}</span>
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-border">
            {(Object.entries(eventDotColor) as [string, string][]).map(([t, c]) => (
              <div key={t} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${c}`} />
                <span className="font-mono-alt text-[9px] text-muted-foreground">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TCard>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────

type Tab = "vertical" | "horizontal";

export default function App() {
  const [tab, setTab] = useState<Tab>("horizontal");

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Page header */}
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border">
        <div className="max-w-screen-2xl mx-auto px-8 py-4 flex items-end justify-between">
          <div>
            <div className="font-mono-alt text-[9px] text-muted-foreground tracking-[0.22em] mb-1">
              COMPONENT LIBRARY
            </div>
            <h1 className="font-condensed text-4xl font-semibold tracking-tight leading-none">
              Timeline Variations
            </h1>
          </div>
          <div className="flex gap-0 border border-border">
            {(["vertical", "horizontal"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`font-mono-alt text-[10px] px-5 py-2 transition-colors tracking-widest
                  ${tab === t
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
              >
                {t === "vertical" ? "↕  VERTICAL" : "↔  HORIZONTAL"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-8 py-8">
        {tab === "vertical" ? (
          <>
            <div className="font-mono-alt text-[9px] text-muted-foreground tracking-[0.2em] mb-5">
              VERTICAL — 6 VARIATIONS · YEARS / MONTHS / WEEKS / HOURS / MINUTES
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              <V1 /><V2 /><V3 /><V4 /><V5 /><V6 />
            </div>
          </>
        ) : (
          <>
            <div className="font-mono-alt text-[9px] text-muted-foreground tracking-[0.2em] mb-5">
              HORIZONTAL — 6 VARIATIONS · DECADE / YEARS / MONTHS / DAYS / HOURS / MINUTES
            </div>
            <div className="flex flex-col gap-5">
              <H1 /><H2 /><H3 /><H4 /><H5 /><H6 />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
