import { useState, useRef, useEffect, type ReactNode } from "react";
import { fireNav } from "safecontracts";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import * as Icons from "lucide-react";
import { createSafeNav } from "../../builders/nav";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface SafeNavProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

function LucideIcon({ name, size = 16 }: { name: string; size?: number }) {
  const pascal = name.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  const Comp = (Icons as any)[pascal] ?? (Icons as any)[pascal + "2"] ?? null;
  if (!Comp) return null;
  return <Comp size={size} />;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function SafeNav({ config, onEvent }: SafeNavProps) {
  const navStyle = (config.metadata.navStyle as string) ?? "classic";
  if (navStyle === "classic") return <NavClassic config={config} onEvent={onEvent} />;
  if (navStyle === "accordion") return <NavBuilder config={config} onEvent={onEvent} />;
  return <div data-component="nav" data-nav-style={navStyle}>Unknown navStyle: {navStyle}</div>;
}

function NavBuilder({ config, onEvent }: SafeNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const root = createSafeNav(containerRef.current, config, onEvent);
    return () => root.remove();
  }, [config, onEvent]);
  return <div ref={containerRef} data-nav-host />;
}

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
  const userInitials = (metadata.userInitials as string) ??
    (userName ? userName.split(" ").map(w => w[0]).join("").slice(0, 2) : "");

  const toggle = (key: string) =>
    setExpanded((p) => p.includes(key) ? p.filter((k) => k !== key) : [...p, key]);

  const fire = (key: string) => {
    setActive(key);
    fireNav(onEvent, "navigate", { key, value: key }, { context: { path: key } });
  };

  const renderItem = (key: string, child: ConfigBase, depth = 0): ReactNode => {
    const label = (child.metadata?.label as string) ?? key;
    const icon = child.metadata?.icon as string | undefined;
    const badge = child.metadata?.badge as number | string | undefined;
    const tag = child.metadata?.tag as string | undefined;
    const hasKids = child.children && Object.keys(child.children).length > 0;
    const isActive = active === key;
    const isExpanded = expanded.includes(key);

    return (
      <div key={key} data-nav-item data-depth={depth}>
        <button
          data-nav-button
          data-active={isActive || undefined}
          data-depth={depth}
          data-has-children={hasKids || undefined}
          onClick={() => { fire(key); if (hasKids) toggle(key); }}
        >
          {icon && <span data-nav-icon><LucideIcon name={icon} size={16} /></span>}
          {!icon && depth > 0 && <span data-nav-dot />}
          <span data-nav-label>{label}</span>
          {badge != null && <span data-nav-badge data-active={isActive || undefined}>{badge}</span>}
          {tag && <span data-nav-tag>{tag}</span>}
          {hasKids && (
            <span data-nav-chevron>
              {isExpanded ? <Icons.ChevronDown size={13} /> : <Icons.ChevronRight size={13} />}
            </span>
          )}
        </button>
        {hasKids && isExpanded && (
          <div data-nav-children>
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
    <div data-component="nav" data-nav-style="classic">
      {title && (
        <div data-nav-header>
          <div data-nav-header-inner>
            <div data-nav-logo>
              {headerIcon
                ? <LucideIcon name={headerIcon} size={14} />
                : <span>{title.charAt(0).toUpperCase()}</span>
              }
            </div>
            <div data-nav-header-text>
              <div data-nav-title>{title}</div>
              {subtitle && <div data-nav-subtitle>{subtitle}</div>}
            </div>
          </div>
        </div>
      )}

      {showSearch && (
        <div data-nav-search-wrapper>
          <div data-nav-search>
            <Icons.Search size={13} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              data-nav-search-input
            />
          </div>
        </div>
      )}

      <nav data-nav-main>
        {main.map(([k, c]) => renderItem(k, c))}
      </nav>

      {bottom.length > 0 && (
        <div data-nav-bottom>
          {bottom.map(([k, c]) => renderItem(k, c))}
        </div>
      )}

      {userName && (
        <div data-nav-user>
          <div data-nav-user-avatar>{userInitials}</div>
          <div data-nav-user-info>
            <div data-nav-user-name>{userName}</div>
            {userEmail && <div data-nav-user-email>{userEmail}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
