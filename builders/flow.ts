import * as d3 from "d3";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";
import type { ConfigBase } from "../../safecontracts/src/contracts";
import type { FlowData, FlowNode } from "../../safecontracts/src/components/flow";
import { FLOW_DEFAULTS } from "../../safecontracts/src/components/flow";
import { resolveColors } from "../../safecontracts/src/palette";
import { applyIntent, readRecord } from "../utils/util";

/*----------------------------------------------------------------------------------------------------
 /*----------------------------------------------------------------------------------------------------
  *
  * Implementation
  *
  ----------------------------------------------------------------------------------------------------*/

export function flowData(config: ConfigBase): FlowData {
    const inline = readRecord(config) as unknown as FlowData;
    return inline && Array.isArray(inline.nodes) ? inline : { nodes: [], links: [] };
}

function accentColor(node: FlowNode | undefined, idx: number, colors: string[], el: SVGSVGElement): string {
    if (node?.accent) {
        const resolved = getComputedStyle(el).getPropertyValue(`--sd-${node.accent}`).trim();
        if (resolved) return resolved;
    }
    return colors[idx % colors.length];
}

function nodeEvent(ctx: SafeFireContext, name: string | undefined) {
    ctx.fire("node:click", { name });
}

function linkEvent(ctx: SafeFireContext, source: string | undefined, target: string | undefined, value: number) {
    ctx.fire("link:click", { source, target, value });
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

function renderSankey(svgEl: SVGSVGElement, data: FlowData, metadata: Record<string, any>, ctx: SafeFireContext): void {
    const WIDTH = (metadata.width as number) ?? 600;
    const HEIGHT = (metadata.height as number) ?? 350;
    const COLORS = resolveColors(metadata);
    const nodeWidth = (metadata.nodeWidth as number) ?? FLOW_DEFAULTS.nodeWidth;
    const nodePadding = (metadata.nodePadding as number) ?? FLOW_DEFAULTS.nodePadding;
    const linkOpacity = (metadata.linkOpacity as number) ?? FLOW_DEFAULTS.linkOpacity;
    const showLabels = (metadata.showLabels as boolean) ?? FLOW_DEFAULTS.showLabels;

    const svg = d3.select(svgEl);
    svg.attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);

    const nodeIndex = new Map(data.nodes.map((n, i) => [n.name, i]));
    const nodes = data.nodes.map((n) => ({ ...n }));
    const links = data.links
        .filter((l) => nodeIndex.has(l.source) && nodeIndex.has(l.target))
        .map((l) => ({ source: nodeIndex.get(l.source)!, target: nodeIndex.get(l.target)!, value: l.value }));

    const sankeyGen = d3Sankey()
        .nodeId((d: any) => d.index)
        .nodeWidth(nodeWidth)
        .nodePadding(nodePadding)
        .extent([[8, 8], [WIDTH - 8, HEIGHT - 8]]);

    const graph = sankeyGen({ nodes: nodes as any, links: links as any });

    svg.append("g")
        .selectAll("path")
        .data(graph.links)
        .join("path")
        .attr("d", sankeyLinkHorizontal())
        .attr("fill", "none")
        .attr("stroke", (d: any) => accentColor(data.nodes[d.source.index], d.source.index, COLORS, svgEl))
        .attr("stroke-opacity", linkOpacity)
        .attr("stroke-width", (d: any) => Math.max(1, d.width))
        .style("cursor", "pointer")
        .on("click", (_, d: any) => linkEvent(ctx, data.nodes[d.source.index]?.name, data.nodes[d.target.index]?.name, d.value));

    svg.append("g")
        .selectAll("rect")
        .data(graph.nodes)
        .join("rect")
        .attr("x", (d: any) => d.x0)
        .attr("y", (d: any) => d.y0)
        .attr("width", (d: any) => d.x1 - d.x0)
        .attr("height", (d: any) => Math.max(1, d.y1 - d.y0))
        .attr("fill", (d: any) => accentColor(data.nodes[d.index], d.index, COLORS, svgEl))
        .attr("rx", 3)
        .style("cursor", "pointer")
        .on("click", (_, d: any) => nodeEvent(ctx, data.nodes[d.index]?.name));

    if (showLabels) {
        svg.append("g")
            .selectAll("text")
            .data(graph.nodes)
            .join("text")
            .attr("x", (d: any) => (d.x0 < WIDTH / 2 ? d.x1 + 6 : d.x0 - 6))
            .attr("y", (d: any) => (d.y0 + d.y1) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", (d: any) => (d.x0 < WIDTH / 2 ? "start" : "end"))
            .attr("fill", "var(--sd-text)")
            .attr("font-size", 11)
            .text((d: any) => data.nodes[d.index]?.name ?? "");
    }
}

function renderChord(svgEl: SVGSVGElement, data: FlowData, metadata: Record<string, any>, ctx: SafeFireContext): void {
    const WIDTH = (metadata.width as number) ?? 600;
    const HEIGHT = (metadata.height as number) ?? 350;
    const COLORS = resolveColors(metadata);
    const linkOpacity = (metadata.linkOpacity as number) ?? FLOW_DEFAULTS.linkOpacity;
    const showLabels = (metadata.showLabels as boolean) ?? FLOW_DEFAULTS.showLabels;

    const svg = d3.select(svgEl);
    svg.attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);

    const names = data.nodes.map((n) => n.name);
    const index = new Map(names.map((n, i) => [n, i]));
    const matrix: number[][] = names.map(() => names.map(() => 0));
    for (const l of data.links) {
        const s = index.get(l.source);
        const t = index.get(l.target);
        if (s != null && t != null) matrix[s][t] += l.value;
    }

    const outerRadius = Math.min(WIDTH, HEIGHT) / 2 - (showLabels ? 42 : 12);
    const innerRadius = outerRadius - 12;

    const chords = d3.chordDirected()
        .padAngle(0.04)
        .sortSubgroups(d3.descending)(matrix);

    const g = svg.append("g").attr("transform", `translate(${WIDTH / 2},${HEIGHT / 2})`);

    const arcGen = d3.arc<d3.ChordGroup>().innerRadius(innerRadius).outerRadius(outerRadius);
    const ribbonGen = d3.ribbonArrow<d3.Chord, d3.ChordSubgroup>().radius(innerRadius - 2);

    g.append("g")
        .selectAll("path")
        .data(chords.groups)
        .join("path")
        .attr("d", arcGen as any)
        .attr("fill", (d) => accentColor(data.nodes[d.index], d.index, COLORS, svgEl))
        .style("cursor", "pointer")
        .on("click", (_, d) => nodeEvent(ctx, names[d.index]));

    g.append("g")
        .selectAll("path")
        .data(chords)
        .join("path")
        .attr("d", ribbonGen as any)
        .attr("fill", (d) => accentColor(data.nodes[d.source.index], d.source.index, COLORS, svgEl))
        .attr("fill-opacity", linkOpacity + 0.15)
        .style("cursor", "pointer")
        .on("click", (_, d) => linkEvent(ctx, names[d.source.index], names[d.target.index], matrix[d.source.index][d.target.index]));

    if (showLabels) {
        g.append("g")
            .selectAll("text")
            .data(chords.groups)
            .join("text")
            .attr("transform", (d) => {
                const angle = (d.startAngle + d.endAngle) / 2;
                const rotate = (angle * 180) / Math.PI - 90;
                return `rotate(${rotate}) translate(${outerRadius + 6}) ${angle > Math.PI ? "rotate(180)" : ""}`;
            })
            .attr("dy", "0.35em")
            .attr("text-anchor", (d) => ((d.startAngle + d.endAngle) / 2 > Math.PI ? "end" : "start"))
            .attr("fill", "var(--sd-text)")
            .attr("font-size", 10)
            .text((d) => names[d.index]);
    }
}

