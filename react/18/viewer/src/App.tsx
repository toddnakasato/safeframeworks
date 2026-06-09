/**
 * Viewer App — renders all 26 components with style switching.
 * Select a safestyle (vanilla, tailwind, tailwind-daisy, material) to see
 * the same components styled differently.
 */
import { useState, useEffect } from "react";
import { renderConfigBase } from "../../SafeRenderer";
import { SAMPLES } from "./samples";
import type { SafeEvent } from "safecontracts";

const STYLES = ["vanilla", "tailwind", "tailwind-daisy", "material"] as const;
const COMPONENT_NAMES = Object.keys(SAMPLES);

/** Load a safestyles CSS file dynamically. */
function loadStyle(name: string) {
  // Remove existing safestyle link
  const existing = document.getElementById("safestyle-link");
  if (existing) existing.remove();

  const link = document.createElement("link");
  link.id = "safestyle-link";
  link.rel = "stylesheet";
  link.href = `/styles/${name}/components.css`;
  document.head.appendChild(link);
}

export default function App() {
  const [activeStyle, setActiveStyle] = useState<string>("vanilla");
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const [events, setEvents] = useState<SafeEvent[]>([]);

  useEffect(() => {
    loadStyle(activeStyle);
  }, [activeStyle]);

  const handleEvent = (event: SafeEvent) => {
    setEvents(prev => [event, ...prev].slice(0, 20));
  };

  const componentsToShow = activeComponent
    ? [activeComponent]
    : COMPONENT_NAMES;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui, sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: 220, borderRight: "1px solid var(--sd-border, #e5e7eb)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Style switcher */}
        <div style={{ padding: 12, borderBottom: "1px solid var(--sd-border, #e5e7eb)" }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: 8 }}>Style</div>
          {STYLES.map(s => (
            <button
              key={s}
              onClick={() => setActiveStyle(s)}
              style={{
                display: "block", width: "100%", textAlign: "left", padding: "4px 8px",
                fontSize: 13, border: "none", borderRadius: 4, cursor: "pointer",
                background: s === activeStyle ? "#3b82f6" : "transparent",
                color: s === activeStyle ? "#fff" : "#1a1a1a",
                marginBottom: 2,
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Component list */}
        <div style={{ flex: 1, overflow: "auto", padding: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", marginBottom: 8, padding: "0 4px" }}>Components</div>
          <button
            onClick={() => setActiveComponent(null)}
            style={{
              display: "block", width: "100%", textAlign: "left", padding: "4px 8px",
              fontSize: 13, border: "none", borderRadius: 4, cursor: "pointer",
              background: activeComponent === null ? "#3b82f6" : "transparent",
              color: activeComponent === null ? "#fff" : "#1a1a1a",
              marginBottom: 2,
            }}
          >
            All
          </button>
          {COMPONENT_NAMES.map(name => (
            <button
              key={name}
              onClick={() => setActiveComponent(name)}
              style={{
                display: "block", width: "100%", textAlign: "left", padding: "4px 8px",
                fontSize: 13, border: "none", borderRadius: 4, cursor: "pointer",
                background: name === activeComponent ? "#3b82f6" : "transparent",
                color: name === activeComponent ? "#fff" : "#1a1a1a",
                marginBottom: 2,
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#1a1a1a" }}>
          react/18 — {activeStyle}
          {activeComponent && <span style={{ fontWeight: 400, color: "#6b7280" }}> — {activeComponent}</span>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {componentsToShow.map(name => {
            const config = SAMPLES[name];
            if (!config) return null;
            return (
              <div key={name} style={{ border: "1px solid var(--sd-border, #e5e7eb)", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#6b7280", borderBottom: "1px solid var(--sd-border, #e5e7eb)", background: "#fafafa" }}>
                  {name}
                </div>
                <div style={{ padding: 16 }}>
                  {renderConfigBase(config, handleEvent)}
                </div>
              </div>
            );
          })}
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
