import { useState } from "react";
import { ChevronRight, X, Check } from "lucide-react";

const SANS = "'DM Sans', sans-serif";
const MONO = "'DM Mono', monospace";

// ── V1: Narrative Brief — Healthcare ──────────────────────────────────────────
// AI writes the briefing as prose. Tappable entity chips reveal context.
function NarrativeBrief() {
  type Seg = { t: "text"; c: string } | { t: "chip"; label: string; detail: string };
  const paras: Seg[][] = [
    [
      { t: "text", c: "Your ward has " },
      { t: "chip", label: "24 patients", detail: "2 critical, 8 post-op, 14 routine. Full list in Rounds view." },
      { t: "text", c: " today. " },
      { t: "chip", label: "Torres (4B)", detail: "BP 185/110 since 05:30. Rush CBC ordered. Review medication before rounds — this is your highest priority." },
      { t: "text", c: " needs immediate attention, with blood pressure trending dangerously since early morning." },
    ],
    [
      { t: "chip", label: "Sarah K.", detail: "ICU post-op. Vitals stable overnight. Dr. Reeves left notes — reviewed at handoff." },
      { t: "text", c: " remains stable in the ICU. Four procedures begin at " },
      { t: "chip", label: "09:00 in OR 2", detail: "Knee replacement — Dr. Patel. Pre-op checklist complete. Anesthesia confirmed." },
      { t: "text", c: ". There is a " },
      { t: "chip", label: "14:00 conflict in OR 3", detail: "Double-booked: Laparoscopy (Dr. Chen) overlaps Cardiology consult. Escalate to scheduling before noon." },
      { t: "text", c: " that requires resolution before midday." },
    ],
    [
      { t: "text", c: "Three labs are pending: a rush " },
      { t: "chip", label: "CBC for Torres", detail: "Ordered 06:00. Lab running 2h behind schedule. Call ext. 4412 to expedite — results needed for rounds." },
      { t: "text", c: ", a routine lipid screen for Martinez, and an echo for Williams. Results route to your queue as they arrive." },
    ],
  ];

  const [active, setActive] = useState<{ label: string; detail: string } | null>(null);
  const accent = "#0D9488";
  const bg = "#F0FAFA";
  const text = "#0C2340";
  const muted = "#4A7A8A";
  const border = "rgba(13,148,136,0.12)";

  return (
    <div className="relative flex flex-col h-full" style={{ background: bg, fontFamily: SANS }}>
      <div className="px-5 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
        <div className="text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: muted }}>
          Daily Briefing · Healthcare
        </div>
        <div className="text-[19px] font-bold leading-tight" style={{ color: text }}>
          Good morning, Dr. Reeves.
        </div>
        <div className="text-[11px] mt-1" style={{ color: muted }}>
          Fri, Jun 19 · Ward summary · Generated 07:02
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5" style={{ scrollbarWidth: "none" }}>
        <div className="space-y-5">
          {paras.map((para, pi) => (
            <p key={pi} className="text-[14px] leading-[1.8]" style={{ color: text }}>
              {para.map((seg, si) =>
                seg.t === "text" ? (
                  <span key={si}>{seg.c}</span>
                ) : (
                  <button
                    key={si}
                    onClick={() => setActive({ label: seg.label, detail: seg.detail })}
                    className="inline rounded-md px-1.5 py-0.5 font-semibold text-[13px] transition-opacity hover:opacity-75"
                    style={{ background: `${accent}18`, color: accent }}
                  >
                    {seg.label}
                  </button>
                )
              )}
            </p>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-7 pb-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
          <span className="text-[11px]" style={{ color: muted }}>
            AI summary · 24 records · Tap highlighted terms for detail
          </span>
        </div>
      </div>

      {active && (
        <div
          className="absolute inset-x-0 bottom-0 rounded-t-2xl p-5 z-10"
          style={{ background: "#fff", borderTop: `1px solid ${border}`, boxShadow: "0 -12px 40px rgba(0,0,0,0.12)" }}
        >
          <div className="flex items-start justify-between mb-3 gap-3">
            <span className="text-[13px] font-bold" style={{ color: accent }}>{active.label}</span>
            <button onClick={() => setActive(null)} className="flex-shrink-0">
              <X size={16} style={{ color: muted }} />
            </button>
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: text }}>{active.detail}</p>
        </div>
      )}
    </div>
  );
}

// ── V2: Priority Stack — Sales CRM ────────────────────────────────────────────
// AI ranks the 3 things that need you today, with its reasoning visible.
function PriorityStack() {
  const bg = "#FFFFFF";
  const text = "#111827";
  const muted = "#6B7280";
  const border = "rgba(0,0,0,0.07)";
  const card = "#F9FAFB";

  const items = [
    {
      rank: "01",
      title: "Wayne Enterprises",
      why: "Decision window closes at 5pm today. $350K on the line. You haven't spoken in 3 days — silence reads as disinterest on their end.",
      meta: "$350K · Hard close today",
      color: "#EF4444",
      actions: ["Call now", "Open record"],
    },
    {
      rank: "02",
      title: "Umbrella Corp follow-up",
      why: "Lead score jumped from 71 to 88 overnight — something triggered. Two competing agencies are active. This window won't stay open.",
      meta: "Score 88 · $75K opp",
      color: "#F59E0B",
      actions: ["Send email", "View score"],
    },
    {
      rank: "03",
      title: "Acme Q3 renewal",
      why: "Contract expires Jun 30 and no renewal conversation has started. At this pace, you're 11 days from a lapse on a $120K account.",
      meta: "$120K · 11 days to expiry",
      color: "#4361EE",
      actions: ["Schedule call", "View deal"],
    },
  ];

  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full" style={{ background: bg, fontFamily: SANS }}>
      <div className="px-5 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
        <div className="text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: muted }}>
          Daily Briefing · Sales CRM
        </div>
        <div className="text-[19px] font-bold leading-tight" style={{ color: text }}>
          3 things need you today.
        </div>
        <div className="text-[11px] mt-1" style={{ color: muted }}>
          Fri, Jun 19 · AI-ranked by urgency × revenue at risk
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: "none" }}>
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full text-left rounded-2xl p-4 transition-all duration-200"
            style={{
              background: card,
              borderLeft: `4px solid ${item.color}`,
              boxShadow: expanded === i ? "0 4px 20px rgba(0,0,0,0.07)" : "none",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="text-[46px] font-bold leading-none flex-shrink-0 select-none mt-[-4px]"
                style={{ color: item.color, opacity: 0.1, fontFamily: MONO }}
              >
                {item.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold leading-tight" style={{ color: text }}>
                  {item.title}
                </div>
                <div className="text-[11px] font-medium mt-0.5" style={{ color: item.color }}>
                  {item.meta}
                </div>
                {expanded === i && (
                  <div className="mt-2.5">
                    <p className="text-[12px] leading-relaxed" style={{ color: muted }}>
                      {item.why}
                    </p>
                    <div className="flex gap-2 mt-3">
                      {item.actions.map((a) => (
                        <span
                          key={a}
                          className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
                          style={{ background: `${item.color}15`, color: item.color }}
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}

        <div className="pt-2 pb-2">
          <div className="text-[9px] font-bold tracking-[0.16em] uppercase mb-2" style={{ color: muted }}>
            Also on your radar
          </div>
          {[
            "5 tasks due · Pipeline review overdue",
            "Globex expansion advancing to proposal",
            "Q1 report ready for stakeholder share",
          ].map((t, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2.5"
              style={{ borderBottom: `1px solid ${border}` }}
            >
              <span className="text-[12px]" style={{ color: text }}>{t}</span>
              <ChevronRight size={12} style={{ color: muted, opacity: 0.4 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── V3: Morning Memo — Finance ─────────────────────────────────────────────────
// Formatted like an internal memo. The AI is your analyst. Readable document.
function MorningMemo() {
  const bg = "#FAFAF8";
  const text = "#1A1A1A";
  const muted = "#6B6B5A";
  const accent = "#1A3A6B";
  const border = "rgba(0,0,0,0.09)";
  const green = "#1A7A4A";
  const red = "#C0392B";

  const [checked, setChecked] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setChecked((prev) => { const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next; });

  const facts = [
    { label: "NVDA", body: "Up 4.2% pre-market on earnings expectations. Your 50 shares are up $3,605 on paper this morning. Earnings after close — expect high volatility.", color: green },
    { label: "FED", body: "Rate decision at 14:00 EST. A hold is widely expected, but guidance language is the market-moving variable. Reduce risk exposure before noon.", color: accent },
    { label: "RISK", body: "Three stop-loss orders are near trigger: TSLA at $238.20 (current: $242.10), and two bond ETFs. Review before market open at 09:30.", color: red },
  ];

  const actions = [
    "Review 3 stop-loss orders before 09:30",
    "Set NVDA limit sell at $920 if earnings disappoint",
    "Monitor Fed guidance language at 14:00",
  ];

  return (
    <div className="flex flex-col h-full" style={{ background: bg, fontFamily: SANS }}>
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {/* Memo header */}
        <div className="px-5 pt-6 pb-5" style={{ borderBottom: `2px solid ${text}` }}>
          <div className="text-[10px] font-bold tracking-[0.2em] uppercase mb-4" style={{ color: muted, fontFamily: MONO }}>
            Daily Briefing · Finance
          </div>
          <div className="space-y-1.5" style={{ fontFamily: MONO }}>
            {[
              ["TO", "Sarah Chen"],
              ["FROM", "AI Financial Analyst"],
              ["DATE", "Friday, June 19, 2026"],
              ["RE", "Pre-Market Morning Brief"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-4 text-[11px]">
                <span className="w-10 font-bold flex-shrink-0" style={{ color: muted }}>{k}</span>
                <span style={{ color: text }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Situation */}
        <div className="px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${border}` }}>
          <div className="text-[9px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: muted, fontFamily: MONO }}>
            Situation
          </div>
          <p className="text-[13px] leading-[1.8]" style={{ color: text }}>
            Markets are cautiously positioned ahead of today's Fed decision. Your portfolio gained{" "}
            <span className="font-semibold" style={{ color: green }}>+$18,240</span>{" "}
            overnight, led by NVDA which is up 4.2% pre-market on earnings anticipation. The Fed meeting at 14:00 EST is the primary risk event — hold guidance language could move rates across the curve.
          </p>
        </div>

        {/* Key facts */}
        <div className="px-5 pt-4 pb-4" style={{ borderBottom: `1px solid ${border}` }}>
          <div className="text-[9px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: muted, fontFamily: MONO }}>
            Key Developments
          </div>
          <div className="space-y-3">
            {facts.map((f, i) => (
              <div key={i} className="flex gap-3">
                <span
                  className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 h-fit mt-0.5"
                  style={{ background: `${f.color}12`, color: f.color, fontFamily: MONO }}
                >
                  {f.label}
                </span>
                <p className="text-[12px] leading-relaxed" style={{ color: text }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pt-4 pb-6">
          <div className="text-[9px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: muted, fontFamily: MONO }}>
            Action Required
          </div>
          <div className="space-y-2.5">
            {actions.map((a, i) => (
              <button
                key={i}
                onClick={() => toggle(i)}
                className="w-full flex items-start gap-3 text-left transition-opacity"
                style={{ opacity: checked.has(i) ? 0.45 : 1 }}
              >
                <div
                  className="w-4 h-4 rounded flex-shrink-0 mt-0.5 flex items-center justify-center"
                  style={{
                    border: `1.5px solid ${checked.has(i) ? accent : border}`,
                    background: checked.has(i) ? accent : "transparent",
                  }}
                >
                  {checked.has(i) && <Check size={9} color="#fff" strokeWidth={3} />}
                </div>
                <span
                  className="text-[12px] leading-snug"
                  style={{
                    color: text,
                    textDecoration: checked.has(i) ? "line-through" : "none",
                  }}
                >
                  {a}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── V4: Delta Brief — Legal ────────────────────────────────────────────────────
// What changed since yesterday. The AI surfaces deltas, not the full picture.
function DeltaBrief() {
  const bg = "#FAFAF4";
  const text = "#1B2D4F";
  const muted = "#7A7A65";
  const accent = "#1B2D4F";
  const border = "rgba(27,45,79,0.1)";
  const card = "#FFFFFF";
  const red = "#C0392B";
  const amber = "#A05C00";

  const [expanded, setExpanded] = useState<number | null>(0);

  const urgent = [
    {
      matter: "Chen v. Whitmore",
      what: "Opposing counsel filed an emergency motion at 22:47 last night. Your hearing is at 09:00 this morning — you have limited time to prepare a response.",
      actions: ["Review motion", "Add to prep notes"],
      actionColor: red,
    },
  ];

  const changed = [
    {
      matter: "Harmon LLC deposition",
      from: "Jun 25",
      to: "Jul 2",
      note: "Rescheduled by opposing party without notice. Notify your client today and update your calendar.",
    },
    {
      matter: "Estate of Briggs",
      from: "Filing pending",
      to: "Filed ✓",
      note: "All documents confirmed received by the court. Deadline met. No further action required.",
      positive: true,
    },
  ];

  const fresh = [
    "Park v. NordTech (IP) — assigned to you this morning",
    "Client call requested: Martinez re: settlement terms",
  ];

  const unchanged = ["Harmon LLC v. City · proceeding as scheduled", "3 other active matters · no overnight developments"];

  return (
    <div className="flex flex-col h-full" style={{ background: bg, fontFamily: SANS }}>
      <div className="px-5 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
        <div className="text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: muted }}>
          Daily Briefing · Legal
        </div>
        <div className="text-[19px] font-bold leading-tight" style={{ color: text }}>
          What changed overnight.
        </div>
        <div className="text-[11px] mt-1" style={{ color: muted }}>
          Fri, Jun 19 · Since 20:00 Thu · 3 developments
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "none" }}>
        {/* Needs attention */}
        <div className="text-[9px] font-bold tracking-[0.16em] uppercase mb-2.5" style={{ color: red, fontFamily: MONO }}>
          ⚠ Needs Attention
        </div>
        {urgent.map((u, i) => (
          <button
            key={i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full text-left rounded-2xl p-4 mb-4 transition-all"
            style={{
              background: card,
              borderLeft: `3px solid ${red}`,
              boxShadow: expanded === i ? "0 4px 16px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            <div className="text-[13px] font-semibold" style={{ color: text }}>{u.matter}</div>
            {expanded === i && (
              <>
                <p className="text-[12px] leading-relaxed mt-2" style={{ color: muted }}>{u.what}</p>
                <div className="flex gap-2 mt-3">
                  {u.actions.map((a) => (
                    <span
                      key={a}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: `${red}12`, color: red }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </>
            )}
            {expanded !== i && (
              <p className="text-[12px] mt-1 line-clamp-2" style={{ color: muted }}>{u.what}</p>
            )}
          </button>
        ))}

        {/* Changed */}
        <div className="text-[9px] font-bold tracking-[0.16em] uppercase mb-2.5" style={{ color: amber, fontFamily: MONO }}>
          ↑ Changed
        </div>
        <div className="space-y-2 mb-4">
          {changed.map((c, i) => (
            <div
              key={i}
              className="rounded-xl p-3.5"
              style={{ background: card, borderLeft: `3px solid ${c.positive ? "#1A7A4A" : border}` }}
            >
              <div className="text-[13px] font-semibold" style={{ color: text }}>{c.matter}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] line-through" style={{ color: muted, fontFamily: MONO }}>{c.from}</span>
                <span className="text-[10px]" style={{ color: muted }}>→</span>
                <span className="text-[11px] font-semibold" style={{ color: c.positive ? "#1A7A4A" : accent, fontFamily: MONO }}>{c.to}</span>
              </div>
              <p className="text-[11px] mt-1.5 leading-snug" style={{ color: muted }}>{c.note}</p>
            </div>
          ))}
        </div>

        {/* New */}
        <div className="text-[9px] font-bold tracking-[0.16em] uppercase mb-2.5" style={{ color: accent, fontFamily: MONO }}>
          + New This Morning
        </div>
        <div className="space-y-2 mb-4">
          {fresh.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5 py-2" style={{ borderBottom: `1px solid ${border}` }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: accent }} />
              <span className="text-[12px]" style={{ color: text }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Unchanged */}
        <div className="text-[9px] font-bold tracking-[0.16em] uppercase mb-2" style={{ color: muted, fontFamily: MONO }}>
          — No Changes
        </div>
        <div className="space-y-1 pb-4">
          {unchanged.map((u, i) => (
            <div key={i} className="text-[12px]" style={{ color: muted }}>{u}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── V5: Standup Brief — DevOps ─────────────────────────────────────────────────
// Three-part structure: yesterday's summary / today's plan / watch items.
function StandupBrief() {
  const bg = "#0D1117";
  const text = "#E6EDF3";
  const muted = "#7D8590";
  const border = "rgba(255,255,255,0.07)";
  const card = "#161B22";
  const green = "#22C55E";
  const red = "#F87171";
  const yellow = "#F59E0B";

  const sections = [
    {
      label: "YESTERDAY",
      color: muted,
      intro:
        "api-gateway v2.4.1 shipped to production at 07:22 with zero rollbacks and stable error rates. Four PRs were merged, including the session-expiry fix that was blocking the mobile team. Late in the evening, auth-service began showing elevated latency — it was not caught before end of day.",
      bullets: [
        { text: "api-gateway v2.4.1 → prod · clean deploy · no alerts", ok: true },
        { text: "4 PRs merged · no rollbacks · test coverage improved", ok: true },
        { text: "auth-service latency spike at 22:14 · P1 declared 06:42", ok: false },
      ],
    },
    {
      label: "TODAY",
      color: green,
      intro:
        "The auth-service P1 is the top priority. Two engineers are engaged and estimate 30 minutes to resolution. Once that clears, the frontend staging deployment and the worker-queue production deploy are both scheduled for 10:00.",
      bullets: [
        { text: "P1 auth-service: 2 on-call · ETA 30min · monitor closely", ok: false },
        { text: "frontend v1.8.3 → staging · deploy at 10:00 pending P1", ok: null },
        { text: "worker-queue v0.9.0 → prod · scheduled 10:00", ok: null },
      ],
    },
    {
      label: "WATCH",
      color: yellow,
      intro:
        "Three items need attention before end of day: PRs that are ready to merge are being held while auth-service is degraded. SSL cert on billing-svc expires in 8 days. One PR has been in review for 72 hours without a decision.",
      bullets: [
        { text: "3 PRs ready to merge · blocked on auth-service P1", ok: null },
        { text: "billing-svc SSL cert · expires Jun 27 · renew this week", ok: false },
        { text: "auth-middleware PR · 72h stale · needs decision", ok: null },
      ],
    },
  ];

  const [open, setOpen] = useState<number>(0);

  return (
    <div className="flex flex-col h-full" style={{ background: bg, fontFamily: SANS }}>
      <div className="px-5 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
        <div
          className="text-[9px] tracking-[0.18em] uppercase mb-1"
          style={{ color: muted, fontFamily: MONO }}
        >
          Daily Briefing · DevOps
        </div>
        <div className="text-[19px] font-bold leading-tight" style={{ color: text }}>
          Morning standup.
        </div>
        <div className="flex items-center gap-3 mt-1">
          <div className="text-[11px]" style={{ color: muted }}>Fri, Jun 19 · 07:04 UTC</div>
          <div
            className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: `${red}20`, color: red, fontFamily: MONO }}
          >
            DEGRADED
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
        {sections.map((s, i) => (
          <button
            key={i}
            onClick={() => setOpen(i)}
            className="flex-1 py-2.5 text-[10px] font-bold tracking-[0.12em] transition-colors"
            style={{
              color: open === i ? s.color : muted,
              borderBottom: open === i ? `2px solid ${s.color}` : "2px solid transparent",
              fontFamily: MONO,
              background: "transparent",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {sections.map((s, i) =>
          open !== i ? null : (
            <div key={i} className="px-5 py-5">
              <p className="text-[13px] leading-[1.8] mb-5" style={{ color: text }}>
                {s.intro}
              </p>
              <div className="space-y-2.5">
                {s.bullets.map((b, bi) => (
                  <div
                    key={bi}
                    className="flex items-start gap-3 rounded-lg px-3.5 py-2.5"
                    style={{ background: card }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                      style={{
                        background: b.ok === true ? green : b.ok === false ? red : yellow,
                      }}
                    />
                    <span
                      className="text-[11px] leading-snug"
                      style={{ color: muted, fontFamily: MONO }}
                    >
                      {b.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ── V6: Story Digest — Real Estate ────────────────────────────────────────────
// Newsletter digest. Each story is a narrative card. The AI is the editor.
function DigestView() {
  const bg = "#FEF9F5";
  const text = "#1C1A17";
  const muted = "#8C7B68";
  const accent = "#C2603B";
  const border = "rgba(194,96,59,0.12)";
  const card = "#FFFFFF";

  const stories = [
    {
      tag: "URGENT",
      tagColor: "#EF4444",
      title: "234 Maple offer expires at 5pm today",
      body: "Buyers set a hard deadline. The $1.18M bid is $20K below ask, but a backup offer at $1.15M puts you in a stronger position than it appears. Counter or accept — you need to respond by 4pm.",
    },
    {
      tag: "SCHEDULE",
      tagColor: accent,
      title: "Your heaviest showing day this month",
      body: "8 showings from 10am to 6pm. Johnson family at 10am for Maple are your most likely converters — they've toured twice. A repeat visitor at Harbor Blvd at 3pm is a strong signal. Be present for both.",
    },
    {
      tag: "LISTING",
      tagColor: "#7C3AED",
      title: "12 Harbor Blvd: $50K price drop is live",
      body: "The reduction to $2.1M went live at 06:00 and has already generated 3 new inquiries. Previous buyer feedback cited overpricing vs. comps — this correction puts it back in range.",
    },
    {
      tag: "FINANCE",
      tagColor: "#F59E0B",
      title: "Johnson rate lock expires tomorrow",
      body: "If 234 Maple closes today, their financing is secure. If not, they face re-lock fees or deal risk. This makes your 4pm response deadline more critical than it appears on the surface.",
    },
    {
      tag: "REVIEW",
      tagColor: muted,
      title: "78 Elm St expired after 88 days",
      body: "No offers across nearly three months. Two comparable sales at $600K suggest the $640K list price was above market. Worth an honest conversation with the seller about repricing strategy.",
    },
  ];

  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="flex flex-col h-full" style={{ background: bg, fontFamily: SANS }}>
      <div className="px-5 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
        <div className="text-[10px] font-bold tracking-[0.16em] uppercase mb-1" style={{ color: muted }}>
          Daily Briefing · Real Estate
        </div>
        <div className="text-[19px] font-bold leading-tight" style={{ color: text }}>
          Property digest.
        </div>
        <div className="text-[11px] mt-1" style={{ color: muted }}>
          Fri, Jun 19 · 5 stories · 32 active listings
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "none" }}>
        <div className="space-y-2">
          {stories.map((s, i) => (
            <button
              key={i}
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full text-left rounded-2xl overflow-hidden transition-all"
              style={{
                background: card,
                boxShadow: expanded === i ? "0 4px 20px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="h-[3px]" style={{ background: s.tagColor }} />
              <div className="px-4 py-3.5">
                <div className="flex items-start gap-2.5">
                  <span
                    className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                    style={{ background: `${s.tagColor}14`, color: s.tagColor }}
                  >
                    {s.tag}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold leading-snug" style={{ color: text }}>
                      {s.title}
                    </div>
                    {expanded === i && (
                      <p className="text-[12px] leading-relaxed mt-2" style={{ color: muted }}>
                        {s.body}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-4 mb-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
          <span className="text-[11px]" style={{ color: muted }}>
            AI digest · Generated 06:55 · Tap stories to expand
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Shell ──────────────────────────────────────────────────────────────────────

const VARIANTS = [
  { id: "narrative", label: "Healthcare", tagline: "Narrative Brief", accent: "#0D9488", component: NarrativeBrief },
  { id: "priority", label: "Sales CRM", tagline: "Priority Stack", accent: "#4361EE", component: PriorityStack },
  { id: "memo", label: "Finance", tagline: "Morning Memo", accent: "#1A3A6B", component: MorningMemo },
  { id: "delta", label: "Legal", tagline: "Delta Brief", accent: "#1B2D4F", component: DeltaBrief },
  { id: "standup", label: "DevOps", tagline: "Standup Brief", accent: "#22C55E", component: StandupBrief },
  { id: "digest", label: "Real Estate", tagline: "Story Digest", accent: "#C2603B", component: DigestView },
];

function PhoneFrame({ variant }: { variant: (typeof VARIANTS)[number] }) {
  const Component = variant.component;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: variant.accent }} />
        <span className="text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.75)" }}>
          {variant.label}
        </span>
        <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
        <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>
          {variant.tagline}
        </span>
      </div>
      <div
        className="overflow-hidden"
        style={{
          width: 340,
          height: 680,
          borderRadius: 28,
          boxShadow: "0 32px 64px -12px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        <Component />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen py-14 px-6" style={{ background: "#0F1014", fontFamily: SANS }}>
      <div className="text-center mb-14">
        <div
          className="text-[10px] font-bold tracking-[0.22em] uppercase mb-3"
          style={{ color: "rgba(255,255,255,0.22)" }}
        >
          Component System
        </div>
        <h1
          className="text-[32px] font-bold leading-none mb-3"
          style={{ color: "rgba(255,255,255,0.92)", fontFamily: SANS }}
        >
          Daily Briefing
        </h1>
        <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.32)" }}>
          Six formats · Six industries · The AI tells you what matters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-[1160px] mx-auto justify-items-center">
        {VARIANTS.map((v) => (
          <PhoneFrame key={v.id} variant={v} />
        ))}
      </div>

      <div className="text-center mt-14">
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.16)" }}>
          Each phone is interactive · Tap chips, cards, and tabs
        </p>
      </div>
    </div>
  );
}
