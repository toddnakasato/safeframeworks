/**
 * SafeRenderer — pure ConfigBase → ReactNode renderer.
 *
 * Component registry lookup + recursive children. No state, no dispatcher.
 * One function, one map. Every consumer calls this instead of hand-rolling if/else.
 */
import React from "react";
import type { ReactNode } from "react";
import type { ConfigBase, ConfigLayout, OnSafeEvent } from "safecontracts";
import { SafeButton } from "./SafeButton";
import { SafeCalendar } from "./SafeCalendar";
import { SafeCallout } from "./SafeCallout";
import { SafeChat } from "./SafeChat";
import { SafeWeek } from "./SafeWeek";
import { SafeToggle } from "./SafeToggle";
import { SafeTabs } from "./SafeTabs";
import { SafeDragDrop } from "./SafeDragDrop";
import { SafeCard } from "./SafeCard";
import { SafeChart } from "./SafeChart";
import { SafeColumns } from "./SafeColumns";
import { SafeFunnel } from "./SafeFunnel";
import { SafeGauge } from "./SafeGauge";
import { SafeGrid } from "./SafeGrid";
import { SafeHeatmap } from "./SafeHeatmap";
import { SafeInput } from "./SafeInput";
import { SafeLayout } from "./SafeLayout";
import { SafeMap } from "./SafeMap";
import { SafePicker } from "./SafePicker";
import { SafeSankey } from "./SafeSankey";
import { SafeSheet } from "./SafeSheet";
import { SafeTable } from "./SafeTable";
import { SafeTimeline } from "./SafeTimeline";
import { SafeTree } from "./SafeTree";
import { SafeTreemap } from "./SafeTreemap";

/** Extract inline data from config. */
function extractData(config: ConfigBase): { inline: any; list: any[]; record: Record<string, any> } {
  const raw = Object.values(config.data ?? {})[0]?.inline;
  const list = Array.isArray(raw) ? raw : [];
  const record = (Array.isArray(raw) ? raw[0] : raw) ?? {};
  return { inline: raw, list, record };
}

/** Context passed through recursive rendering. */
export interface RenderContext {
  /** Parent info for event routing (e.g. button inside card). */
  parentContext?: { parent: string; path: string };
}

/**
 * Render a ConfigBase tree into React nodes. Recursive.
 *
 * Handles all registered component types. Unknown components render a fallback.
 * Layout and columns children are resolved recursively.
 */
export function renderConfigBase(
  config: ConfigBase,
  onEvent?: OnSafeEvent,
  ctx?: RenderContext,
): ReactNode {
  const component = config.metadata.component as string;
  const { inline, list, record } = extractData(config);

  // --- Container components (recurse into children) ---

  if (component === "layout") {
    const regions: Record<string, ReactNode> = {};
    for (const [key, child] of Object.entries(config.children ?? {})) {
      regions[key] = renderConfigBase(child, onEvent);
    }
    return <SafeLayout config={config} regions={regions} onEvent={onEvent} />;
  }

  if (component === "columns") {
    return (
      <SafeColumns
        config={config}
        renderChild={(_key, child) => renderConfigBase(child, onEvent)}
        onEvent={onEvent}
      />
    );
  }

  if (component === "card") {
    const childNodes: ReactNode[] = [];
    if (config.children) {
      for (const [key, child] of Object.entries(config.children)) {
        childNodes.push(
          <div key={key} data-child={key}>
            {renderConfigBase(child, onEvent, {
              parentContext: { parent: (config.metadata.ref as string) ?? "card", path: key },
            })}
          </div>
        );
      }
    }
    return (
      <div>
        <SafeCard config={config} data={record} onEvent={onEvent} />
        {childNodes.length > 0 && (
          <div data-role="card-actions" style={{ display: "flex", gap: "var(--sd-space-md)", padding: "var(--sd-space-md) var(--sd-space-lg)" }}>
            {childNodes}
          </div>
        )}
      </div>
    );
  }

  // --- Leaf components ---

  if (component === "calendar") {
    return <SafeCalendar config={config} onEvent={onEvent} />;
  }
  if (component === "toggle") {
    return <SafeToggle config={config} data={list} onEvent={onEvent} />;
  }
  if (component === "week") {
    return <SafeWeek config={config} onEvent={onEvent} />;
  }
  if (component === "chat") {
    return <SafeChat config={config} onEvent={onEvent} />;
  }
  if (component === "tabs") {
    return <SafeTabs config={config} onEvent={onEvent} />;
  }
  if (component === "callout") {
    return <SafeCallout config={config} onEvent={onEvent} />;
  }
  if (component === "drag-drop") {
    return <SafeDragDrop config={config} data={list} onEvent={onEvent} />;
  }
  if (component === "button") {
    return (
      <SafeButton
        config={config}
        onEvent={onEvent}
        eventContext={ctx?.parentContext}
        renderChild={(key, child) => renderConfigBase(child, onEvent, { parentContext: { parent: (config.metadata.ref as string) ?? "button", path: key } })}
      />
    );
  }

  if (component === "grid") {
    return <SafeGrid config={config} data={record} onEvent={onEvent} />;
  }

  if (component === "input") {
    const field = (config.metadata.field as string) ?? Object.keys(record)[0];
    return <SafeInput config={config} data={record} field={field} onEvent={onEvent} />;
  }

  if (component === "picker") {
    return <SafePicker config={config} data={list} onEvent={onEvent} />;
  }

  if (component === "table") {
    return <SafeTable config={config} data={list} onEvent={onEvent} />;
  }

  if (component === "tree") {
    return <SafeTree config={config} data={list} onEvent={onEvent} />;
  }

  if (component === "sheet") {
    return <SafeSheet config={config} data={list} onEvent={onEvent} />;
  }

  if (component === "chart") {
    return <SafeChart config={config} data={list} onEvent={onEvent} />;
  }

  if (component === "heatmap") {
    return <SafeHeatmap config={config} data={list} onEvent={onEvent} />;
  }

  if (component === "gauge") {
    return <SafeGauge config={config} data={record} onEvent={onEvent} />;
  }

  if (component === "funnel") {
    return <SafeFunnel config={config} data={list} onEvent={onEvent} />;
  }

  if (component === "sankey") {
    return <SafeSankey config={config} data={record as any} onEvent={onEvent} />;
  }

  if (component === "treemap") {
    return <SafeTreemap config={config} data={list} onEvent={onEvent} />;
  }

  if (component === "timeline") {
    return <SafeTimeline config={config} data={list} onEvent={onEvent} />;
  }

  if (component === "map") {
    return <SafeMap config={config} data={list} onEvent={onEvent} />;
  }

  // --- Unknown ---
  return (
    <div style={{ padding: "var(--sd-space-md)", color: "var(--sd-text-dim)", fontSize: "var(--sd-font-sm)" }}>
      Unknown component: {component}
    </div>
  );
}

/**
 * renderConfigLayout — resolve string refs to ConfigBase, then render via SafeLayout.
 * The resolver is provided by the host (Tauri invoke, HTTP fetch, etc).
 */
export type ConfigResolver = (path: string) => Promise<ConfigBase | null>;

export async function resolveConfigLayout(
  layout: ConfigLayout,
  resolver: ConfigResolver,
): Promise<ConfigBase> {
  const children: Record<string, ConfigBase> = {};
  for (const [slot, filePath] of Object.entries(layout.children ?? {})) {
    if (filePath.includes("{{")) continue;
    const resolved = await resolver(filePath);
    if (resolved) children[slot] = resolved;
  }
  return {
    metadata: { ...layout.metadata },
    children,
  };
}
