/**
 * SafeTimeline — D3-powered timeline with 5 visual variants.
 * Data-attributes for host CSS. Zero Tailwind.
 */
import { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";
import type { ConfigBase, OnSafeEvent } from "safecomponents";
import { createSafeEvent } from "safecomponents";

export interface SafeTimelineProps {
  config: ConfigBase;
  data: Record<string, any>[];
  onEvent?: OnSafeEvent;
}

import { resolveColors } from "safecomponents";

function getCategoryColor(categories: string[], cat: string, colors: string[]): string {
  const idx = categories.indexOf(cat);
  return colors[idx % colors.length];
}

export function SafeTimeline({ config, data, onEvent }: SafeTimelineProps) {
  const { metadata } = config;
  const COLORS = resolveColors(metadata);
  const variant = (metadata.variant as string) ?? "default";
  const dateField = metadata.dateField as string;
  const labelField = metadata.labelField as string;
  const descriptionField = metadata.descriptionField as string | undefined;
  const categoryField = metadata.categoryField as string | undefined;
  const iconField = metadata.iconField as string | undefined;
  const endDateField = metadata.endDateField as string | undefined;
  const sortDir = (metadata.sortDir as string) ?? "desc";

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const da = new Date(a[dateField]).getTime();
      const db = new Date(b[dateField]).getTime();
      return sortDir === "asc" ? da - db : db - da;
    });
  }, [data, dateField, sortDir]);

  const categories = useMemo(() => {
    if (!categoryField) return [];
    const set = new Set<string>();
    for (const d of sorted) { const c = d[categoryField]; if (c) set.add(String(c)); }
    return [...set];
  }, [sorted, categoryField]);

  const svgRef = useRef<SVGSVGElement>(null);

  // D3 variants: horizontal, swimlane, gantt
  useEffect(() => {
    if (!svgRef.current) return;
    if (variant !== "horizontal" && variant !== "swimlane" && variant !== "gantt") return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (variant === "horizontal") {
      const width = Math.max(600, sorted.length * 120);
      const height = 200;
      svg.attr("viewBox", `0 0 ${width} ${height}`);

      const x = d3.scalePoint()
        .domain(sorted.map((_, i) => String(i)))
        .range([60, width - 60]);

      // Line
      svg.append("line")
        .attr("x1", 60).attr("y1", 80).attr("x2", width - 60).attr("y2", 80)
        .attr("stroke", "var(--sd-border)").attr("stroke-width", 2);

      sorted.forEach((d, i) => {
        const cx = x(String(i))!;
        const above = i % 2 === 0;
        const cat = categoryField ? String(d[categoryField] ?? "") : "";
        const color = cat ? getCategoryColor(categories, cat, COLORS) : COLORS[i % COLORS.length];

        // Dot
        svg.append("circle")
          .attr("cx", cx).attr("cy", 80).attr("r", 6)
          .attr("fill", color).attr("stroke", "var(--sd-surface)").attr("stroke-width", 2)
          .style("cursor", "pointer")
          .on("click", () => onEvent?.(createSafeEvent("timeline", "select", { index: i, data: d })));

        // Stem
        svg.append("line")
          .attr("x1", cx).attr("y1", 80)
          .attr("x2", cx).attr("y2", above ? 40 : 120)
          .attr("stroke", "var(--sd-border)").attr("stroke-width", 1);

        // Icon
        const icon = iconField ? String(d[iconField] ?? "") : "";
        if (icon) {
          svg.append("text")
            .attr("x", cx).attr("y", above ? 28 : 140)
            .attr("text-anchor", "middle").attr("font-size", 14)
            .text(icon);
        }

        // Label
        svg.append("text")
          .attr("x", cx).attr("y", above ? (icon ? 16 : 28) : (icon ? 156 : 140))
          .attr("text-anchor", "middle")
          .attr("fill", "var(--sd-text)").attr("font-size", 10).attr("font-weight", 600)
          .text(String(d[labelField] ?? "").slice(0, 20));

        // Date
        svg.append("text")
          .attr("x", cx).attr("y", above ? (icon ? 4 : 16) : (icon ? 168 : 152))
          .attr("text-anchor", "middle")
          .attr("fill", "var(--sd-text-dim)").attr("font-size", 8)
          .text(String(d[dateField] ?? "").slice(0, 10));
      });
    }

    if (variant === "swimlane") {
      const laneHeight = 36;
      const laneGap = 4;
      const labelW = 100;
      const width = 700;
      const height = categories.length * (laneHeight + laneGap) + 40;
      svg.attr("viewBox", `0 0 ${width} ${height}`);

      const dates = sorted.map(d => new Date(d[dateField]).getTime());
      const minDate = Math.min(...dates);
      const maxDate = Math.max(...dates);
      const x = d3.scaleLinear().domain([minDate, maxDate]).range([labelW + 20, width - 20]);

      // Lanes
      categories.forEach((cat, li) => {
        const y = li * (laneHeight + laneGap) + 20;
        const color = getCategoryColor(categories, cat, COLORS);

        // Lane bg
        svg.append("rect")
          .attr("x", labelW + 10).attr("y", y)
          .attr("width", width - labelW - 30).attr("height", laneHeight)
          .attr("rx", 4).attr("fill", "var(--sd-surface-raised)").attr("opacity", 0.5);

        // Lane label
        svg.append("text")
          .attr("x", labelW).attr("y", y + laneHeight / 2)
          .attr("text-anchor", "end").attr("dy", "0.35em")
          .attr("fill", color).attr("font-size", 10).attr("font-weight", 600)
          .text(cat);

        // Events in this lane
        const laneItems = sorted.filter(d => String(d[categoryField ?? ""] ?? "") === cat);
        laneItems.forEach((d, ei) => {
          const cx = x(new Date(d[dateField]).getTime());
          const icon = iconField ? String(d[iconField] ?? "") : "";

          svg.append("circle")
            .attr("cx", cx).attr("cy", y + laneHeight / 2).attr("r", 8)
            .attr("fill", color).attr("stroke", "var(--sd-surface)").attr("stroke-width", 2)
            .style("cursor", "pointer")
            .on("click", () => onEvent?.(createSafeEvent("timeline", "select", { index: ei, data: d })));

          if (icon) {
            svg.append("text")
              .attr("x", cx).attr("y", y + laneHeight / 2)
              .attr("text-anchor", "middle").attr("dy", "0.35em").attr("font-size", 10)
              .style("pointer-events", "none")
              .text(icon);
          }

          // Tooltip on hover
          const g = svg.append("g").attr("opacity", 0).style("pointer-events", "none");
          g.append("rect")
            .attr("x", cx - 60).attr("y", y - 22)
            .attr("width", 120).attr("height", 18)
            .attr("rx", 3).attr("fill", "var(--sd-surface-overlay)");
          g.append("text")
            .attr("x", cx).attr("y", y - 10)
            .attr("text-anchor", "middle").attr("fill", "var(--sd-text)").attr("font-size", 9)
            .text(String(d[labelField] ?? "").slice(0, 22));

          svg.select(() => g.node()!.previousSibling as any)
            .on("mouseenter", () => g.attr("opacity", 1))
            .on("mouseleave", () => g.attr("opacity", 0));
        });
      });
    }

    if (variant === "gantt") {
      const rowH = 32;
      const labelW = 140;
      const width = 700;
      const height = sorted.length * rowH + 40;
      svg.attr("viewBox", `0 0 ${width} ${height}`);

      const dates = sorted.flatMap(d => {
        const s = new Date(d[dateField]).getTime();
        const e = endDateField && d[endDateField] ? new Date(d[endDateField]).getTime() : s + 86400000 * 7;
        return [s, e];
      });
      const minDate = Math.min(...dates);
      const maxDate = Math.max(...dates);
      const x = d3.scaleLinear().domain([minDate, maxDate]).range([labelW + 10, width - 20]);

      sorted.forEach((d, i) => {
        const y = i * rowH + 20;
        const start = new Date(d[dateField]).getTime();
        const end = endDateField && d[endDateField] ? new Date(d[endDateField]).getTime() : start + 86400000 * 7;
        const cat = categoryField ? String(d[categoryField] ?? "") : "";
        const color = cat ? getCategoryColor(categories, cat, COLORS) : COLORS[i % COLORS.length];
        const icon = iconField ? String(d[iconField] ?? "") : "";

        // Row bg
        if (i % 2 === 0) {
          svg.append("rect")
            .attr("x", 0).attr("y", y)
            .attr("width", width).attr("height", rowH)
            .attr("fill", "var(--sd-surface-raised)").attr("opacity", 0.3);
        }

        // Label
        svg.append("text")
          .attr("x", 8).attr("y", y + rowH / 2)
          .attr("dy", "0.35em")
          .attr("fill", "var(--sd-text)").attr("font-size", 11).attr("font-weight", 500)
          .text(`${icon} ${String(d[labelField] ?? "")}`.trim().slice(0, 22));

        // Bar
        const barX = x(start);
        const barW = Math.max(8, x(end) - x(start));
        svg.append("rect")
          .attr("x", barX).attr("y", y + 6)
          .attr("width", 0).attr("height", rowH - 12)
          .attr("rx", 4).attr("fill", color).attr("opacity", 0.85)
          .style("cursor", "pointer")
          .on("click", () => onEvent?.(createSafeEvent("timeline", "select", { index: i, data: d })))
          .transition().duration(600).delay(i * 50)
          .attr("width", barW);
      });

      // Time axis at top
      const axis = d3.axisTop(d3.scaleTime().domain([new Date(minDate), new Date(maxDate)]).range([labelW + 10, width - 20]))
        .ticks(6).tickFormat(d3.timeFormat("%b %d") as any);
      svg.append("g")
        .attr("transform", `translate(0, 16)`)
        .call(axis)
        .selectAll("text").attr("fill", "var(--sd-text-dim)").attr("font-size", 8);
      svg.selectAll(".domain").attr("stroke", "var(--sd-border)");
      svg.selectAll(".tick line").attr("stroke", "var(--sd-border)");
    }
  }, [sorted, variant, metadata]);

  // D3 variants render in SVG
  if (variant === "horizontal" || variant === "swimlane" || variant === "gantt") {
    return (
      <div data-component="timeline" data-variant={variant} style={{ width: "100%", overflowX: "auto" }}>
        <svg ref={svgRef} style={{ width: "100%", minWidth: variant === "horizontal" ? 600 : undefined, display: "block" }} />
      </div>
    );
  }

  // Alternating variant — HTML, left/right zigzag
  if (variant === "alternating") {
    return (
      <div data-component="timeline" data-variant="alternating">
        <div data-role="center-line" />
        {sorted.map((item, i) => {
          const isLeft = i % 2 === 0;
          const cat = categoryField ? String(item[categoryField] ?? "") : "";
          const color = cat ? getCategoryColor(categories, cat, COLORS) : COLORS[i % COLORS.length];
          const icon = iconField ? String(item[iconField] ?? "") : "";
          const desc = descriptionField ? String(item[descriptionField] ?? "") : "";

          return (
            <div key={i} data-role="alt-row" data-side={isLeft ? "left" : "right"}
              onClick={() => onEvent?.(createSafeEvent("timeline", "select", { index: i, data: item }))}>
              <div data-role="alt-dot" style={{ background: color }} />
              <div data-role="alt-content">
                <div data-role="date">{String(item[dateField])}</div>
                <div data-role="label">{icon} {String(item[labelField] ?? "")}</div>
                {cat && <div data-role="category" style={{ color }}>{cat}</div>}
                {desc && <div data-role="description">{desc}</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Default variant — vertical
  return (
    <div data-component="timeline" data-variant={variant}>
      {sorted.map((item, i) => {
        const cat = categoryField ? String(item[categoryField] ?? "") : "";
        const color = cat ? getCategoryColor(categories, cat, COLORS) : COLORS[i % COLORS.length];
        const icon = iconField ? String(item[iconField] ?? "") : "";
        const desc = descriptionField ? String(item[descriptionField] ?? "") : "";

        return (
          <div key={i} data-role="event" onClick={() => onEvent?.(createSafeEvent("timeline", "select", { index: i, data: item }))}>
            <div data-role="marker">
              {icon ? <span data-role="icon">{icon}</span> : <span data-role="dot" style={{ background: color }} />}
              {i < sorted.length - 1 && <span data-role="line" />}
            </div>
            <div data-role="content">
              <div data-role="date">{String(item[dateField])}</div>
              <div data-role="label">{String(item[labelField] ?? "")}</div>
              {cat && <div data-role="category" style={{ color }}>{cat}</div>}
              {desc && <div data-role="description">{desc}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}