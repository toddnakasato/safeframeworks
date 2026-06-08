/**
 * SafeNav — config-driven navigation sidebar.
 * navStyle variants: classic (more to come).
 */
import { useState, type ReactNode, type CSSProperties } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeEvent } from "safecontracts";

export interface SafeNavProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeNav({ config, onEvent }: SafeNavProps) {
  const navStyle = (config.metadata.navStyle as string) ?? "classic";
  if (navStyle === "classic") return <NavClassic config={config} onEvent={onEvent} />;
  return <div style={{ padding: 12, color: "#888", fontSize: 13 }}>Unknown navStyle: {navStyle}</div>;
}

// ─── SVG Icons (16x16, stroke-based, matches lucide) ───────────────────────

function Ico({ d, size = 16 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ICONS: Record<string, string> = {
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  inbox: "M22 12h-6l-2 3H10l-2-3H2 M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
  "bar-chart": "M12 20V10 M18 20V4 M6 20v-4",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  calendar: "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M16 2v4 M8 2v4 M3 10h18",
  "file-text": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  archive: "M21 8v13H3V8 M1 3h22v5H1z M10 12h4",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  search: "M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z M16 16l4.5 4.5",
  "chevron-down": "M6 9l6 6 6-6",
  "chevron-right": "M9 18l6-6-6-6",
};

function Icon({ name, size = 16 }: { name: string; size?: number }) {
  const d = ICONS[name];
  if (!d) return <span style={{ width: size, height: size, display: "inline-block" }}>•</span>;
  return <Ico d={d} size={size} />;
}

// ─── Classic ────────────────────────────────────────────────────────────────

function NavClassic({ config, onEvent }: SafeNavProps) {
  const { metadata, children } = config;
  const [active, setActive] = useState<string>("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const title = (metadata.title as string) ?? "";
  const subtitle = (metadata.subtitle as string) ?? "";
  const showSearch = metadata.search === true;
  const showUserFooter = metadata.userFooter === true;

  const toggle = (key: string) =>
    setExpanded((p) => p.includes(key) ? p.filter((k) => k !== key) : [...p, key]);

  const fire = (key: string) => {
    setActive(key);
    onEvent?.(createSafeEvent("nav", "navigate", { key, value: key }, { context: { path: key } }));
  };

  const renderItem = (key: string, child: ConfigBase, depth = 0): ReactNode => {
    const label = (child.metadata?.label as string) ?? key;
    const icon = child.metadata?.icon as string | undefined;
    const badge = child.metadata?.badge as number | undefined;
    const hasKids = child.children && Object.keys(child.children).length > 0;
    const on = active === key;
    const open = expanded.includes(key);

    const btnStyle: CSSProperties = {
      width: "100%", display: "flex", alignItems: "center",
      gap: 10, padding: "6px 12px",
      paddingLeft: depth > 0 ? 32 : 12,
      borderRadius: 6, fontSize: 13, lineHeight: "20px",
      border: "none", cursor: "pointer", textAlign: "left",
      background: on ? "#2563eb" : "transparent",
      color: on ? "#fff" : "rgba(0,0,0,0.7)",
      transition: "background 0.12s, color 0.12s",
      fontFamily: "inherit", fontWeight: on ? 500 : 400,
    };

    return (
      <div key={key}>
        <button
          style={btnStyle}
          onClick={() => { fire(key); if (hasKids) toggle(key); }}
          onMouseEnter={(e) => { if (!on) { e.currentTarget.style.background = "#f5f5f5"; e.currentTarget.style.color = "#111"; } }}
          onMouseLeave={(e) => { if (!on) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(0,0,0,0.7)"; } }}
        >
          {icon && <span style={{ flexShrink: 0, display: "flex" }}><Icon name={icon} size={16} /></span>}
          {!icon && depth > 0 && (
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: on ? "#fff" : "currentColor", flexShrink: 0, opacity: 0.5 }} />
          )}
          <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
          {badge != null && (
            <span style={{
              fontSize: 11, padding: "0 6px", borderRadius: 999, fontWeight: 500, lineHeight: "18px",
              background: on ? "rgba(255,255,255,0.2)" : "#f3f4f6",
              color: on ? "#fff" : "#6b7280",
            }}>{badge}</span>
          )}
          {hasKids && (
            <span style={{ flexShrink: 0, display: "flex", opacity: 0.5 }}>
              <Icon name={open ? "chevron-down" : "chevron-right"} size={13} />
            </span>
          )}
        </button>
        {hasKids && open && (
          <div style={{ marginTop: 2, marginBottom: 2 }}>
            {Object.entries(child.children!).map(([k, c]) => renderItem(k, c, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const entries = Object.entries(children ?? {});
  const main = entries.filter(([_, c]) => (c.metadata?.section as string) !== "bottom");
  const bottom = entries.filter(([_, c]) => (c.metadata?.section as string) === "bottom");

  return (
    <div style={{
      width: 224, height: "100%", display: "flex", flexDirection: "column",
      background: "#fff", borderRight: "1px solid #e5e7eb",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      {/* Header */}
      {title && (
        <div style={{ padding: "16px 16px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, background: "#2563eb",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 12, fontWeight: 600,
          }}>{title.charAt(0).toUpperCase()}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1 }}>{title}</div>
            {subtitle && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>{subtitle}</div>}
          </div>
        </div>
      )}

      {/* Search */}
      {showSearch && (
        <div style={{ padding: "12px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 10px", borderRadius: 6,
            background: "#f3f4f680", fontSize: 13, color: "#6b7280",
          }}>
            <Icon name="search" size={13} />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              style={{ background: "transparent", border: "none", outline: "none", flex: 1, fontSize: 13, color: "#111", fontFamily: "inherit" }}
            />
          </div>
        </div>
      )}

      {/* Main nav */}
      <nav style={{ flex: 1, padding: "0 8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
        {main.map(([k, c]) => renderItem(k, c))}
      </nav>

      {/* Bottom */}
      {bottom.length > 0 && (
        <div style={{ padding: "8px", borderTop: "1px solid #e5e7eb", display: "flex", flexDirection: "column", gap: 2 }}>
          {bottom.map(([k, c]) => renderItem(k, c))}
        </div>
      )}

      {/* User footer */}
      {showUserFooter && (
        <div style={{
          padding: "12px", borderTop: "1px solid #e5e7eb",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%", background: "#e5e7eb",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 500, color: "#374151",
          }}>JD</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Jane Doe</div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>jane@acme.com</div>
          </div>
        </div>
      )}
    </div>
  );
}
