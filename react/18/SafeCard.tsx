import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeEvent } from "safecontracts";
import type { RowCell, RowDef } from "safecontracts";
import { useRenderLog, type RenderLogFn } from "./hooks/useRenderLog";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface SafeCardProps {
  config: ConfigBase;
  data: Record<string, any>;
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

export function SafeCard({ config, data, onEvent, onRenderLog }: SafeCardProps) {
  const { metadata } = config;
  const rows: RowDef[] | undefined = metadata.rows as RowDef[] | undefined;
  const accent = (metadata.accent as string) ?? "brand";
  const spacing = (metadata.spacing as string) ?? "normal";
  const surface = (metadata.surface as string) ?? "base";
  const radius = (metadata.radius as string) ?? "md";
  const variant = (metadata.variant as string) ?? "ghost";
  const header = metadata.header as string | undefined;
  const density = metadata.density as string | undefined;
  const backLabel = metadata.backLabel as string | undefined;

  const renderRef = useRenderLog(onRenderLog, { component: "card", variant });

  if (rows && rows.length > 0) {
    return (
      <div
        ref={renderRef}
        data-component="card"
        data-variant={variant}
        data-surface={surface}
        data-radius={radius}
        data-spacing={spacing}
        data-accent={accent}
        onClick={() => onEvent?.(createSafeEvent("card", "click", { data }))}
      >
        {backLabel && (
          <div data-role="back" onClick={(e) => { e.stopPropagation(); onEvent?.(createSafeEvent("card", "back", {})); }}>
            {backLabel}
          </div>
        )}
        {header && <div data-role="header">{header}</div>}
        {rows.map((rowDef: RowDef, ri: number) => (
          <div key={ri} data-role="row" data-cells={rowDef.length}>
            {rowDef.map((cell: RowCell, ci: number) => {
              if (cell.text) {
                return <div key={ci} data-style={cell.style} data-align={cell.align}>{cell.text}</div>;
              }
              const val = data[cell.field];
              if (val == null || String(val).trim() === "") return null;
              return (
                <div key={ci} data-style={cell.style} data-align={cell.align} data-field={cell.field}>
                  {String(val)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  const resolvedSchema = Object.values(config.data ?? {})[0]?.schema;
  const fields = resolvedSchema?.fields ?? [];

  return (
    <div
      ref={renderRef}
      data-component="card"
      data-variant={variant}
      data-surface={surface}
      data-radius={radius}
      data-spacing={spacing}
      data-accent={accent}
      data-density={density}
      onClick={() => onEvent?.(createSafeEvent("card", "click", { data }))}
    >
      {backLabel && (
        <div data-role="back" onClick={(e) => { e.stopPropagation(); onEvent?.(createSafeEvent("card", "back", {})); }}>
          {backLabel}
        </div>
      )}
      {header && <div data-role="header">{header}</div>}
      {fields.map((field) => {
        const val = data[field.name];
        if (val == null || String(val).trim() === "") return null;
        return (
          <div key={field.name} data-role="field-row">
            <div data-role="field-label">{field.label}</div>
            <div data-role="field-value" data-field={field.name}>{String(val)}</div>
          </div>
        );
      })}
      {fields.length === 0 && <div data-role="empty">No fields configured</div>}
    </div>
  );
}