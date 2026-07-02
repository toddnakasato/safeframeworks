/**
 * CraveStations — the five-station CRAVE panel for the react/19 viewer.
 *
 * Top: the live component (the E — Execute mount via buildComponent).
 * Below: five live cards, one per CRAVE stage:
 *   C Config  — the ConfigBase (editable JSON; edits re-run the pipeline)
 *   R Render  — actual tree read from the live builder output
 *   A Assert  — expected tree derived from the config
 *   V Verify  — diff verdict (GREEN/RED) + mismatch rows
 *   E Execute — live event ticker fed by the component above
 *
 * All pipeline logic lives in framework-free dev/crave-station.ts.
 * This file is shell only — React owns layout and state, never rendering.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import type { ConfigBase, SafeEvent } from "safecontracts";
import { craveRun, pushCraveEvent, treeLines, treeCount } from "../../../../dev/crave-station";
import type { CraveRun, CraveEventLine } from "../../../../dev/crave-station";

const fmtEst = (ts: string) => new Date(ts).toLocaleTimeString("en-US", { timeZone: "America/New_York", hour12: true });

const cardStyle: React.CSSProperties = { border: "1px solid var(--sd-border, #e5e7eb)", borderRadius: 6, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 };
const cardHead: React.CSSProperties = { padding: "6px 10px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--sd-text-muted, #6b7280)", borderBottom: "1px solid var(--sd-border, #e5e7eb)", background: "var(--sd-surface-raised, #fafafa)", display: "flex", alignItems: "center", gap: 6 };
const cardBody: React.CSSProperties = { padding: "8px 10px", fontFamily: "monospace", fontSize: 9.5, lineHeight: 1.55, flex: 1, overflow: "auto", minHeight: 0, whiteSpace: "pre" };

export function CraveStations({ config, label, onOuterEvent, ticketRow }: {
  config: ConfigBase;
  label: string;
  onOuterEvent?: (event: SafeEvent) => void;
  ticketRow?: ReactNode;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [override, setOverride] = useState<ConfigBase | null>(null);
  const [configText, setConfigText] = useState("");
  const [configErr, setConfigErr] = useState<string | null>(null);
  const [run, setRun] = useState<CraveRun | null>(null);
  const [events, setEvents] = useState<CraveEventLine[]>([]);

  const effective = override ?? config;

  // reset override + ticker when the selected sample changes
  useEffect(() => { setOverride(null); setEvents([]); }, [config]);
  useEffect(() => { setConfigText(JSON.stringify(effective, null, 2)); setConfigErr(null); }, [effective]);

  const handleEvent = useCallback((event: SafeEvent) => {
    setEvents(prev => pushCraveEvent(prev, event));
    onOuterEvent?.(event);
  }, [onOuterEvent]);

  // C→R→A→V→E: one pipeline run per effective config
  useEffect(() => {
    if (!mountRef.current) return;
    setRun(craveRun(effective, mountRef.current, handleEvent));
  }, [effective, handleEvent]);

  const applyConfigText = (text: string) => {
    setConfigText(text);
    try {
      const parsed = JSON.parse(text);
      setConfigErr(null);
      setOverride(parsed);
    } catch (e: any) {
      setConfigErr(e.message?.split("\n")[0] ?? "invalid JSON");
    }
  };

  const verdictColor = run?.verdict === "GREEN" ? "var(--sd-success, #15803d)" : run?.verdict === "RED" ? "var(--sd-danger, #dc2626)" : "var(--sd-warn, #d97706)";

  return (
    <>
      {/* Component card — the live E mount */}
      <div style={{ border: "1px solid var(--sd-border, #e5e7eb)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--sd-text-muted, #6b7280)", borderBottom: "1px solid var(--sd-border, #e5e7eb)", background: "var(--sd-surface-raised, #fafafa)", display: "flex", alignItems: "center" }}>
          <span>{label}</span>
          {run && (
            <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, color: verdictColor }}>
              CRAVE {run.verdict} — {run.renderMs}ms — {fmtEst(run.ts)} ET
            </span>
          )}
        </div>
        <div style={{ padding: 16 }}>
          <div ref={mountRef} />
        </div>
        {ticketRow}
      </div>

      {/* Five-station strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, height: "38vh", marginTop: 4 }}>
        {/* C — Config */}
        <div style={cardStyle}>
          <div style={cardHead}>
            <span>C — Config</span>
            <span style={{ marginLeft: "auto", fontWeight: 400, textTransform: "none" }}>{configErr ? <span style={{ color: "var(--sd-danger, #dc2626)" }}>{configErr}</span> : "editable"}</span>
          </div>
          <textarea
            value={configText}
            onChange={e => applyConfigText(e.target.value)}
            spellCheck={false}
            style={{ ...cardBody, border: "none", outline: "none", resize: "none", background: "var(--sd-surface-base, #fff)", color: "var(--sd-text, #1a1a1a)", width: "100%" }}
          />
        </div>

        {/* R — Render */}
        <div style={cardStyle}>
          <div style={cardHead}>
            <span>R — Render</span>
            <span style={{ marginLeft: "auto", fontWeight: 400, textTransform: "none" }}>{treeCount(run?.actual ?? null)} nodes — {run?.renderMs ?? 0}ms</span>
          </div>
          <div style={cardBody}>{treeLines(run?.actual ?? null).join("\n") || "no output"}</div>
        </div>

        {/* A — Assert */}
        <div style={cardStyle}>
          <div style={cardHead}>
            <span>A — Assert</span>
            <span style={{ marginLeft: "auto", fontWeight: 400, textTransform: "none" }}>{treeCount(run?.expected ?? null)} nodes expected</span>
          </div>
          <div style={cardBody}>{treeLines(run?.expected ?? null).join("\n") || "no expectation"}</div>
        </div>

        {/* V — Verify */}
        <div style={cardStyle}>
          <div style={cardHead}>
            <span>V — Verify</span>
            <span style={{ marginLeft: "auto", fontWeight: 700, textTransform: "none", color: verdictColor }}>{run?.verdict ?? "—"}</span>
          </div>
          <div style={cardBody}>
            {run?.error && <div style={{ color: "var(--sd-danger, #dc2626)" }}>{run.error}</div>}
            {run && !run.error && run.mismatches.length === 0 && (
              <div style={{ color: "var(--sd-success, #15803d)" }}>diffRenderedTrees: 0 mismatches{"\n"}expected ≡ actual</div>
            )}
            {run?.mismatches.map((m, i) => (
              <div key={i} style={{ color: "var(--sd-danger, #dc2626)", marginBottom: 4 }}>
                {m.path}{"\n"}  expected: {String(m.expected)}{"\n"}  actual:   {String(m.actual)}
              </div>
            ))}
          </div>
        </div>

        {/* E — Execute */}
        <div style={cardStyle}>
          <div style={cardHead}>
            <span>E — Execute</span>
            <span style={{ marginLeft: "auto", fontWeight: 400, textTransform: "none" }}>{events.length} events</span>
          </div>
          <div ref={el => { if (el) el.scrollTop = el.scrollHeight; }} style={cardBody}>
            {events.length === 0 && <span style={{ color: "var(--sd-text-muted, #9ca3af)" }}>interact with the component above…</span>}
            {events.map((ev, i) => (
              <div key={i} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                <span style={{ color: "var(--sd-text-muted, #9ca3af)" }}>{fmtEst(ev.ts)} </span>
                <span style={{ color: "var(--sd-accent, #2563eb)" }}>{ev.origin}</span>
                <span> {ev.name}</span>
                {ev.detail && <span style={{ color: "var(--sd-text-muted, #6b7280)" }}> {ev.detail}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
