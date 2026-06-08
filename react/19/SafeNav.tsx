/**
 * SafeNav — config-driven navigation sidebar.
 * navStyle variants: classic (more to come).
 * Layout and classes from figma. Data from ConfigBase.
 */
import { useState, type ReactNode } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeEvent } from "safecontracts";
import * as Icons from "lucide-react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

export interface SafeNavProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeNav({ config, onEvent }: SafeNavProps) {
  const navStyle = (config.metadata.navStyle as string) ?? "classic";
  if (navStyle === "classic") return <NavClassic config={config} onEvent={onEvent} />;
  return <div className="p-3 text-sm text-muted-foreground">Unknown navStyle: {navStyle}</div>;
}

/** Resolve a kebab-case icon name to a lucide component. */
function LucideIcon({ name, size = 16 }: { name: string; size?: number }) {
  const pascal = name.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  const Comp = (Icons as any)[pascal] ?? (Icons as any)[pascal + "2"] ?? null;
  if (!Comp) return null;
  return <Comp size={size} />;
}

// ─── Classic (figma layout, ConfigBase data) ────────────────────────────────

function NavClassic({ config, onEvent }: SafeNavProps) {
  const { metadata, children } = config;
  const [active, setActive] = useState<string>("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const title = metadata.title as string | undefined;
  const subtitle = metadata.subtitle as string | undefined;
  const headerIcon = metadata.icon as string | undefined;
  const showSearch = metadata.search === true;
  const userName = metadata.userName as string | undefined;
  const userEmail = metadata.userEmail as string | undefined;
  const userInitials = (metadata.userInitials as string) ?? (userName ? userName.split(" ").map(w => w[0]).join("").slice(0, 2) : "");

  const fire = (key: string) => {
    setActive(key);
    onEvent?.(createSafeEvent("nav", "navigate", { key, value: key }, { context: { path: key } }));
  };

  const toggle = (key: string) =>
    setExpanded((p) => p.includes(key) ? p.filter((k) => k !== key) : [...p, key]);

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
          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors
            ${depth > 0 ? "pl-8" : ""}
            ${isActive
              ? "bg-primary text-primary-foreground"
              : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
            }`}
        >
          {icon && <span className="shrink-0"><LucideIcon name={icon} size={16} /></span>}
          {!icon && depth > 0 && <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />}
          <span className="flex-1 text-left">{label}</span>
          {badge != null && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {badge}
            </span>
          )}
          {hasChildren && (
            <span className="shrink-0">
              {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </span>
          )}
        </button>
        {hasChildren && isExpanded && (
          <div className="mt-0.5 mb-0.5">
            {Object.entries(child.children!).map(([k, c]) =>
              renderItem(k, c, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const entries = Object.entries(children ?? {});
  const mainItems = entries.filter(([_, c]) => (c.metadata?.section as string) !== "bottom");
  const bottomItems = entries.filter(([_, c]) => (c.metadata?.section as string) === "bottom");

  return (
    <div className="w-56 h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      {title && (
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              {headerIcon
                ? <span className="text-primary-foreground"><LucideIcon name={headerIcon} size={14} /></span>
                : <span className="text-primary-foreground text-xs font-semibold">{title.charAt(0).toUpperCase()}</span>
              }
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">{title}</p>
              {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      {showSearch && (
        <div className="px-3 py-3">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-muted/60 text-muted-foreground text-sm">
            <Search size={13} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 overflow-y-auto space-y-0.5">
        {mainItems.map(([k, c]) => renderItem(k, c))}
      </nav>

      {/* Bottom */}
      {bottomItems.length > 0 && (
        <div className="px-2 py-2 border-t border-sidebar-border space-y-0.5">
          {bottomItems.map(([k, c]) => renderItem(k, c))}
        </div>
      )}

      {/* User */}
      {userName && (
        <div className="px-3 py-3 border-t border-sidebar-border flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">{userInitials}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-none truncate">{userName}</p>
            {userEmail && <p className="text-xs text-muted-foreground mt-0.5 truncate">{userEmail}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
