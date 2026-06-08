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
  const navStyle = (config.metadata.navStyle as string) ?? "classic";
  if (navStyle === "classic") return <NavClassic config={config} onEvent={onEvent} />;
  return (
    <div style={{ padding: 12, color: "#888", fontSize: 13 }}>
      Unknown navStyle: {navStyle}
    </div>
  );
}

// ─── Classic ────────────────────────────────────────────────────────────────

const S = {
  bg: "#ffffff",
  bgHover: "#f5f5f5",
  bgActive: "#2563eb",
  text: "#1a1a1a",
  textMuted: "#6b7280",
  textActive: "#ffffff",
  border: "#e5e7eb",
  badgeBg: "#f3f4f6",
  badgeActiveBg: "rgba(255,255,255,0.2)",
  searchBg: "#f3f4f6",
  avatarBg: "#2563eb",
  userAvatarBg: "#e5e7eb",
  font: "13px",
  fontSm: "11px",
  fontXs: "10px",
  radius: "6px",
  radiusPill: "999px",
  gap: "8px",
  pad: "12px",
};

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
    setExpanded((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  const fire = (key: string) => {
    setActive(key);
    onEvent?.(createSafeEvent("nav", "navigate", { key, value: key }, {
      context: { path: key },
    }));
  };

  const renderItem = (key: string, child: ConfigBase, depth = 0): ReactNode => {
    const label = (child.metadata?.label as string) ?? key;
    const icon = child.metadata?.icon as string | undefined;
    const badge = child.metadata?.badge as number | undefined;
    const hasChildren = child.children && Object.keys(child.children).length > 0;
    const isActive = active === key;
    const isExpanded = expanded.includes(key);

    return (
      <div key={key}>
        <button
          onClick={() => { fire(key); if (hasChildren) toggle(key); }}
          style={{
            width: "100%", display: "flex", alignItems: "center",
            gap: S.gap, padding: "5px 10px",
            paddingLeft: depth > 0 ? 12 + depth * 16 : 10,
            borderRadius: S.radius, fontSize: S.font,
            border: "none", cursor: "pointer", textAlign: "left",
            background: isActive ? S.bgActive : "transparent",
            color: isActive ? S.textActive : S.text,
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = S.bgHover; }}
          onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
        >
          {icon && <span style={{ flexShrink: 0, width: 16, textAlign: "center", fontSize: 14 }}>{IC[icon] ?? "•"}</span>}
          {!icon && depth > 0 && <span style={{ width: 6, height: 6, borderRadius: "50%", background: isActive ? S.textActive : S.textMuted, flexShrink: 0 }} />}
          <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
          {badge != null && (
            <span style={{
              fontSize: S.fontXs, padding: "1px 6px", borderRadius: S.radiusPill, fontWeight: 500,
              background: isActive ? S.badgeActiveBg : S.badgeBg,
              color: isActive ? S.textActive : S.textMuted,
            }}>{badge}</span>
          )}
          {hasChildren && (
            <span style={{ flexShrink: 0, fontSize: 10, color: isActive ? S.textActive : S.textMuted }}>
              {isExpanded ? "▾" : "▸"}
            </span>
          )}
        </button>
        {hasChildren && isExpanded && (
          <div style={{ marginTop: 1, marginBottom: 1 }}>
            {Object.entries(child.children!).map(([k, c]) => renderItem(k, c, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Split children into main and bottom (items with metadata.section === "bottom")
  const entries = Object.entries(children ?? {});
  const mainItems = entries.filter(([_, c]) => (c.metadata?.section as string) !== "bottom");
  const bottomItems = entries.filter(([_, c]) => (c.metadata?.section as string) === "bottom");

  return (
    <div style={{
      width: 224, height: "100%", display: "flex", flexDirection: "column",
      background: S.bg, borderRight: `1px solid ${S.border}`, fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      {/* Header */}
      {title && (
        <div style={{ padding: S.pad, borderBottom: `1px solid ${S.border}`, display: "flex", alignItems: "center", gap: S.gap }}>
          <div style={{
            width: 28, height: 28, borderRadius: S.radius, background: S.avatarBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: S.fontSm, fontWeight: 600,
          }}>{title.charAt(0).toUpperCase()}</div>
          <div>
            <div style={{ fontSize: S.font, fontWeight: 600, lineHeight: 1 }}>{title}</div>
            {subtitle && <div style={{ fontSize: S.fontXs, color: S.textMuted, marginTop: 2 }}>{subtitle}</div>}
          </div>
        </div>
      )}

      {/* Search */}
      {showSearch && (
        <div style={{ padding: `${S.pad} ${S.pad}` }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "5px 8px", borderRadius: S.radius,
            background: S.searchBg, fontSize: S.font, color: S.textMuted,
          }}>
            <span style={{ fontSize: 12 }}>🔍</span>
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              style={{ background: "transparent", border: "none", outline: "none", flex: 1, fontSize: S.font, color: S.text }}
            />
          </div>
        </div>
      )}

      {/* Main nav */}
      <nav style={{ flex: 1, padding: "0 8px", overflowY: "auto" }}>
        {mainItems.map(([key, child]) => renderItem(key, child))}
      </nav>

      {/* Bottom section */}
      {bottomItems.length > 0 && (
        <div style={{ padding: "8px", borderTop: `1px solid ${S.border}` }}>
          {bottomItems.map(([key, child]) => renderItem(key, child))}
        </div>
      )}

      {/* User footer */}
      {showUserFooter && (
        <div style={{
          padding: S.pad, borderTop: `1px solid ${S.border}`,
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%", background: S.userAvatarBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: S.fontXs, fontWeight: 500, color: S.text,
          }}>JD</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: S.font, fontWeight: 500, lineHeight: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Jane Doe</div>
            <div style={{ fontSize: S.fontXs, color: S.textMuted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>jane@acme.com</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Icon map ───────────────────────────────────────────────────────────────

const IC: Record<string, string> = {
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
