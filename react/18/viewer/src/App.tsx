/**
 * Viewer App — renders all components/variations with style switching.
 * Select a safestyle (vanilla, tailwind, tailwind-daisy, material) to see
 * the same components styled differently. Sidebar: component menu with
 * variation sub-items, generated from SAMPLES.
 */
import { useState, useEffect, useCallback, Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { renderConfigBase } from "../../SafeRenderer";
import { SAMPLES } from "../../../../samples";
import type { SafeEvent, ConfigBase, Ticket, TicketType } from "safecontracts";
import { listAllTickets, createTicket, updateTicket } from "./ticket-service";

/** Tauri invoke — safe no-op when not in Tauri context */
async function invoke<T>(cmd: string, args?: Record<string, any>): Promise<T> {
  const { invoke: tauriInvoke } = await import("@tauri-apps/api/core");
  return tauriInvoke<T>(cmd, args);
}

/** Listen for Tauri events */
async function listen(event: string, handler: (payload: any) => void): Promise<() => void> {
  const { listen: tauriListen } = await import("@tauri-apps/api/event");
  const unlisten = await tauriListen(event, (e) => handler(e.payload));
  return unlisten;
}

const STATE_DIR = "runtime";
const STATE_FILE = "runtime/state.json";

/** Error boundary — catches render errors so one bad component doesn't kill the viewer. */
class ComponentBoundary extends Component<{ label: string; children: ReactNode }, { error: string | null }> {
  state = { error: null as string | null };
  static getDerivedStateFromError(err: Error) { return { error: err.message }; }
  componentDidCatch(err: Error, info: ErrorInfo) { console.error(`[${this.props.label}]`, err, info); }
  render() {
    if (this.state.error) return <div style={{ color: "var(--sd-danger, #dc2626)", fontSize: 11, padding: 8, fontFamily: "monospace" }}>Error: {this.state.error}</div>;
    return this.props.children;
  }
}

const STYLES = ["vanilla", "tailwind", "tailwind-daisy", "material"] as const;
const COMPONENT_NAMES = Object.keys(SAMPLES).sort();
const DEFAULT_COMPONENT = COMPONENT_NAMES.includes("briefing") ? "briefing" : COMPONENT_NAMES[0];
const DEFAULT_VARIATION = Object.keys(SAMPLES[DEFAULT_COMPONENT] ?? {}).sort()[0] ?? null;

// Themes per implementation — discovered from safestyles at build time
// (public/styles symlinks to safestyles/implementations).
const THEME_FILES = import.meta.glob("../public/styles/*/themes/*.css", { query: "?url" });
const THEMES: Record<string, string[]> = {};
for (const path of Object.keys(THEME_FILES)) {
  const m = path.match(/styles\/([^/]+)\/themes\/([^/]+)\.css$/);
  if (!m) continue;
  (THEMES[m[1]] ??= []).push(m[2]);
}
for (const k of Object.keys(THEMES)) THEMES[k].sort((a, b) => a === "default" ? -1 : b === "default" ? 1 : a.localeCompare(b));

/** Load a safestyles implementation + theme dynamically. */
function loadStyle(name: string, theme: string) {
  document.getElementById("safestyle-link")?.remove();
  document.getElementById("safestyle-paint")?.remove();
  document.getElementById("safestyle-theme")?.remove();
  const link = document.createElement("link");
  link.id = "safestyle-link";
  link.rel = "stylesheet";
  link.href = `/styles/${name}/components.css`;
  document.head.appendChild(link);
  const paintLink = document.createElement("link");
  paintLink.id = "safestyle-paint";
  paintLink.rel = "stylesheet";
  paintLink.href = `/styles/${name}/paint.css`;
  document.head.appendChild(paintLink);
  const themeLink = document.createElement("link");
  themeLink.id = "safestyle-theme";
  themeLink.rel = "stylesheet";
  themeLink.href = `/styles/${name}/themes/${theme}.css`;
  document.head.appendChild(themeLink);
}

export default function App() {
  const [activeStyle, setActiveStyle] = useState<string>("vanilla");
  const [activeTheme, setActiveTheme] = useState<string>("default");
  const [activeComponent, setActiveComponent] = useState<string | null>(DEFAULT_COMPONENT);
  const [activeVariation, setActiveVariation] = useState<string | null>(DEFAULT_VARIATION);
  const [paintState, setPaintState] = useState<Record<string, any>>({});
  const [activeProof, setActiveProof] = useState<string | null>(null);
  const [proofResults, setProofResults] = useState<Record<string, { passed: number; total: number; failed: number; checks?: any[]; failures?: any[] }>>({});
  const [proofRunning, setProofRunning] = useState(false);
  const [proofView, setProofView] = useState(false);
  const [proofToast, setProofToast] = useState<{ message: string; color: string } | null>(null);
  const [runningCommands, setRunningCommands] = useState<Set<string>>(new Set());
  const [proofProgress, setProofProgress] = useState<{ done: number; total: number } | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketView, setTicketView] = useState<"open" | "closed" | null>(null);
  const [ticketForm, setTicketForm] = useState<{ component: string } | null>(null);

  useEffect(() => {
    loadStyle(activeStyle, activeTheme);
  }, [activeStyle, activeTheme]);

  // Load tickets on mount
  const refreshTickets = useCallback(() => { listAllTickets().then(t => { console.log("[tickets] loaded", t.length); setTickets(t); }).catch(e => console.error("[tickets] load failed", e)); }, []);
  useEffect(() => { refreshTickets(); }, []);

  // EPRPP: start file watcher + listen for changes
  useEffect(() => {
    // Ensure runtime dir and state file exist
    invoke("write_state", { path: STATE_FILE, content: JSON.stringify(paintState) }).catch(() => {});
    // Start watching
    invoke("watch_dir", { path: STATE_DIR }).catch(() => {});
    // Listen for file changes → re-read state → re-render
    let unlisten: (() => void) | null = null;
    listen("fs-change", async (_path: string) => {
      try {
        const raw = await invoke<string>("read_file_content", { path: STATE_FILE });
        const newState = JSON.parse(raw);
        setPaintState(newState);
      } catch {}
    }).then(fn => { unlisten = fn; });
    return () => { if (unlisten) unlisten(); };
  }, []);

  const selectStyle = (s: string) => {
    setActiveStyle(s);
    setActiveTheme("default");
  };

  const PROOF_DOMAINS: { label: string; commands: string[] }[] = [
    { label: "builder", commands: ["builder-dumb", "builder-reconcile", "builder-structure"] },
    { label: "event", commands: ["event-coverage", "event-declared", "event-payload"] },
    { label: "framework", commands: ["framework-boot", "framework-delegation"] },
    { label: "paint", commands: ["paint-chain", "paint-contrast", "paint-cssonly", "paint-definition", "paint-parity", "paint-unopinionated"] },
    { label: "ticket", commands: ["ticket"] },
  ];
  const ALL_PROVE_COMMANDS = PROOF_DOMAINS.flatMap(d => d.commands);

  const runProofs = async (commands: string[]) => {
    setProofRunning(true);
    setProofProgress({ done: 0, total: commands.length });
    // Clear previous results for these commands immediately
    setProofResults(prev => {
      const next = { ...prev };
      commands.forEach(c => delete next[c]);
      return next;
    });
    setRunningCommands(new Set(commands));
    let doneCount = 0;
    try {
      const results = await Promise.all(
        commands.map(async cmd => {
          try {
            const { invoke: tauriInvoke } = await import("@tauri-apps/api/core");
            const out = await tauriInvoke<string>("safecli_run", { name: "safezero", args: ["prove", cmd] });
            const parsed = JSON.parse(out);
            const entry = { passed: parsed.passed ?? 0, total: parsed.total ?? 0, failed: parsed.failed ?? 0, checks: parsed.checks, failures: parsed.failures };
            setProofResults(prev => ({ ...prev, [cmd]: entry }));
            setRunningCommands(prev => { const next = new Set(prev); next.delete(cmd); return next; });
            doneCount++;
            setProofProgress({ done: doneCount, total: commands.length });
            return [cmd, entry] as [string, any];
          } catch {
            const entry = { passed: 0, total: 1, failed: 1 };
            setProofResults(prev => ({ ...prev, [cmd]: entry }));
            setRunningCommands(prev => { const next = new Set(prev); next.delete(cmd); return next; });
            doneCount++;
            setProofProgress({ done: doneCount, total: commands.length });
            return [cmd, entry] as [string, any];
          }
        })
      );
      // Toast summary
      const totalP = results.reduce((s, [,v]) => s + (v.passed ?? 0), 0);
      const totalT = results.reduce((s, [,v]) => s + (v.total ?? 0), 0);
      const totalF = results.reduce((s, [,v]) => s + (v.failed ?? 0), 0);
      const pass = totalF === 0;
      setProofToast({ message: `${totalP}/${totalT} checks ${pass ? "passed PASS" : `— ${totalF} failed FAIL`}`, color: pass ? "var(--sd-success, #15803d)" : "var(--sd-danger, #dc2626)" });
      setTimeout(() => setProofToast(null), 4000);
    } finally {
      setProofRunning(false);
      setRunningCommands(new Set());
      setProofProgress(null);
    }
  };

  // EPRPP: event → safedesk paint apply → writes state.json → watcher fires → re-render
  // cssOnly events (hover, leave) are painted by CSS :hover — no file cycle needed
  const handleEvent = useCallback(async (event: SafeEvent) => {
    console.log("[event]", event.origin?.id, event.name, event.data);
    // Push to proof-viewer Events tabs
    document.querySelectorAll("[data-component='proof-viewer']").forEach((pv) => {
      if ((pv as any).pushEvent) (pv as any).pushEvent(event);
    });
    // Skip file cycle for transient CSS-only events
    const cssOnlyEvents = new Set(["row:hover", "row:leave", "hover"]);
    if (cssOnlyEvents.has(event.name)) return;
    // Call safedesk paint apply — writes state.json
    const component = event.component ?? "";
    try {
      const args = ["paint", "apply", "--component", component, "--event", event.name, "--state", STATE_FILE];
      if (event.data?.index !== undefined) args.push("--index", String(event.data.index));
      if (event.data?.field) args.push("--field", String(event.data.field));
      if (event.data?.dir) args.push("--dir", String(event.data.dir));
      if (event.data?.page !== undefined) args.push("--page", String(event.data.page));
      if (event.data?.selected) args.push("--selected", String(event.data.selected));
      if (event.data?.value !== undefined) args.push("--value", String(event.data.value));
      if (event.data?.year !== undefined) args.push("--year", String(event.data.year));
      if (event.data?.month !== undefined) args.push("--month", String(event.data.month));
      if (event.data?.day !== undefined) args.push("--day", String(event.data.day));
      if (event.data?.date) args.push("--date", String(event.data.date));
      await invoke<string>("safecli_run", { name: "safezero", args });
    } catch (e) {
      console.warn("[paint]", e);
    }
  }, []);

  /** Merge paint state into a ConfigBase's metadata */
  function paintConfig(config: ConfigBase): ConfigBase {
    if (!paintState || Object.keys(paintState).length === 0) return config;
    return {
      ...config,
      metadata: { ...config.metadata, ...paintState },
    };
  }

  const selectComponent = (name: string) => {
    const firstVar = Object.keys(SAMPLES[name] ?? {}).sort()[0] ?? null;
    setActiveComponent(name);
    setActiveVariation(firstVar);
    setProofView(false);
    setActiveProof("__none__");
    setTicketView(null);
  };
  const selectVariation = (comp: string, variation: string) => {
    setActiveComponent(comp);
    setActiveVariation(variation);
    setProofView(false);
    setActiveProof("__none__");
    setTicketView(null);
  };

  /** Always show exactly one [component, variation] pair. */
  const toShow: [string, string][] = [];
  if (activeComponent && activeVariation && SAMPLES[activeComponent]?.[activeVariation]) {
    toShow.push([activeComponent, activeVariation]);
  } else if (activeComponent) {
    const firstVar = Object.keys(SAMPLES[activeComponent] ?? {}).sort()[0];
    if (firstVar) toShow.push([activeComponent, firstVar]);
  }

  const itemStyle = (active: boolean, indent = 0): React.CSSProperties => ({
    display: "block", width: "100%", textAlign: "left", padding: "4px 8px",
    paddingLeft: 8 + indent * 14,
    fontSize: 13, border: "none", borderRadius: 4, cursor: "pointer",
    background: active ? "var(--sd-accent, #3b82f6)" : "transparent",
    color: active ? "var(--sd-text-inverse, #fff)" : "var(--sd-text, #1a1a1a)",
    marginBottom: 2,
  });

  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--sd-text-muted, #6b7280)", display: "block", marginBottom: 4 };
  const dropdownStyle: React.CSSProperties = { width: "100%", padding: "4px 8px", fontSize: 13, borderRadius: 4, border: "1px solid var(--sd-border, #d1d5db)", background: "var(--sd-surface-base, #fff)", color: "var(--sd-text, #1a1a1a)" };
  const sectionLabel: React.CSSProperties = { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--sd-text-muted, #6b7280)", marginBottom: 8, padding: "0 4px" };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui, sans-serif", background: "var(--sd-surface-base, #fff)", color: "var(--sd-text, #1a1a1a)" }}>
      {/* Sidebar */}
      <div style={{ width: 220, borderRight: "1px solid var(--sd-border, #e5e7eb)", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--sd-surface-raised, #f9fafb)" }}>
        {/* Brand */}
        <div style={{ padding: 12, borderBottom: "1px solid var(--sd-border, #e5e7eb)", display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/shield.png" alt="SafeDesk" style={{ width: 18, height: 21 }} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>react/19</span>
        </div>
        {/* Style switcher — two picklists */}
        <div style={{ padding: 12, borderBottom: "1px solid var(--sd-border, #e5e7eb)", display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <label style={labelStyle}>Framework</label>
            <select value={activeStyle} onChange={e => selectStyle(e.target.value)} style={dropdownStyle}>
              {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Theme</label>
            <select value={activeTheme} onChange={e => setActiveTheme(e.target.value)} style={dropdownStyle}>
              {(THEMES[activeStyle] ?? ["default"]).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Proofs */}
        <div style={{ padding: 8, borderBottom: "1px solid var(--sd-border, #e5e7eb)" }}>
          <div style={sectionLabel}>Proofs</div>
          <button onClick={() => { setActiveProof(null); setProofView(true); setTicketView(null); }} style={itemStyle(activeProof === null && proofView)}>
            All
          </button>
          {PROOF_DOMAINS.map(d => (
            <button key={d.label} onClick={() => { setActiveProof(d.label); setProofView(true); setTicketView(null); }} style={itemStyle(activeProof === d.label && proofView)}>
              {d.label}
            </button>
          ))}
        </div>

        {/* Component menu with variation sub-items */}
        <div style={{ flex: 1, overflow: "auto", padding: 8 }}>
          {/* Tickets */}
          <div style={{ ...sectionLabel, marginTop: 4 }}>Tickets</div>
          {(() => {
            const open = tickets.filter(t => t.status === "open" || t.status === "in-progress");
            const closed = tickets.filter(t => t.status === "closed" || t.status === "proved");
            return (<>
              <button onClick={() => { setTicketView("open"); setProofView(false); setActiveProof("__none__"); }} style={itemStyle(ticketView === "open" && !proofView)}>
                Open {open.length > 0 && `(${open.length})`}
              </button>
              <button onClick={() => { setTicketView("closed"); setProofView(false); setActiveProof("__none__"); }} style={itemStyle(ticketView === "closed" && !proofView)}>
                Closed {closed.length > 0 && `(${closed.length})`}
              </button>
            </>);
          })()}

          <div style={{ ...sectionLabel, marginTop: 12 }}>Components</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div>
              <label style={labelStyle}>Component</label>
              <select
                value={activeComponent ?? ""}
                onChange={e => selectComponent(e.target.value)}
                style={dropdownStyle}
              >
                {COMPONENT_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Variation</label>
              <select
                value={activeVariation ?? ""}
                onChange={e => selectVariation(activeComponent!, e.target.value)}
                style={dropdownStyle}
                disabled={!activeComponent}
              >
                {activeComponent && Object.keys(SAMPLES[activeComponent] ?? {}).sort().map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, overflow: "auto", padding: 24, background: "var(--sd-surface-base, #fff)" }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "var(--sd-text, #1a1a1a)" }}>
          react/19 — {activeStyle}{activeTheme !== "default" ? `/${activeTheme}` : ""}
          {proofView && <span style={{ fontWeight: 400, color: "var(--sd-text-muted, #6b7280)" }}> — proofs{activeProof && activeProof !== "__none__" ? ` / ${activeProof}` : ""}</span>}
          {ticketView && <span style={{ fontWeight: 400, color: "var(--sd-text-muted, #6b7280)" }}> — tickets / {ticketView}</span>}
          {!proofView && !ticketView && activeComponent && <span style={{ fontWeight: 400, color: "var(--sd-text-muted, #6b7280)" }}> — {activeVariation ?? activeComponent}</span>}
        </div>

        {ticketView ? (
          /* Ticket view */
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(() => {
              const filtered = ticketView === "open"
                ? tickets.filter(t => t.status === "open" || t.status === "in-progress")
                : tickets.filter(t => t.status === "closed" || t.status === "proved").sort((a, b) => b.updated.localeCompare(a.updated));
              if (filtered.length === 0) return <div style={{ color: "var(--sd-text-muted, #6b7280)", fontSize: 13 }}>No {ticketView} tickets.</div>;
              return filtered.map(t => (
                <div key={t.id} style={{ border: "1px solid var(--sd-border, #e5e7eb)", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--sd-surface-raised, #fafafa)" }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--sd-accent, #2563eb)", marginRight: 8 }}>{t.id}</span>
                      <span style={{ fontSize: 11, padding: "1px 6px", borderRadius: 3, background: "var(--sd-surface-sunken, #f1f5f9)", color: "var(--sd-text-dim, #475569)" }}>{t.type}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: t.status === "open" ? "var(--sd-accent, #2563eb)" : t.status === "closed" ? "var(--sd-success, #15803d)" : "var(--sd-text-muted, #475569)" }}>{t.status}</span>
                  </div>
                  <div style={{ padding: "8px 12px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{t.title}</div>
                    <div style={{ fontSize: 11, color: "var(--sd-text-dim, #475569)", lineHeight: 1.5 }}>{t.description}</div>
                  </div>
                  <div style={{ padding: "6px 12px", borderTop: "1px solid var(--sd-border, #e5e7eb)", fontSize: 10, color: "var(--sd-text-muted, #475569)", display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <span>proves: {t.proves.join(", ")}</span>
                    {t.params && <span>scope: {Object.entries(t.params).map(([k,v]) => `${k}=${v}`).join(" ")}</span>}
                    {t.event && !t.params?.event && <span>event: {t.event}</span>}
                    {t.resolution && <span>resolution: {t.resolution}</span>}
                  </div>
                  {/* Ticket actions — Prove button for all, Start/Close for open */}
                  <div style={{ padding: "6px 12px", borderTop: "1px solid var(--sd-border, #e5e7eb)", display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={async () => {
                      const btn = document.getElementById(`prove-${t.id}`) as HTMLButtonElement;
                      const result = document.getElementById(`prove-result-${t.id}`)!;
                      btn.textContent = "⟳ Proving..."; btn.disabled = true;
                      result.textContent = "";
                      try {
                        if (t.test) {
                          // Run the ticket's concrete test
                          const { invoke: tauriInvoke } = await import("@tauri-apps/api/core");
                          // Parse command respecting quoted strings
                          const parseCmd = (cmd: string): string[] => {
                            const args: string[] = [];
                            let current = "";
                            let inQuote = false;
                            let quoteChar = "";
                            for (const ch of cmd) {
                              if (!inQuote && (ch === '"' || ch === "'")) { inQuote = true; quoteChar = ch; continue; }
                              if (inQuote && ch === quoteChar) { inQuote = false; continue; }
                              if (!inQuote && ch === " ") { if (current) args.push(current); current = ""; continue; }
                              current += ch;
                            }
                            if (current) args.push(current);
                            return args;
                          };
                          const out = await tauriInvoke<string>("safecli_run", { name: "safezero", args: parseCmd(t.test.command) });
                          const output = JSON.parse(out);
                          const failures: string[] = [];
                          for (const [path, expected] of Object.entries(t.test.assert)) {
                            const actual = path.split(".").reduce((o: any, k) => o?.[k], output);
                            if (actual !== expected) failures.push(`${path}: ${JSON.stringify(actual)} ≠ ${JSON.stringify(expected)}`);
                          }
                          const pass = failures.length === 0;
                          const total = Object.keys(t.test.assert).length;
                          result.textContent = pass ? `${total}/${total} PASS` : `${total - failures.length}/${total} FAIL ${failures[0]}`;
                          result.style.color = pass ? "var(--sd-success, #15803d)" : "var(--sd-danger, #dc2626)";
                        } else {
                          result.textContent = "no test defined";
                          result.style.color = "var(--sd-text-muted, #475569)";
                        }
                        btn.textContent = "Prove"; btn.disabled = false;
                      } catch (e: any) {
                        result.textContent = `error: ${e.message?.slice(0, 60) ?? e}`;
                        result.style.color = "var(--sd-danger, #dc2626)";
                        btn.textContent = "Prove"; btn.disabled = false;
                      }
                    }} id={`prove-${t.id}`}
                      style={{ padding: "2px 8px", fontSize: 10, fontWeight: 600, borderRadius: 3, border: "none", background: "var(--sd-accent, #2563eb)", color: "var(--sd-text-inverse, #fff)", cursor: "pointer" }}>
                      Prove
                    </button>
                    <span id={`prove-result-${t.id}`} style={{ fontSize: 10, fontWeight: 600 }}></span>
                    {t.status === "open" && (<>
                      <button onClick={async () => { await updateTicket({ ...t, status: "in-progress" }); refreshTickets(); }}
                        style={{ padding: "2px 8px", fontSize: 10, borderRadius: 3, border: "1px solid var(--sd-border, #d1d5db)", background: "var(--sd-surface-base, #fff)", color: "var(--sd-text, #0f172a)", cursor: "pointer" }}>
                        Start
                      </button>
                      <button onClick={async () => { await updateTicket({ ...t, status: "closed", resolution: "Closed without resolution" }); refreshTickets(); }}
                        style={{ padding: "2px 8px", fontSize: 10, borderRadius: 3, border: "1px solid var(--sd-border, #d1d5db)", background: "var(--sd-surface-base, #fff)", color: "var(--sd-text, #0f172a)", cursor: "pointer" }}>
                        Close
                      </button>
                    </>)}
                  </div>
                </div>
              ));
            })()}
          </div>
        ) : proofView ? (
          /* Proof results view */
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Run button + progress */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => runProofs(activeProof ? PROOF_DOMAINS.find(d => d.label === activeProof)?.commands ?? [] : ALL_PROVE_COMMANDS)} disabled={proofRunning}
                style={{ padding: "6px 16px", fontSize: 13, fontWeight: 600, borderRadius: 4, border: "none", cursor: proofRunning ? "wait" : "pointer", background: proofRunning ? "var(--sd-text-muted, #6b7280)" : "var(--sd-accent, #2563eb)", color: "var(--sd-text-inverse, #fff)", transition: "background 0.2s" }}>
                {proofRunning ? "⟳" : "▶"}{" "}
                {proofRunning ? `Running${proofProgress ? ` ${proofProgress.done}/${proofProgress.total}` : "..."}` : activeProof ? `Run ${activeProof}` : "Run All"}
              </button>
              {(() => {
                const cmds = activeProof ? PROOF_DOMAINS.find(d => d.label === activeProof)?.commands ?? [] : ALL_PROVE_COMMANDS;
                const t = cmds.reduce((s, c) => s + (proofResults[c]?.total ?? 0), 0);
                const p = cmds.reduce((s, c) => s + (proofResults[c]?.passed ?? 0), 0);
                const f = cmds.reduce((s, c) => s + (proofResults[c]?.failed ?? 0), 0);
                if (t === 0) return null;
                return <span style={{ fontSize: 13, fontWeight: 600, color: f === 0 ? "var(--sd-success, #15803d)" : "var(--sd-danger, #dc2626)" }}>{p}/{t} {f === 0 ? "PASS" : `(${f} failed)`}</span>;
              })()}
            </div>

            {(activeProof ? PROOF_DOMAINS.filter(d => d.label === activeProof) : PROOF_DOMAINS).map(domain => (
              <div key={domain.label}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--sd-text-muted, #6b7280)" }}>{domain.label}</span>
                  {!activeProof && (
                    <button onClick={() => runProofs(domain.commands)} disabled={proofRunning}
                      style={{ padding: "2px 8px", fontSize: 10, fontWeight: 600, borderRadius: 3, border: "1px solid var(--sd-border, #d1d5db)", cursor: proofRunning ? "wait" : "pointer", background: "var(--sd-surface-base, #fff)", color: "var(--sd-text, #0f172a)" }}>
                      Run
                    </button>
                  )}
                  {(() => {
                    const t = domain.commands.reduce((s, c) => s + (proofResults[c]?.total ?? 0), 0);
                    const p = domain.commands.reduce((s, c) => s + (proofResults[c]?.passed ?? 0), 0);
                    if (t === 0) return null;
                    return <span style={{ fontSize: 11, fontWeight: 600, color: p === t ? "var(--sd-success, #15803d)" : "var(--sd-danger, #dc2626)" }}>{p}/{t}</span>;
                  })()}
                </div>
                {domain.commands.map(cmd => {
                  const r = proofResults[cmd];
                  const isRunning = runningCommands.has(cmd);
                  const pass = r && r.failed === 0;
                  const hasResults = r && r.total > 0;
                  return (
                    <div key={cmd} style={{ border: "1px solid var(--sd-border, #e5e7eb)", borderRadius: 6, marginBottom: 8, overflow: "hidden", opacity: isRunning ? 0.6 : 1, transition: "opacity 0.2s" }}>
                      <div style={{ padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--sd-surface-raised, #fafafa)" }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{cmd}</span>
                        {isRunning && <span style={{ fontSize: 11, color: "var(--sd-text-muted, #6b7280)", display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span> running</span>}
                        {!isRunning && hasResults && (
                          <span style={{ fontSize: 12, fontWeight: 600, color: pass ? "var(--sd-success, #15803d)" : "var(--sd-danger, #dc2626)" }}>
                            {r.passed}/{r.total} {pass ? "PASS" : "FAIL"}
                          </span>
                        )}
                      </div>
                      {hasResults && r.failures && r.failures.length > 0 && (
                        <div style={{ padding: "8px 12px", borderTop: "1px solid var(--sd-border, #e5e7eb)" }}>
                          {r.failures.map((f: any, i: number) => (
                            <div key={i} style={{ fontSize: 11, color: "var(--sd-danger, #dc2626)", padding: "2px 0", fontFamily: "monospace" }}>
                              {f.error?.slice(0, 120)}
                            </div>
                          ))}
                        </div>
                      )}
                      {hasResults && r.checks && (
                        <div style={{ padding: "8px 12px", borderTop: "1px solid var(--sd-border, #e5e7eb)", fontSize: 11, color: "var(--sd-text-dim, #475569)" }}>
                          {[...new Set((r.checks as any[]).map((c: any) => c.group))].map(group => {
                            const groupChecks = (r.checks as any[]).filter((c: any) => c.group === group);
                            const groupPass = groupChecks.filter((c: any) => c.status === "pass").length;
                            return (
                              <div key={group} style={{ display: "flex", justifyContent: "space-between", padding: "1px 0" }}>
                                <span>{group}</span>
                                <span style={{ color: groupPass === groupChecks.length ? "var(--sd-success, #15803d)" : "var(--sd-danger, #dc2626)", fontWeight: 600 }}>
                                  {groupPass}/{groupChecks.length}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          /* Component view */
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {toShow.map(([comp, v]) => (
              <div key={v} style={{ border: "1px solid var(--sd-border, #e5e7eb)", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--sd-text-muted, #6b7280)", borderBottom: "1px solid var(--sd-border, #e5e7eb)", background: "var(--sd-surface-raised, #fafafa)" }}>
                  {v}
                </div>
                <div style={{ padding: 16 }}>
                  <ComponentBoundary label={`${comp}/${v}`}>
                    {renderConfigBase(paintConfig(SAMPLES[comp][v]), handleEvent)}
                  </ComponentBoundary>
                </div>
                <div style={{ borderTop: "1px solid var(--sd-border, #e5e7eb)" }}>
                  <ComponentBoundary label={`proof-viewer/${comp}`}>
                    {renderConfigBase({ component: "proof-viewer", metadata: { target: comp } } as any, handleEvent)}
                  </ComponentBoundary>
                </div>
                {/* Ticket creation */}
                <div style={{ padding: "8px 12px", borderTop: "1px solid var(--sd-border, #e5e7eb)", display: "flex", gap: 6, alignItems: "center" }}>
                  <select id={`ticket-type-${comp}`} defaultValue="bug" style={{ padding: "3px 6px", fontSize: 10, borderRadius: 3, border: "1px solid var(--sd-border, #d1d5db)", background: "var(--sd-surface-base, #fff)", color: "var(--sd-text, #0f172a)" }}>
                    <option value="bug">bug</option><option value="event">event</option><option value="paint">paint</option>
                    <option value="style">style</option><option value="data">data</option><option value="structure">structure</option>
                    <option value="variation">variation</option><option value="new-component">new-component</option>
                  </select>
                  <input id={`ticket-title-${comp}`} placeholder="Describe the issue..." style={{ flex: 1, padding: "3px 6px", fontSize: 11, borderRadius: 3, border: "1px solid var(--sd-border, #d1d5db)", background: "var(--sd-surface-base, #fff)", color: "var(--sd-text, #0f172a)" }} />
                  <button onClick={async () => {
                    const titleEl = document.getElementById(`ticket-title-${comp}`) as HTMLInputElement;
                    const typeEl = document.getElementById(`ticket-type-${comp}`) as HTMLSelectElement;
                    if (!titleEl?.value.trim()) return;
                    await createTicket(comp, typeEl.value as TicketType, titleEl.value.trim(), titleEl.value.trim());
                    titleEl.value = "";
                    refreshTickets();
                  }} style={{ padding: "3px 8px", fontSize: 10, fontWeight: 600, borderRadius: 3, border: "none", background: "var(--sd-accent, #2563eb)", color: "var(--sd-text-inverse, #fff)", cursor: "pointer" }}>
                    + Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Toast */}
      {proofToast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, padding: "10px 20px", borderRadius: 6, background: "var(--sd-surface-deep, #1e293b)", color: proofToast.color, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.25)", zIndex: 9999, transition: "opacity 0.3s" }}>
          {proofToast.message}
        </div>
      )}
    </div>
  );
}
