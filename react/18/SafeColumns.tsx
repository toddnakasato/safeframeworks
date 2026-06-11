import type { ReactNode } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { COLUMNS_DEFAULTS } from "safecontracts/components/columns";
import { useRenderLog, type RenderLogFn } from "./hooks/useRenderLog";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface SafeColumnsProps {
  config: ConfigBase;
  renderChild: (key: string, childConfig: ConfigBase) => ReactNode;
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

export function SafeColumns({ config, renderChild, onEvent, onRenderLog }: SafeColumnsProps) {
  const { metadata } = config;
  const D = COLUMNS_DEFAULTS;
  const totalColumns = (metadata.totalColumns as number) ?? D.totalColumns;
  const gap = (metadata.gap as string) ?? D.gap;
  const rowGap = (metadata.rowGap as string) ?? gap;
  const spacing = (metadata.spacing as string) ?? D.spacing;
  const surface = (metadata.surface as string) ?? D.surface;
  const radius = (metadata.radius as string) ?? D.radius;

  const renderRef = useRenderLog(onRenderLog, {
    component: "columns",
    variant: `${totalColumns}-col`,
  });

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))`,
    gap,
    rowGap,
  };

  const children = config.children ?? {};

  return (
    <div
      ref={renderRef}
      data-component="columns"
      data-surface={surface}
      data-radius={radius}
      data-spacing={spacing}
      data-columns={totalColumns}
      style={gridStyle}
    >
      {Object.entries(children).map(([key, childConfig]) => {
        const span = (childConfig.metadata.span as number) ?? totalColumns;
        const start = childConfig.metadata.start as number | undefined;

        const cellStyle: React.CSSProperties = {
          gridColumn: start
            ? `${start} / span ${span}`
            : `span ${span}`,
        };

        return (
          <div key={key} data-role="column" data-span={span} style={cellStyle}>
            {renderChild(key, childConfig)}
          </div>
        );
      })}
    </div>
  );
}