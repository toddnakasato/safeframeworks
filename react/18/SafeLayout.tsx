import type { ReactNode } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeEvent } from "safecontracts";
import { useRenderLog, type RenderLogFn } from "./hooks/useRenderLog";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface SafeLayoutProps {
  config: ConfigBase;
  regions: Record<string, ReactNode>;
  onEvent?: OnSafeEvent;
  onRenderLog?: RenderLogFn;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function SafeLayout({ config, regions, onEvent, onRenderLog }: SafeLayoutProps) {
  const { metadata } = config;
  const variant = metadata.variant ?? "single";
  const sidebarW = metadata.sidebarWidth ?? 280;
  const detailW = metadata.detailWidth ?? 360;
  const padding = metadata.padding ?? undefined;
  const overflow = metadata.overflow ?? undefined;
  const gap = metadata.gap ?? "16px";
  const backLabel = metadata.backLabel ?? undefined;

  const renderRef = useRenderLog(onRenderLog, {
    component: "layout",
    variant,
  });

  const baseStyle: React.CSSProperties = {
    padding,
    overflow,
  };

  const backButton = backLabel ? (
    <button
      style={{
        fontSize: "var(--sd-font-md)", color: "var(--sd-text-dim)", border: "1px solid var(--sd-border)",
        borderRadius: "var(--sd-radius-md)", padding: "var(--sd-space-sm) var(--sd-space-lg)", cursor: "pointer", background: "transparent",
        marginBottom: "var(--sd-space-lg)",
      }}
      onClick={() => onEvent?.(createSafeEvent("layout", "back", {}))}
    >
      {backLabel}
    </button>
  ) : null;

  if (variant === "stack") {
    return (
      <div ref={renderRef} data-component="layout" data-variant="stack" style={{ ...baseStyle, display: "flex", flexDirection: "column", gap, width: "100%", flex: 1, minHeight: 0 }}>
        {Object.values(regions).map((node, i) => (
          <div key={i}>{node}</div>
        ))}
      </div>
    );
  }

  if (variant === "single") {
    return (
      <div ref={renderRef} data-component="layout" data-variant="single" style={{ ...baseStyle, display: "flex", flexDirection: "column", width: "100%", flex: 1, minHeight: 0 }}>
        {regions.main}
      </div>
    );
  }

  if (variant === "left-main") {
    const columns = (metadata.columns as string) ?? "1fr 1fr";
    return (
      <div ref={renderRef} data-component="layout" data-variant="left-main" style={{ ...baseStyle, display: "grid", gridTemplateColumns: columns, gap, width: "100%", flex: 1, minHeight: 0 }}>
        <div style={{ minWidth: 0 }}>{regions.left}</div>
        <div style={{ minWidth: 0 }}>{regions.main}</div>
      </div>
    );
  }

  if (variant === "main-detail") {
    return (
      <div ref={renderRef} data-component="layout" data-variant="main-detail" style={{ ...baseStyle, display: "flex", gap, width: "100%", flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>{regions.main}</div>
        <div style={{ flexShrink: 0, width: detailW }}>{regions.detail}</div>
      </div>
    );
  }

  if (variant === "left-main-right") {
    return (
      <div ref={renderRef} data-component="layout" data-variant="left-main-right" style={{ ...baseStyle, display: "flex", gap, width: "100%", flex: 1, minHeight: 0 }}>
        <div style={{ flexShrink: 0, width: sidebarW }}>{regions.left}</div>
        <div style={{ flex: 1, minWidth: 0 }}>{regions.main}</div>
        <div style={{ flexShrink: 0, width: detailW }}>{regions.right}</div>
      </div>
    );
  }

  if (variant === "header-main") {
    return (
      <div ref={renderRef} data-component="layout" data-variant="header-main" style={{ ...baseStyle, display: "flex", flexDirection: "column", width: "100%", flex: 1, minHeight: 0 }}>
        <div style={{ flexShrink: 0 }}>
          {backButton}
          {regions.header}
        </div>
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>{regions.main}</div>
      </div>
    );
  }

  if (variant === "header-main-detail") {
    return (
      <div ref={renderRef} data-component="layout" data-variant="header-main-detail" style={{ ...baseStyle, display: "flex", flexDirection: "column", gap, width: "100%", flex: 1, minHeight: 0 }}>
        <div>{regions.header}</div>
        <div style={{ display: "flex", gap, flex: 1, minHeight: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>{regions.main}</div>
          <div style={{ flexShrink: 0, width: detailW }}>{regions.detail}</div>
        </div>
      </div>
    );
  }

  return <div ref={renderRef} data-component="layout" data-variant={variant} style={{ ...baseStyle, width: "100%", flex: 1, minHeight: 0 }}>{regions.main}</div>;
}