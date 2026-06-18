import { useEffect, useRef } from "react";
import type { Chart } from "chart.js";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { buildComponent } from "../../utils/render";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface SafeChartProps {
  config: ConfigBase;
  data: Record<string, any>[];
  onEvent?: OnSafeEvent;
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

export function SafeChart({ config, data, onEvent }: SafeChartProps) {
  const { metadata } = config;
  const variant = (metadata.variant as string) ?? "default";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const resolved: ConfigBase = data?.length
      ? { ...config, data: { values: { name: "values", type: "list", source: "inline", schema: { fields: [] }, inline: data } } }
      : config;
    const _ctx = createSafeFireContext(resolved, onEvent, buildPayloadViaCli);
    chartRef.current = createSafeChart(canvasRef.current, resolved, _ctx);
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [config, data, onEvent]);

  return (
    <div data-component="chart" data-variant={variant} data-chart-type={metadata.chartType}>
      {metadata.title && <div data-role="title">{metadata.title as string}</div>}
      <div data-chart-area>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
