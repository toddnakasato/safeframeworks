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
import type { SafeEvent, ConfigBase } from "safecontracts";

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
    if (this.state.error) return <div style={{ color: "#dc2626", fontSize: 11, padding: 8, fontFamily: "monospace" }}>Error: {this.state.error}</div>;
    return this.props.children;
  }
}

const STYLES = ["vanilla", "tailwind", "tailwind-daisy", "material"] as const;
const COMPONENT_NAMES = Object.keys(SAMPLES).sort();

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
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [activeVariation, setActiveVariation] = useState<string | null>(null);
  const [paintState, setPaintState] = useState<Record<string, any>>({});

  useEffect(() => {
    loadStyle(activeStyle, activeTheme);
  }, [activeStyle, activeTheme]);

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
      await invoke<string>("safecli_run", { name: "safedesk", args });
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

  const selectComponent = (name: string | null) => {
    setActiveComponent(name);
    setActiveVariation(null);
  };
  const selectVariation = (comp: string, variation: string) => {
    setActiveComponent(comp);
    setActiveVariation(variation);
  };

  /** [component, variation] pairs to render, per current selection. */
  const toShow: [string, string][] = [];
  for (const comp of activeComponent ? [activeComponent] : COMPONENT_NAMES) {
    const variations = Object.keys(SAMPLES[comp] ?? {}).sort();
    for (const v of activeVariation ? [activeVariation] : variations) {
      if (SAMPLES[comp]?.[v]) toShow.push([comp, v]);
    }
  }

  const itemStyle = (active: boolean, indent = 0): React.CSSProperties => ({
    display: "block", width: "100%", textAlign: "left", padding: "4px 8px",
    paddingLeft: 8 + indent * 14,
    fontSize: 13, border: "none", borderRadius: 4, cursor: "pointer",
    background: active ? "#3b82f6" : "transparent",
    color: active ? "#fff" : "#1a1a1a",
    marginBottom: 2,
  });

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui, sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: 220, borderRight: "1px solid var(--sd-border, #e5e7eb)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Brand */}
        <div style={{ padding: 12, borderBottom: "1px solid var(--sd-border, #e5e7eb)", display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/shield.png" alt="SafeDesk" style={{ width: 18, height: 21 }} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>react/19</span>
        </div>
        {/* Style switcher */}
        <div style={{ padding: 12, borderBottom: "1px solid var(--sd-border, #e5e7eb)" }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: 8 }}>Style</div>
          {STYLES.map(s => (
            <div key={s}>
              <button onClick={() => selectStyle(s)} style={itemStyle(s === activeStyle)}>
                {s}
              </button>
              {s === activeStyle && (THEMES[s] ?? []).map(t => (
                <button key={t} onClick={() => setActiveTheme(t)} style={itemStyle(t === activeTheme, 1)}>
                  {t}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Component menu with variation sub-items */}
        <div style={{ flex: 1, overflow: "auto", padding: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: 8, padding: "0 4px" }}>Components</div>
          <button onClick={() => selectComponent(null)} style={itemStyle(activeComponent === null)}>
            All
          </button>
          {COMPONENT_NAMES.map(name => (
            <div key={name}>
              <button onClick={() => selectComponent(name)} style={itemStyle(name === activeComponent && !activeVariation)}>
                {name}
              </button>
              {name === activeComponent && Object.keys(SAMPLES[name]).sort().map(v => (
                <button key={v} onClick={() => selectVariation(name, v)} style={itemStyle(v === activeVariation, 1)}>
                  {v}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#1a1a1a" }}>
          react/19 — {activeStyle}{activeTheme !== "default" ? `/${activeTheme}` : ""}
          {activeComponent && <span style={{ fontWeight: 400, color: "#6b7280" }}> — {activeVariation ?? activeComponent}</span>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {toShow.map(([comp, v]) => (
            <div key={v} style={{ border: "1px solid var(--sd-border, #e5e7eb)", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", borderBottom: "1px solid var(--sd-border, #e5e7eb)", background: "#fafafa" }}>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
