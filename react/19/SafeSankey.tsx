/**
 * SafeSankey — D3 sankey flow diagram.
 * Data: { nodes: [{name}], links: [{source, target, value}] }
 * Data-attributes for host CSS. Zero Tailwind.
 */
import { useRef, useEffect } from "react";
import * as d3 from "d3";
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";
import type { ConfigBase, OnSafeEvent } from "safecomponents";
import { createSafeEvent } from "safecomponents";

export interface SafeSankeyProps {
  config: ConfigBase;
  data: { nodes: { name: string; color?: string }[]; links: { source: string; target: string; value: number }[] };
  onEvent?: OnSafeEvent;
}

import { resolveColors } from "safecomponents";

export function SafeSankey({ config, data, onEvent }: SafeSankeyProps) {
  const { metadata } = config;
  const COLORS = resolveColors(metadata);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeWidth = (metadata.nodeWidth as number) ?? 20;
  const nodePadding = (metadata.nodePadding as number) ?? 16;
  const linkOpacity = (metadata.linkOpacity as number) ?? 0.35;

  useEffect(() => {
    if (!svgRef.current || !data.nodes?.length) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 350;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    // Build node index
    const nodeIndex = new Map(data.nodes.map((n, i) => [n.name, i]));
    const nodes = data.nodes.map(n => ({ ...n }));
    const links = data.links
      .filter(l => nodeIndex.has(l.source) && nodeIndex.has(l.target))
      .map(l => ({ source: nodeIndex.get(l.source)!, target: nodeIndex.get(l.target)!, value: l.value }));

    const sankeyGen = d3Sankey()
      .nodeId((d: any) => d.index)
      .nodeWidth(nodeWidth)
      .nodePadding(nodePadding)
      .extent([[8, 8], [width - 8, height - 8]]);

    const graph = sankeyGen({ nodes: nodes as any, links: links as any });

    // Links
    svg.append("g")
      .selectAll("path")
      .data(graph.links)
      .join("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("fill", "none")
      .attr("stroke", (_, i) => COLORS[((graph.links[i] as any).source?.index ?? i) % COLORS.length])
      .attr("stroke-opacity", linkOpacity)
      .attr("stroke-width", (d: any) => Math.max(1, d.width))
      .style("cursor", "pointer")
      .on("click", (_, d: any) => onEvent?.(createSafeEvent("sankey", "link:click", { source: data.nodes[d.source.index]?.name, target: data.nodes[d.target.index]?.name, value: d.value })));

    // Nodes
    svg.append("g")
      .selectAll("rect")
      .data(graph.nodes)
      .join("rect")
      .attr("x", (d: any) => d.x0)
      .attr("y", (d: any) => d.y0)
      .attr("width", (d: any) => d.x1 - d.x0)
      .attr("height", (d: any) => Math.max(1, d.y1 - d.y0))
      .attr("fill", (d: any) => data.nodes[d.index]?.color ?? COLORS[d.index % COLORS.length])
      .attr("rx", 3)
      .style("cursor", "pointer")
      .on("click", (_, d: any) => onEvent?.(createSafeEvent("sankey", "node:click", { name: data.nodes[d.index]?.name })));

    // Labels
    svg.append("g")
      .selectAll("text")
      .data(graph.nodes)
      .join("text")
      .attr("x", (d: any) => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr("y", (d: any) => (d.y0 + d.y1) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d: any) => d.x0 < width / 2 ? "start" : "end")
      .attr("fill", "var(--sd-text)")
      .attr("font-size", 11)
      .text((d: any) => data.nodes[d.index]?.name ?? "");

  }, [data, metadata]);

  return (
    <div data-component="sankey" data-variant={(metadata.variant as string) ?? "default"}>
      <svg ref={svgRef} style={{ width: "100%", maxWidth: 700, display: "block" }} />
    </div>
  );
}