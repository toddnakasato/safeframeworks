/**
 * SafeGrid — config-driven CSS grid of label/value cells.
 *
 * Renders via data-attributes. Zero Tailwind. Zero hardcoded values.
 * Gallery JSON is the single source of truth.
 */
import { useState } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeEvent } from "safecontracts";
import { GRID_DEFAULTS } from "safecontracts/components/grid";
import { SafeGridCell } from "./SafeGridCell";

export interface SafeGridProps {
  config: ConfigBase;
  data: Record<string, any>;
  onEvent?: OnSafeEvent;
}

export function SafeGrid({ config, data, onEvent }: SafeGridProps) {
  const { metadata } = config;
  const D = GRID_DEFAULTS;
  const schema = Object.values(config.data ?? {})[0]?.schema;
  const columns = (metadata.columns as string) ?? D.columns;
  const label = metadata.label as string | undefined;
  const collapsible = !!metadata.collapsible;
  const collapseIcon = (metadata.collapseIcon as string) ?? "▾";
  const expandIcon = (metadata.expandIcon as string) ?? "▸";
  const spacing = (metadata.spacing as string) ?? D.spacing;
  const surface = (metadata.surface as string) ?? D.surface;
  const radius = (metadata.radius as string) ?? D.radius;
  const locale = (metadata.locale as string) ?? D.locale;
  const currency = (metadata.currency as string) ?? D.currency;
  const timezone = (metadata.timezone as string) ?? D.timezone;
  const emptyValue = (metadata.emptyValue as string) ?? D.emptyValue;
  const booleanTrue = (metadata.booleanTrue as string) ?? D.booleanTrue;
  const booleanFalse = (metadata.booleanFalse as string) ?? D.booleanFalse;

  const [collapsed, setCollapsed] = useState(false);

  const fields = (schema?.fields ?? []).filter((f) => f.visible !== false);

  const gridStyle = {
    display: "grid" as const,
    gridTemplateColumns: columns.replace(/1fr/g, "minmax(0, 1fr)"),
  };

  return (
    <div data-component="grid" data-surface={surface} data-radius={radius} data-spacing={spacing}>
      {label && (
        <div
          data-role="header"
          data-collapsible={collapsible || undefined}
          onClick={collapsible ? () => setCollapsed((c) => !c) : undefined}
        >
          <span data-role="header-label">{label}</span>
          {collapsible && (
            <span data-role="header-icon">{collapsed ? expandIcon : collapseIcon}</span>
          )}
        </div>
      )}
      {!collapsed && (
        <div data-role="body" style={gridStyle}>
          {fields.map((field) => (
            <SafeGridCell
              key={field.name}
              field={field}
              value={data[field.name]}
              locale={locale}
              currency={currency}
              timezone={timezone}
              emptyValue={emptyValue}
              booleanTrue={booleanTrue}
              booleanFalse={booleanFalse}
              onEvent={onEvent}
            />
          ))}
        </div>
      )}
    </div>
  );
}