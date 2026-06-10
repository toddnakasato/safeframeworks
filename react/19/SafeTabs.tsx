import React, { useState } from "react";
import type { ConfigBase, SafeEvent } from "safecontracts";
import { createSafeEvent } from "safecontracts";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

interface TabItem {
  key: string;
  label: string;
  icon?: string;
  badge?: string | number;
}

interface Props {
  config: ConfigBase;
  onEvent?: (event: SafeEvent) => void;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function SafeTabs({ config, onEvent }: Props) {
  const { metadata, children } = config;
  const tabs: TabItem[] = (metadata.tabs as TabItem[]) ?? [];
  const variant = (metadata.variant as string) ?? "default";
  const position = (metadata.position as string) ?? "top";
  const defaultActive = (metadata.defaultActive as string) ?? tabs[0]?.key ?? "";

  const [active, setActive] = useState(defaultActive);

  const handleSelect = (key: string) => {
    setActive(key);
    onEvent?.(createSafeEvent("tabs", "select", { key }));
  };

  const isVertical = position === "left" || position === "right";

  return (
    <div
      data-component="tabs"
      data-variant={variant}
      data-position={position}
      style={{
        display: "flex",
        flexDirection: isVertical
          ? (position === "left" ? "row" : "row-reverse")
          : (position === "top" ? "column" : "column-reverse"),
      }}
    >
      {/* Tab bar */}
      <div
        data-tabs-bar
        style={{
          display: "flex",
          flexDirection: isVertical ? "column" : "row",
          gap: variant === "pill" ? 4 : 0,
          ...(isVertical
            ? { borderRight: position === "left" ? "1px solid var(--sd-border, var(--border, #ccc))" : undefined,
                borderLeft: position === "right" ? "1px solid var(--sd-border, var(--border, #ccc))" : undefined,
                padding: "4px" }
            : { borderBottom: position === "top" ? "1px solid var(--sd-border, var(--border, #ccc))" : undefined,
                borderTop: position === "bottom" ? "1px solid var(--sd-border, var(--border, #ccc))" : undefined }
          ),
        }}
      >
        {tabs.map(tab => (
          <button
            key={tab.key}
            data-tab
            data-active={active === tab.key ? "" : undefined}
            onClick={() => handleSelect(tab.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: variant === "pill" ? "6px 14px" : "8px 16px",
              border: "none",
              cursor: "pointer",
              fontWeight: active === tab.key ? 600 : 400,
              background: "transparent",
              color: "inherit",
            }}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span data-tab-badge style={{
                fontSize: 10, fontWeight: 600,
                padding: "1px 6px", borderRadius: 10,
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Active panel — only render if children exist */}
      {children && Object.keys(children).length > 0 && (
        <div data-tabs-panel style={{ flex: 1, overflow: "auto" }}>
          {children[active] && (
            <div data-tab-content data-tab-key={active}>
              {/* Consumer renders children[active] via renderConfigBase */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
