/**
 * Viewer App — renders all components/variations with style switching.
 * Select a safestyle (vanilla, tailwind, tailwind-daisy, material) to see
 * the same components styled differently. Sidebar: component menu with
 * variation sub-items, generated from SAMPLES.
 */
import { useState, useEffect } from "react";
import { renderConfigBase } from "../../SafeRenderer";
import { SAMPLES } from "../../../../samples";
import type { SafeEvent } from "safecontracts";

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
  document.getElementById("safestyle-theme")?.remove();
  const link = document.createElement("link");
  link.id = "safestyle-link";
  link.rel = "stylesheet";
  link.href = `/styles/${name}/components.css`;
  document.head.appendChild(link);
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
  const [events, setEvents] = useState<SafeEvent[]>([]);

  useEffect(() => {
    loadStyle(activeStyle, activeTheme);
  }, [activeStyle, activeTheme]);

  const selectStyle = (s: string) => {
    setActiveStyle(s);
    setActiveTheme("default");
  };

  const handleEvent = (event: SafeEvent) => {
    setEvents(prev => [event, ...prev].slice(0, 20));
  };

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
                {renderConfigBase(SAMPLES[comp][v], handleEvent)}
              </div>
              <div style={{ borderTop: "1px solid var(--sd-border, #e5e7eb)" }}>
                {renderConfigBase({ component: "proof-viewer", metadata: { target: comp } } as any, handleEvent)}
              </div>
            </div>
          ))}
        </div>

        {/* Event log */}
        {events.length > 0 && (
          <div style={{ marginTop: 24, borderTop: "1px solid var(--sd-border, #e5e7eb)", paddingTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: 8 }}>Events</div>
            {events.map((e, i) => (
              <div key={i} style={{ fontSize: 11, color: "#6b7280", fontFamily: "monospace", padding: "2px 0" }}>
                {e.origin.id}.{e.name} {e.data ? JSON.stringify(e.data) : ""}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
