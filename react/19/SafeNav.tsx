/**
 * SafeNav — config-driven navigation sidebar.
 *
 * navStyle variants: classic (more to come).
 * Reads children as ConfigBase nodes. Recursive tree with expand/collapse.
 */
import { useState, type ReactNode } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeEvent } from "safecontracts";

export interface SafeNavProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeNav({ config, onEvent }: SafeNavProps) {
  const { metadata, children } = config;
  const navStyle = (metadata.navStyle as string) ?? "classic";

  if (navStyle === "classic") return <NavClassic config={config} onEvent={onEvent} />;

  // Fallback
  return (
    <div style={{ padding: "var(--sd-space-md)", color: "var(--sd-text-dim)", fontSize: "var(--sd-font-sm)" }}>
      Unknown navStyle: {navStyle}
    </div>
  );
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

  const toggle = (key: string) =>
    setExpanded((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  const handleClick = (key: string, child: ConfigBase) => {
    setActive(key);
    const eventName = (child.metadata?.eventName as string) ?? "navigate";
    onEvent?.(createSafeEvent("nav", eventName, { key, value: key }, {
      context: { path: key },
    }));
  };

  const renderItem = (key: string, child: ConfigBase, depth = 0): ReactNode => {
    const label = (child.metadata?.label as string) ?? key;
    const icon = child.metadata?.icon as string;
    const badge = child.metadata?.badge as number | undefined;
    const hasChildren = child.children && Object.keys(child.children).length > 0;
    const isActive = active === key;
    const isExpanded = expanded.includes(key);

    return (
      <div key={key} data-component="nav-item" data-active={isActive || undefined} data-depth={depth}>
        <button
          onClick={() => {
            handleClick(key, child);
            if (hasChildren) toggle(key);
          }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "var(--sd-space-sm)",
            padding: `var(--sd-space-xs) var(--sd-space-md)`,
            paddingLeft: depth > 0 ? `calc(var(--sd-space-lg) + ${depth * 12}px)` : undefined,
            borderRadius: "var(--sd-radius-md)",
            fontSize: "var(--sd-font-sm)",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            background: isActive ? "var(--sd-accent, #3b82f6)" : "transparent",
            color: isActive ? "#fff" : "var(--sd-text)",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--sd-surface-raised, #f3f4f6)"; }}
          onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
        >
          {icon && <span style={{ flexShrink: 0, fontSize: "var(--sd-font-base)" }}>{iconChar(icon)}</span>}
          <span style={{ flex: 1 }}>{label}</span>
          {badge != null && (
            <span style={{
              fontSize: "var(--sd-font-xs)",
              padding: "1px 6px",
              borderRadius: "var(--sd-radius-pill)",
              background: isActive ? "rgba(255,255,255,0.2)" : "var(--sd-surface-raised, #e5e7eb)",
              color: isActive ? "#fff" : "var(--sd-text-muted)",
            }}>
              {badge}
            </span>
          )}
          {hasChildren && (
            <span style={{ flexShrink: 0, fontSize: "10px" }}>
              {isExpanded ? "▾" : "▸"}
            </span>
          )}
        </button>
        {hasChildren && isExpanded && (
          <div style={{ marginTop: 2, marginBottom: 2 }}>
            {Object.entries(child.children!).map(([k, c]) => renderItem(k, c, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      data-component="nav"
      data-nav-style="classic"
      style={{
        width: 224,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "var(--sd-surface-base, #fff)",
        borderRight: "1px solid var(--sd-border)",
        fontFamily: "inherit",
      }}
    >
      {/* Header */}
      {title && (
        <div style={{
          padding: "var(--sd-space-lg) var(--sd-space-lg)",
          borderBottom: "1px solid var(--sd-border)",
          display: "flex",
          alignItems: "center",
          gap: "var(--sd-space-sm)",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: "var(--sd-radius-md)",
            background: "var(--sd-accent, #3b82f6)", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: "var(--sd-font-xs)", fontWeight: 600,
          }}>
            {title.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: "var(--sd-font-sm)", fontWeight: 600, lineHeight: 1 }}>{title}</div>
            {subtitle && <div style={{ fontSize: "var(--sd-font-xs)", color: "var(--sd-text-muted)", marginTop: 2 }}>{subtitle}</div>}
          </div>
        </div>
      )}

      {/* Search */}
      {showSearch && (
        <div style={{ padding: "var(--sd-space-md)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "var(--sd-space-sm)",
            padding: "var(--sd-space-xs) var(--sd-space-sm)",
            borderRadius: "var(--sd-radius-md)",
            background: "var(--sd-surface-sunken, #f3f4f6)",
            fontSize: "var(--sd-font-sm)", color: "var(--sd-text-muted)",
          }}>
            <span>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              style={{
                background: "transparent", border: "none", outline: "none",
                flex: 1, fontSize: "var(--sd-font-sm)", color: "var(--sd-text)",
              }}
            />
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "0 var(--sd-space-sm)", overflowY: "auto" }}>
        {children && Object.entries(children).map(([key, child]) => renderItem(key, child))}
      </nav>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Map icon name to a simple unicode/emoji character. */
function iconChar(name: string): string {
  const map: Record<string, string> = {
    home: "🏠", inbox: "📥", "bar-chart": "📊", users: "👥",
    calendar: "📅", "file-text": "📄", settings: "⚙️", star: "⭐",
    archive: "📦", bell: "🔔", shield: "🛡️", search: "🔍",
    "layout-dashboard": "📋", "line-chart": "📈", "pie-chart": "🥧",
    "user-plus": "👤", upload: "📤", compass: "🧭", layers: "📚",
    radio: "📡", cloud: "☁️", cpu: "💻", terminal: "🖥️",
    code: "💻", activity: "📊", database: "🗄️", "git-branch": "🔀",
    package: "📦", sparkles: "✨", "book-open": "📖", pencil: "✏️",
    image: "🖼️", mic: "🎤", bookmark: "🔖", clock: "🕐",
    trash: "🗑️", "trending-up": "📈", "message-square": "💬",
    "shopping-cart": "🛒",
  };
  return map[name] ?? "•";
}
