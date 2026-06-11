import React from "react";
import { getDataSource } from "safecontracts";
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
import { SafeList } from "./SafeList";
import { SafeMap } from "./SafeMap";
import { SafeNav } from "./SafeNav";
import { SafePicker } from "./SafePicker";
import { SafeFlow } from "./SafeFlow";
import { SafeSheet } from "./SafeSheet";
import { SafeTable } from "./SafeTable";
import { SafeTimeline } from "./SafeTimeline";
import { SafeTree } from "./SafeTree";
import { SafeHierarchy } from "./SafeHierarchy";

function extractData(config: ConfigBase): { inline: any; list: any[]; record: Record<string, any> } {
  const raw = getDataSource(config)?.inline;
  const list = Array.isArray(raw) ? raw : [];
  const record = (Array.isArray(raw) ? raw[0] : raw) ?? {};
  return { inline: raw, list, record };
}

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface RenderContext {
  parentContext?: { parent: string; path: string };
  handler?: string;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function renderConfigBase(
  config: ConfigBase,
  onEvent?: OnSafeEvent,
  ctx?: RenderContext,
): ReactNode {
  const component = config.component ?? (config.metadata.component as string);
  const { inline, list, record } = extractData(config);

  // Resolve the handler: this config's own eventHandler takes precedence, otherwise inherit from parent context
  const handler = config.eventHandler?.handler ?? ctx?.handler;

  // Build a child context that carries the handler down the tree
  const childCtx = (extra?: Partial<RenderContext>): RenderContext => ({
    ...ctx,
    ...extra,
    handler,
  });

  // Wrap onEvent to stamp the handler on every event fired from this subtree
  const stampedOnEvent: OnSafeEvent | undefined = onEvent && handler
    ? (event) => {
        onEvent({ ...event, handler });
      }
    : onEvent;

  // --- Container components (recurse into children) ---

  if (component === "layout") {
    const regions: Record<string, ReactNode> = {};
    for (const [key, child] of Object.entries(config.children ?? {})) {
      regions[key] = renderConfigBase(child, stampedOnEvent, childCtx());
    }
    return <SafeLayout config={config} regions={regions} onEvent={stampedOnEvent} />;
  }

  if (component === "columns") {
    return (
      <SafeColumns
        config={config}
        renderChild={(_key, child) => renderConfigBase(child, stampedOnEvent, childCtx())}
        onEvent={stampedOnEvent}
      />
    );
  }

  if (component === "card") {
    const childNodes: ReactNode[] = [];
    if (config.children) {
      for (const [key, child] of Object.entries(config.children)) {
        childNodes.push(
          <div key={key} data-child={key}>
            {renderConfigBase(child, stampedOnEvent, childCtx({
              parentContext: { parent: (config.metadata.ref as string) ?? "card", path: key },
            }))}
          </div>
        );
      }
    }
    return (
      <div>
        <SafeCard config={config} data={record} onEvent={stampedOnEvent} />
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
    return <SafeCalendar config={config} onEvent={stampedOnEvent} />;
  }
  if (component === "toggle") {
    return <SafeToggle config={config} data={list} onEvent={stampedOnEvent} />;
  }
  if (component === "week") {
    return <SafeWeek config={config} onEvent={stampedOnEvent} />;
  }
  if (component === "chat") {
    return <SafeChat config={config} onEvent={stampedOnEvent} />;
  }
  if (component === "tabs") {
    return <SafeTabs config={config} onEvent={stampedOnEvent} />;
  }
  if (component === "callout") {
    return <SafeCallout config={config} onEvent={stampedOnEvent} />;
  }
  if (component === "drag-drop") {
    return <SafeDragDrop config={config} data={list} onEvent={stampedOnEvent} />;
  }
  if (component === "button") {
    return (
      <SafeButton
        config={config}
        onEvent={stampedOnEvent}
        eventContext={ctx?.parentContext}
        renderChild={(key, child) => renderConfigBase(child, stampedOnEvent, childCtx({ parentContext: { parent: (config.metadata.ref as string) ?? "button", path: key } }))}
      />
    );
  }

  if (component === "grid") {
    return <SafeGrid config={config} data={record} onEvent={stampedOnEvent} />;
  }

  if (component === "input") {
    const field = (config.metadata.field as string) ?? Object.keys(record)[0];
    return <SafeInput config={config} data={record} field={field} onEvent={stampedOnEvent} />;
  }

  if (component === "list") {
    return <SafeList config={config} data={list} onEvent={stampedOnEvent} />;
  }

  if (component === "picker") {
    return <SafePicker config={config} data={list} onEvent={stampedOnEvent} />;
  }

  if (component === "table") {
    return <SafeTable config={config} data={list} onEvent={stampedOnEvent} />;
  }

  if (component === "tree") {
    return <SafeTree config={config} data={list} onEvent={stampedOnEvent} />;
  }

  if (component === "sheet") {
    return <SafeSheet config={config} data={list} onEvent={stampedOnEvent} />;
  }

  if (component === "chart") {
    return <SafeChart config={config} data={list} onEvent={stampedOnEvent} />;
  }

  if (component === "heatmap") {
    return <SafeHeatmap config={config} data={list} onEvent={stampedOnEvent} />;
  }

  if (component === "gauge") {
    return <SafeGauge config={config} data={record} onEvent={stampedOnEvent} />;
  }

  if (component === "funnel") {
    return <SafeFunnel config={config} data={list} onEvent={stampedOnEvent} />;
  }

  if (component === "flow") {
    return <SafeFlow config={config} onEvent={stampedOnEvent} />;
  }

  if (component === "hierarchy") {
    return <SafeHierarchy config={config} onEvent={stampedOnEvent} />;
  }

  if (component === "timeline") {
    return <SafeTimeline config={config} data={list} onEvent={stampedOnEvent} />;
  }

  if (component === "map") {
    return <SafeMap config={config} data={list} onEvent={stampedOnEvent} />;
  }

  if (component === "nav") {
    return <SafeNav config={config} onEvent={stampedOnEvent} />;
  }

  // --- Unknown ---
  return (
    <div style={{ padding: "var(--sd-space-md)", color: "var(--sd-text-dim)", fontSize: "var(--sd-font-sm)" }}>
      Unknown component: {component}
    </div>
  );
}

// Layout resolution lives in safecontracts (resolver-layout.ts) — re-exported here
// so existing imports from the renderer keep working.
export { resolveConfigLayout } from "safecontracts";
export type { ConfigResolver } from "safecontracts";