function renderForce(svgEl: SVGSVGElement, data: FlowData, metadata: Record<string, any>, ctx: SafeFireContext): void {
    const WIDTH = (metadata.width as number) ?? 600;
    const HEIGHT = (metadata.height as number) ?? 350;
    const COLORS = resolveColors(metadata);
    const linkOpacity = (metadata.linkOpacity as number) ?? FLOW_DEFAULTS.linkOpacity;
    const showLabels = (metadata.showLabels as boolean) ?? FLOW_DEFAULTS.showLabels;
    const nodeRadius = (metadata.nodeRadius as number) ?? FLOW_DEFAULTS.nodeRadius;
    const linkDistance = (metadata.linkDistance as number) ?? FLOW_DEFAULTS.linkDistance;

    const svg = d3.select(svgEl);
    svg.attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);

    const groups = [...new Set(data.nodes.map((n) => n.group).filter(Boolean))] as string[];
    const groupIdx = new Map(groups.map((gName, i) => [gName, i]));
    const colorFor = (n: FlowNode, i: number) =>
        n.accent ? accentColor(n, i, COLORS, svgEl)
        : n.group ? COLORS[(groupIdx.get(n.group) ?? 0) % COLORS.length]
        : COLORS[i % COLORS.length];

    const nodes = data.nodes.map((n, i) => ({ ...n, index: i }));
    const links = data.links
        .filter((l) => nodes.some((n) => n.name === l.source) && nodes.some((n) => n.name === l.target))
        .map((l) => ({ ...l }));

    const maxValue = Math.max(...links.map((l) => l.value), 1);

    const sim = d3.forceSimulation(nodes as any)
        .force("link", d3.forceLink(links as any).id((d: any) => d.name).distance(linkDistance))
        .force("charge", d3.forceManyBody().strength(-180))
        .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
        .force("collide", d3.forceCollide(nodeRadius + 4))
        .stop();
    sim.tick(160);

    svg.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)
        .attr("stroke", "var(--sd-border)")
        .attr("stroke-opacity", linkOpacity + 0.25)
        .attr("stroke-width", (d: any) => Math.max(1, (d.value / maxValue) * 5))
        .style("cursor", "pointer")
        .on("click", (_, d: any) => linkEvent(ctx, d.source.name, d.target.name, d.value));

    svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y)
        .attr("r", nodeRadius)
        .attr("fill", (d: any, i) => colorFor(d, i))
        .style("cursor", "pointer")
        .on("click", (_, d: any) => nodeEvent(ctx, d.name));

    if (showLabels) {
        svg.append("g")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .attr("x", (d: any) => d.x)
            .attr("y", (d: any) => d.y - nodeRadius - 4)
            .attr("text-anchor", "middle")
            .attr("fill", "var(--sd-text)")
            .attr("font-size", 10)
            .text((d: any) => d.name);
    }
}

