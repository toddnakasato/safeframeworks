/**
 * SafeHeatmap — config-driven grid of value-colored cells.
 * Data-attributes for host CSS. Zero Tailwind.
 */
import type { ConfigBase, OnSafeEvent } from "safecomponents";
import { createSafeEvent } from "safecomponents";

export interface SafeHeatmapProps {
  config: ConfigBase;
  data: Record<string, any>[];
  onEvent?: OnSafeEvent;
}

export function SafeHeatmap({ config, data, onEvent }: SafeHeatmapProps) {
  const { metadata } = config;
  const cols = (metadata.columns as number) ?? 7;
  const valueField = metadata.valueField as string;
  const labelField = metadata.labelField as string | undefined;
  const variant = (metadata.variant as string) ?? "default";

  const values = data.map((d) => Number(d[valueField]) || 0);
  const minVal = (metadata.minValue as number) ?? Math.min(...values);
  const maxVal = (metadata.maxValue as number) ?? Math.max(...values);

  const gap = variant === "compact" ? 2 : variant === "dense" ? 1 : 4;

  return (
    <div data-component="heatmap" data-variant={variant} style={{ width: "100%" }}>
      {metadata.title && <div data-role="title">{metadata.title as string}</div>}
      <div
        data-role="grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap,
        }}
      >
        {data.map((d, i) => {
          const val = Number(d[valueField]) || 0;
          const t = maxVal === minVal ? 0 : (val - minVal) / (maxVal - minVal);
          const label = labelField ? String(d[labelField] ?? "") : String(val);
          return (
            <div
              key={i}
              data-role="cell"
              style={{
                aspectRatio: "1",
                borderRadius: "var(--sd-radius-sm)",
                background: `color-mix(in srgb, var(--sd-accent) ${Math.round((t * 0.85 + 0.05) * 100)}%, transparent)`,
                cursor: "default",
              }}
              title={label}
              onClick={() => onEvent?.(createSafeEvent("heatmap", "cell:click", { index: i, value: val, data: d }))}
            />
          );
        })}
      </div>
    </div>
  );
}