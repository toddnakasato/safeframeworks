import { useRef, useEffect } from "react";
import * as d3 from "d3";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeEvent } from "safecontracts";
import { resolveColors } from "safecontracts";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface SafeTreemapProps {
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

export function SafeTreemap({ config, data, onEvent }: SafeTreemapProps) {
  const { metadata } = config;
  const COLORS = resolveColors(metadata);
  const svgRef = useRef<SVGSVGElement>(null);
  const labelField = metadata.labelField as string;
  const valueField = metadata.valueField as string;
  const idField = metadata.idField as string | undefined;
  const parentField = metadata.parentField as string | undefined;
  const showValues = metadata.showValues !== false;
  const padding = (metadata.padding as number) ?? 2;

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 500;
    const height = 320;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    let root: d3.HierarchyNode<any>;
    if (idField && parentField) {
      const stratify = d3.stratify()
        .id((d: any) => d[idField])
        .parentId((d: any) => d[parentField]);
      const withRoot = [{ [idField]: "__root__", [parentField]: null, [labelField]: "", [valueField]: 0 },
        ...data.map(d => ({ ...d, [parentField]: d[parentField] ?? "__root__" }))];
      root = stratify(withRoot).sum((d: any) => Math.max(0, Number(d[valueField]) || 0));
    } else {
      root = d3.hierarchy({ children: data } as any).sum((d: any) => Math.max(0, Number(d[valueField]) || 0));
    }

    d3.treemap().size([width, height]).padding(padding).round(true)(root as any);

    const leaves = (root as any).leaves();

    const g = svg.append("g");
    const cells = g.selectAll("g").data(leaves).join("g")
      .attr("transform", (d: any) => `translate(${d.x0},${d.y0})`)
      .style("cursor", "pointer")
      .on("click", (_, d: any) => onEvent?.(createSafeEvent("treemap", "select", { data: d.data, value: d.value })));

    cells.append("rect")
      .attr("width", (d: any) => Math.max(0, d.x1 - d.x0))
      .attr("height", (d: any) => Math.max(0, d.y1 - d.y0))
      .attr("fill", (_, i) => COLORS[i % COLORS.length])
      .attr("rx", 3)
      .attr("opacity", 0.85);

    cells.each(function(d: any) {
      const w = d.x1 - d.x0;
      const h = d.y1 - d.y0;
      if (w < 30 || h < 20) return;
      const label = d.data[labelField] ?? "";
      const el = d3.select(this);
      el.append("text")
        .attr("x", 4).attr("y", 14)
        .attr("fill", "var(--sd-surface)").attr("font-size", Math.min(12, w / 6))
        .attr("font-weight", 600)
        .text(String(label).slice(0, Math.floor(w / 6)));
      if (showValues && h > 34) {
        el.append("text")
          .attr("x", 4).attr("y", 28)
          .attr("fill", "var(--sd-text)").attr("font-size", Math.min(10, w / 8))
          .text(Number(d.data[valueField]).toLocaleString());
      }
    });

  }, [data, metadata]);

  return (
    <div data-component="treemap" data-variant={(metadata.variant as string) ?? "default"}>
      <svg ref={svgRef} style={{ width: "100%", maxWidth: 600, display: "block" }} />
    </div>
  );
}