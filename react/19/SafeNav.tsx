/**
 * SafeNav — config-driven navigation sidebar.
 * navStyle variants: classic (more to come).
 * Uses lucide-react icons — same library as figma designs.
 * Everything renders from ConfigBase metadata. Zero hardcoded content.
 */
import { useState, type ReactNode, type CSSProperties } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeEvent } from "safecontracts";
import * as LucideIcons from "lucide-react";

export interface SafeNavProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeNav({ config, onEvent }: SafeNavProps) {
  const navStyle = (config.metadata.navStyle as string) ?? "classic";
  if (navStyle === "classic") return <NavClassic config={config} onEvent={onEvent} />;
  return <div style={{ padding: 12, color: "#888", fontSize: 13 }}>Unknown navStyle: {navStyle}</div>;
}

// ─── Icon resolver ──────────────────────────────────────────────────────────

function LucideIcon({ name, size = 16 }: { name: string; size?: number }) {
  const pascal = name.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  const Icon = (LucideIcons as any)[pascal] ?? (LucideIcons as any)[pascal + "2"] ?? null;
  if (!Icon) return <span style={{ width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>•</span>;
  return <Icon size={size} />;
}

// ─── Classic ────────────────────────────────────────────────────────────────

function NavClassic({ config, onEvent }: SafeNavProps) {
  const { metadata, children } = config;
  const [active, setActive] = useState<string>("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  // All visual properties from metadata
  const width = (metadata.width as number) ?? 224;
  const title = (metadata.title as string) ?? "";
  const subtitle = (metadata.subtitle as string) ?? "";
  const headerIcon = metadata.icon as string | undefined;
  const headerColor = (metadata.headerColor as string) ?? "#2563eb";
  const showSearch = metadata.search === true;
  const userName = metadata.userName as string | undefined;
  const userEmail = metadata.userEmail as string | undefined;
  const userInitials = (metadata.userInitials as string) ?? (userName ? userName.split(" ").map(w => w[0]).join("").slice(0, 2) : "");
  const showUser = !!userName;

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
      background: on ? headerColor : "transparent",
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
          {icon && <span style={{ flexShrink: 0, display: "flex" }}><LucideIcon name={icon} size={16} /></span>}
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
              {open ? <LucideIcons.ChevronDown size={13} /> : <LucideIcons.ChevronRight size={13} />}
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
    <div
      data-component="nav" data-nav-style="classic"
      style={{
        width, height: "100%", display: "flex", flexDirection: "column",
        background: "#fff", borderRight: "1px solid #e5e7eb",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header — icon or initial, title, subtitle */}
      {title && (
        <div style={{ padding: 16, borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, background: headerColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 12, fontWeight: 600,
          }}>
            {headerIcon ? <LucideIcon name={headerIcon} size={14} /> : title.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1 }}>{title}</div>
            {subtitle && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>{subtitle}</div>}
          </div>
        </div>
      )}

      {/* Search */}
      {showSearch && (
        <div style={{ padding: 12 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "6px 10px", borderRadius: 6,
            background: "rgba(243,244,246,0.6)", fontSize: 13, color: "#6b7280",
          }}>
            <LucideIcons.Search size={13} />
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
        <div style={{ padding: 8, borderTop: "1px solid #e5e7eb", display: "flex", flexDirection: "column", gap: 2 }}>
          {bottom.map(([k, c]) => renderItem(k, c))}
        </div>
      )}

      {/* User footer — fully from metadata */}
      {showUser && (
        <div style={{ padding: 12, borderTop: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%", background: "#e5e7eb",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 500, color: "#374151",
          }}>{userInitials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</div>
            {userEmail && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userEmail}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
