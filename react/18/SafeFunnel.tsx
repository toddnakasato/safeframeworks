/**
 * SafeFunnel — D3 funnel/conversion visualization.
 * Data-attributes for host CSS. Zero Tailwind.
 */
import { useRef, useEffect } from "react";
import * as d3 from "d3";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeEvent } from "safecontracts";

export interface SafeFunnelProps {
  config: ConfigBase;
  data: Record<string, any>[];
  onEvent?: OnSafeEvent;
}

import { resolveColors } from "safecontracts";

export function SafeFunnel({ config, data, onEvent }: SafeFunnelProps) {
  const { metadata } = config;
  const FUNNEL_COLORS = resolveColors(metadata);
  const svgRef = useRef<SVGSVGElement>(null);
  const variant = (metadata.variant as string) ?? "default";
  const labelField = metadata.labelField as string;
  const valueField = metadata.valueField as string;
  const showConversion = metadata.showConversion !== false;
  const showPercent = metadata.showPercent !== false;

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const isHorizontal = variant === "horizontal";
    const width = 400;
    const height = isHorizontal ? 200 : data.length * 50 + 20;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const maxVal = data[0]?.[valueField] ?? 1;
    const barMaxWidth = width * 0.7;
    const barHeight = Math.min(40, (height - 20) / data.length - 6);

    data.forEach((d, i) => {
      const val = Number(d[valueField]) ?? 0;
      const pct = val / maxVal;
      const barW = Math.max(barMaxWidth * pct, 30);
      const x = (width - barW) / 2;
      const y = i * (barHeight + 6) + 10;
      const color = FUNNEL_COLORS[i % FUNNEL_COLORS.length];

      // Bar
      const g = svg.append("g").style("cursor", "pointer")
        .on("click", () => onEvent?.(createSafeEvent("funnel", "select", { index: i, data: d })));

      g.append("rect")
        .attr("x", x).attr("y", y)
        .attr("width", 0).attr("height", barHeight)
        .attr("rx", 4).attr("fill", color)
        .transition().duration(600).delay(i * 100)
        .attr("width", barW);

      // Label
      g.append("text")
        .attr("x", width / 2).attr("y", y + barHeight / 2)
        .attr("text-anchor", "middle").attr("dy", "0.35em")
        .attr("fill", "var(--sd-surface)").attr("font-size", 12).attr("font-weight", 600)
        .text(String(d[labelField] ?? ""));

      // Value + percent on right
      const displayVal = val.toLocaleString();
      const pctText = showPercent ? ` (${Math.round(pct * 100)}%)` : "";
      g.append("text")
        .attr("x", x + barW + 8).attr("y", y + barHeight / 2)
        .attr("dy", "0.35em")
        .attr("fill", "var(--sd-text-dim)").attr("font-size", 11)
        .text(`${displayVal}${pctText}`);

      // Conversion rate between stages
      if (showConversion && i > 0) {
        const prevVal = Number(data[i - 1][valueField]) ?? 1;
        const convRate = prevVal > 0 ? Math.round((val / prevVal) * 100) : 0;
        svg.append("text")
          .attr("x", 12).attr("y", y - 1)
          .attr("fill", "var(--sd-text-dim)").attr("font-size", 9)
          .text(`↓ ${convRate}%`);
      }
    });
  }, [data, metadata]);

  return (
    <div data-component="funnel" data-variant={variant}>
      <svg ref={svgRef} style={{ width: "100%", maxWidth: 500, display: "block" }} />
    </div>
  );
}