function renderArc(svgEl: SVGSVGElement, data: FlowData, metadata: Record<string, any>, ctx: SafeFireContext): void {
    const WIDTH = (metadata.width as number) ?? 600;
    const HEIGHT = (metadata.height as number) ?? 350;
    const COLORS = resolveColors(metadata);
    const linkOpacity = (metadata.linkOpacity as number) ?? FLOW_DEFAULTS.linkOpacity;
    const showLabels = (metadata.showLabels as boolean) ?? FLOW_DEFAULTS.showLabels;
    const nodeRadius = (metadata.nodeRadius as number) ?? FLOW_DEFAULTS.nodeRadius;

    const svg = d3.select(svgEl);
    svg.attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);

    const margin = 40;
    const baseline = HEIGHT - (showLabels ? 70 : 30);
    const x = d3.scalePoint(data.nodes.map((n) => n.name), [margin, WIDTH - margin]);
    const maxValue = Math.max(...data.links.map((l) => l.value), 1);

    svg.append("g")
        .selectAll("path")
        .data(data.links.filter((l) => x(l.source) != null && x(l.target) != null))
        .join("path")
        .attr("d", (d) => {
            const x1 = x(d.source)!;
            const x2 = x(d.target)!;
            const r = Math.abs(x2 - x1) / 2;
            return `M ${x1} ${baseline} A ${r} ${r} 0 0 ${x1 < x2 ? 1 : 0} ${x2} ${baseline}`;
        })
        .attr("fill", "none")
        .attr("stroke", (d) => {
            const i = data.nodes.findIndex((n) => n.name === d.source);
            return accentColor(data.nodes[i], Math.max(i, 0), COLORS, svgEl);
        })
        .attr("stroke-opacity", linkOpacity + 0.15)
        .attr("stroke-width", (d) => Math.max(1, (d.value / maxValue) * 6))
        .style("cursor", "pointer")
        .on("click", (_, d) => linkEvent(ctx, d.source, d.target, d.value));

    svg.append("g")
        .selectAll("circle")
        .data(data.nodes)
        .join("circle")
        .attr("cx", (d) => x(d.name)!)
        .attr("cy", baseline)
        .attr("r", nodeRadius)
        .attr("fill", (d, i) => accentColor(d, i, COLORS, svgEl))
        .style("cursor", "pointer")
        .on("click", (_, d) => nodeEvent(ctx, d.name));

    if (showLabels) {
        svg.append("g")
            .selectAll("text")
            .data(data.nodes)
            .join("text")
            .attr("transform", (d) => `translate(${x(d.name)!},${baseline + nodeRadius + 6}) rotate(35)`)
            .attr("text-anchor", "start")
            .attr("fill", "var(--sd-text)")
            .attr("font-size", 10)
            .text((d) => d.name);
    }
}

export function renderSafeFlow(
    svgEl: SVGSVGElement,
    config: ConfigBase,
    data: FlowData,
    ctx: SafeFireContext,
): void {
    const WIDTH = (metadata.width as number) ?? 600;
    const HEIGHT = (metadata.height as number) ?? 350;
    const metadata = config.metadata;
    // External paint state (resolved from state.json by host)
    const _selectedNode = metadata.selectedNode ?? null;

    const variant = (metadata.variant as string) ?? FLOW_DEFAULTS.variant;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();
    svgEl.setAttribute("data-component", "flow");
    applyIntent(svgEl, metadata);
    svgEl.setAttribute("data-variant", variant);

    if (!data.nodes?.length) return;

    if (variant === "chord") renderChord(svgEl, data, metadata, ctx);
    else if (variant === "force") renderForce(svgEl, data, metadata, ctx);
    else if (variant === "arc") renderArc(svgEl, data, metadata, ctx);
    else renderSankey(svgEl, data, metadata, ctx);
}
