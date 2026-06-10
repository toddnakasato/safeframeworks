/**
 * SafeChart — config-driven chart component.
 *
 * Reads ConfigBase for chart type, fields, colors.
 * Renders via Chart.js (shared builder — identical across frameworks).
 * Data-attributes for host CSS. Zero Tailwind.
 */
import { useEffect, useRef } from "react";
import type { Chart } from "chart.js";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeChart } from "./chart";

export interface SafeChartProps {
  config: ConfigBase;
  data: Record<string, any>[];
  onEvent?: OnSafeEvent;
}

export function SafeChart({ config, data, onEvent }: SafeChartProps) {
  const { metadata } = config;
  const variant = (metadata.variant as string) ?? "default";
  const height = variant === "dense" ? 192 : variant === "minimal" ? 224 : 288;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    // Renderer receives resolved data via props; rebuild config.data per contract shape.
    const resolved: ConfigBase = data?.length
      ? { ...config, data: { values: { name: "values", type: "list", source: "inline", schema: { fields: [] }, inline: data } } }
      : config;
    chartRef.current = createSafeChart(canvasRef.current, resolved, onEvent);
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [config, data, onEvent]);

  return (
    <div data-component="chart" data-variant={variant} data-chart-type={metadata.chartType} style={{ width: "100%", height }}>
      {metadata.title && <div data-role="title">{metadata.title as string}</div>}
      <canvas ref={canvasRef} />
    </div>
  );
}
