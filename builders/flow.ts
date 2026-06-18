import * as d3 from "d3";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";
import type { ConfigBase } from "../../safecontracts/src/contracts";
import type { FlowData, FlowNode } from "../../safecontracts/src/components/flow";
import { FLOW_DEFAULTS } from "../../safecontracts/src/components/flow";
import { resolveColors } from "../../safecontracts/src/palette";
import { applyIntent, readRecord } from "../utils/util";

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/
export function createSafeFlow(svgEl: SVGSVGElement, config: ConfigBase, data: FlowData, ctx: SafeFireContext): void {
    const metadata = config.metadata;
    const WIDTH = (metadata.width as number) ?? 600;
    const HEIGHT = (metadata.height as number) ?? 350;
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
    else if (variant === "edge-bundling") renderEdgeBundling(svgEl, data, metadata, ctx);
    else if (variant === "matrix") renderMatrix(svgEl, data, metadata, ctx);
    else if (variant === "dagre") renderDagre(svgEl, data, metadata, ctx);
    else renderSankey(svgEl, data, metadata, ctx);
}

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
        .extent([
            [8, 8],
            [WIDTH - 8, HEIGHT - 8]
        ]);

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

    const chords = d3.chordDirected().padAngle(0.04).sortSubgroups(d3.descending)(matrix);

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
        n.accent ? accentColor(n, i, COLORS, svgEl) : n.group ? COLORS[(groupIdx.get(n.group) ?? 0) % COLORS.length] : COLORS[i % COLORS.length];

    const nodes = data.nodes.map((n, i) => ({ ...n, index: i }));
    const links = data.links.filter((l) => nodes.some((n) => n.name === l.source) && nodes.some((n) => n.name === l.target)).map((l) => ({ ...l }));

    const maxValue = Math.max(...links.map((l) => l.value), 1);

    const sim = d3
        .forceSimulation(nodes as any)
        .force(
            "link",
            d3
                .forceLink(links as any)
                .id((d: any) => d.name)
                .distance(linkDistance)
        )
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
    const x = d3.scalePoint(
        data.nodes.map((n) => n.name),
        [margin, WIDTH - margin]
    );
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

/*----------------------------------------------------------------------------------------------------
  *
  * New variants: edge-bundling, matrix, dagre
  *
  ----------------------------------------------------------------------------------------------------*/

function renderEdgeBundling(svgEl: SVGSVGElement, data: FlowData, metadata: Record<string, any>, ctx: SafeFireContext): void {
    const WIDTH = (metadata.width as number) ?? 600;
    const HEIGHT = (metadata.height as number) ?? 600;
    const COLORS = resolveColors(metadata);
    const linkOpacity = (metadata.linkOpacity as number) ?? 0.3;
    const showLabels = (metadata.showLabels as boolean) ?? true;

    const svg = d3.select(svgEl);
    svg.attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);

    const radius = Math.min(WIDTH, HEIGHT) / 2 - (showLabels ? 80 : 20);

    // Build hierarchy: group nodes by their group field, or put all in one root
    const groups = new Map<string, FlowNode[]>();
    for (const n of data.nodes) {
        const g = n.group ?? "root";
        if (!groups.has(g)) groups.set(g, []);
        groups.get(g)!.push(n);
    }

    const hierarchyData: any = { name: "root", children: [] };
    for (const [groupName, nodes] of groups) {
        hierarchyData.children.push({
            name: groupName,
            children: nodes.map(n => ({ name: n.name, data: n })),
        });
    }

    const root = d3.hierarchy(hierarchyData);
    const cluster = d3.cluster<any>().size([2 * Math.PI, radius]);
    cluster(root);

    const leaves = root.leaves();
    const leafByName = new Map(leaves.map(l => [l.data.name, l]));

    const g = svg.append("g").attr("transform", `translate(${WIDTH / 2},${HEIGHT / 2})`);

    // Draw bundled links
    const line = d3.lineRadial<any>()
        .curve(d3.curveBundle.beta(0.85))
        .radius(d => d.y)
        .angle(d => d.x);

    for (const link of data.links) {
        const source = leafByName.get(link.source);
        const target = leafByName.get(link.target);
        if (!source || !target) continue;
        const path = source.path(target);
        const sourceIdx = data.nodes.findIndex(n => n.name === link.source);

        g.append("path")
            .datum(path)
            .attr("d", line as any)
            .attr("fill", "none")
            .attr("stroke", COLORS[Math.max(sourceIdx, 0) % COLORS.length])
            .attr("stroke-opacity", linkOpacity)
            .attr("stroke-width", 1.5)
            .style("cursor", "pointer")
            .on("click", () => linkEvent(ctx, link.source, link.target, link.value));
    }

    // Draw nodes
    g.selectAll("circle")
        .data(leaves)
        .join("circle")
        .attr("transform", d => `rotate(${(d as any).x * 180 / Math.PI - 90}) translate(${(d as any).y}, 0)`)
        .attr("r", 3)
        .attr("fill", (d, i) => COLORS[i % COLORS.length])
        .style("cursor", "pointer")
        .on("click", (_, d) => nodeEvent(ctx, d.data.name));

    // Labels
    if (showLabels) {
        g.selectAll("text")
            .data(leaves)
            .join("text")
            .attr("transform", d => {
                const angle = (d as any).x * 180 / Math.PI - 90;
                const flip = (d as any).x > Math.PI;
                return `rotate(${angle}) translate(${(d as any).y + 8}, 0) ${flip ? "rotate(180)" : ""}`;
            })
            .attr("dy", "0.31em")
            .attr("text-anchor", d => (d as any).x > Math.PI ? "end" : "start")
            .attr("fill", "var(--sd-text)")
            .attr("font-size", 10)
            .text(d => d.data.name);
    }
}

function renderMatrix(svgEl: SVGSVGElement, data: FlowData, metadata: Record<string, any>, ctx: SafeFireContext): void {
    const COLORS = resolveColors(metadata);
    const showLabels = (metadata.showLabels as boolean) ?? true;

    const svg = d3.select(svgEl);

    const names = data.nodes.map(n => n.name);
    const n = names.length;
    const index = new Map(names.map((name, i) => [name, i]));

    // Build matrix
    const matrix: number[][] = names.map(() => names.map(() => 0));
    for (const l of data.links) {
        const s = index.get(l.source);
        const t = index.get(l.target);
        if (s != null && t != null) {
            matrix[s][t] += l.value;
            matrix[t][s] += l.value; // symmetric
        }
    }

    const maxVal = Math.max(...matrix.flat(), 1);
    const labelSpace = showLabels ? 80 : 10;
    const cellSize = Math.min(
        ((metadata.width as number) ?? 500) - labelSpace,
        ((metadata.height as number) ?? 500) - labelSpace
    ) / n;
    const WIDTH = cellSize * n + labelSpace;
    const HEIGHT = cellSize * n + labelSpace;

    svg.attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);

    const g = svg.append("g").attr("transform", `translate(${labelSpace}, ${labelSpace})`);

    // Cells
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            const val = matrix[row][col];
            const opacity = val > 0 ? 0.15 + (val / maxVal) * 0.85 : 0;
            g.append("rect")
                .attr("x", col * cellSize)
                .attr("y", row * cellSize)
                .attr("width", cellSize - 1)
                .attr("height", cellSize - 1)
                .attr("fill", val > 0 ? COLORS[row % COLORS.length] : "var(--sd-surface-raised, #f1f5f9)")
                .attr("fill-opacity", opacity)
                .attr("rx", 1)
                .style("cursor", val > 0 ? "pointer" : "default")
                .on("click", () => { if (val > 0) linkEvent(ctx, names[row], names[col], val); });
        }
    }

    // Labels
    if (showLabels) {
        // Row labels (left)
        g.selectAll(".row-label")
            .data(names)
            .join("text")
            .attr("x", -4)
            .attr("y", (_, i) => i * cellSize + cellSize / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .attr("fill", "var(--sd-text)")
            .attr("font-size", Math.min(10, cellSize - 2))
            .text(d => d);

        // Column labels (top)
        g.selectAll(".col-label")
            .data(names)
            .join("text")
            .attr("transform", (_, i) => `translate(${i * cellSize + cellSize / 2}, -4) rotate(-45)`)
            .attr("text-anchor", "start")
            .attr("fill", "var(--sd-text)")
            .attr("font-size", Math.min(10, cellSize - 2))
            .text(d => d);
    }
}

function renderDagre(svgEl: SVGSVGElement, data: FlowData, metadata: Record<string, any>, ctx: SafeFireContext): void {
    const WIDTH = (metadata.width as number) ?? 600;
    const HEIGHT = (metadata.height as number) ?? 400;
    const COLORS = resolveColors(metadata);
    const showLabels = (metadata.showLabels as boolean) ?? true;
    const nodeRadius = (metadata.nodeRadius as number) ?? 6;
    const rankdir = (metadata.rankdir as string) ?? "TB"; // TB, BT, LR, RL

    const svg = d3.select(svgEl);
    svg.attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);

    // Use dagre for layout
    let dagre: any;
    try { dagre = require("dagre"); } catch { /* fallback below */ }

    if (!dagre) {
        // Fallback: simple layered layout without dagre
        const layers = new Map<number, FlowNode[]>();
        const nodeLayer = new Map<string, number>();

        // BFS to assign layers
        const inDegree = new Map<string, number>();
        for (const n of data.nodes) inDegree.set(n.name, 0);
        for (const l of data.links) inDegree.set(l.target, (inDegree.get(l.target) ?? 0) + 1);

        const queue = data.nodes.filter(n => (inDegree.get(n.name) ?? 0) === 0);
        for (const n of queue) nodeLayer.set(n.name, 0);
        let qi = 0;
        while (qi < queue.length) {
            const current = queue[qi++];
            const layer = nodeLayer.get(current.name) ?? 0;
            for (const l of data.links.filter(lk => lk.source === current.name)) {
                if (!nodeLayer.has(l.target)) {
                    nodeLayer.set(l.target, layer + 1);
                    const targetNode = data.nodes.find(n => n.name === l.target);
                    if (targetNode) queue.push(targetNode);
                }
            }
        }
        // Nodes with no layer (cycles or disconnected) get max+1
        const maxLayer = Math.max(...nodeLayer.values(), 0);
        for (const n of data.nodes) {
            if (!nodeLayer.has(n.name)) nodeLayer.set(n.name, maxLayer + 1);
        }

        for (const n of data.nodes) {
            const l = nodeLayer.get(n.name) ?? 0;
            if (!layers.has(l)) layers.set(l, []);
            layers.get(l)!.push(n);
        }

        const numLayers = layers.size;
        const isHorizontal = rankdir === "LR" || rankdir === "RL";
        const positions = new Map<string, { x: number; y: number }>();

        for (const [layer, nodes] of layers) {
            const count = nodes.length;
            for (let i = 0; i < count; i++) {
                const primary = (layer + 0.5) / numLayers;
                const secondary = (i + 0.5) / count;
                if (isHorizontal) {
                    positions.set(nodes[i].name, { x: primary * (WIDTH - 40) + 20, y: secondary * (HEIGHT - 40) + 20 });
                } else {
                    positions.set(nodes[i].name, { x: secondary * (WIDTH - 40) + 20, y: primary * (HEIGHT - 40) + 20 });
                }
            }
        }

        // Draw links as paths with arrows
        const defs = svg.append("defs");
        defs.append("marker")
            .attr("id", "dagre-arrow")
            .attr("viewBox", "0 0 10 10")
            .attr("refX", 10).attr("refY", 5)
            .attr("markerWidth", 6).attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("fill", "var(--sd-border, #94a3b8)");

        for (const link of data.links) {
            const s = positions.get(link.source);
            const t = positions.get(link.target);
            if (!s || !t) continue;
            svg.append("line")
                .attr("x1", s.x).attr("y1", s.y)
                .attr("x2", t.x).attr("y2", t.y)
                .attr("stroke", "var(--sd-border, #94a3b8)")
                .attr("stroke-width", 1.5)
                .attr("marker-end", "url(#dagre-arrow)")
                .style("cursor", "pointer")
                .on("click", () => linkEvent(ctx, link.source, link.target, link.value));
        }

        // Draw nodes
        svg.selectAll("circle")
            .data(data.nodes)
            .join("circle")
            .attr("cx", d => positions.get(d.name)?.x ?? 0)
            .attr("cy", d => positions.get(d.name)?.y ?? 0)
            .attr("r", nodeRadius)
            .attr("fill", (d, i) => accentColor(d, i, COLORS, svgEl))
            .style("cursor", "pointer")
            .on("click", (_, d) => nodeEvent(ctx, d.name));

        if (showLabels) {
            svg.selectAll("text")
                .data(data.nodes)
                .join("text")
                .attr("x", d => positions.get(d.name)?.x ?? 0)
                .attr("y", d => (positions.get(d.name)?.y ?? 0) - nodeRadius - 4)
                .attr("text-anchor", "middle")
                .attr("fill", "var(--sd-text)")
                .attr("font-size", 10)
                .text(d => d.name);
        }
        return;
    }

    // dagre available — use it
    const graph = new dagre.graphlib.Graph();
    graph.setGraph({ rankdir, nodesep: 40, ranksep: 60 });
    graph.setDefaultEdgeLabel(() => ({}));

    for (const n of data.nodes) graph.setNode(n.name, { label: n.name, width: 60, height: 30 });
    for (const l of data.links) graph.setEdge(l.source, l.target);

    dagre.layout(graph);

    // Scale to fit SVG
    const allNodes = graph.nodes().map((id: string) => graph.node(id));
    const xExtent = d3.extent(allNodes, (n: any) => n.x) as [number, number];
    const yExtent = d3.extent(allNodes, (n: any) => n.y) as [number, number];
    const sx = (WIDTH - 40) / ((xExtent[1] - xExtent[0]) || 1);
    const sy = (HEIGHT - 40) / ((yExtent[1] - yExtent[0]) || 1);
    const scale = Math.min(sx, sy, 1);

    const gRoot = svg.append("g").attr("transform", `translate(${WIDTH / 2 - ((xExtent[0] + xExtent[1]) / 2) * scale}, ${HEIGHT / 2 - ((yExtent[0] + yExtent[1]) / 2) * scale}) scale(${scale})`);

    // Edges
    const defs = svg.append("defs");
    defs.append("marker")
        .attr("id", "dagre-arrow2")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 10).attr("refY", 5)
        .attr("markerWidth", 6).attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("fill", "var(--sd-border, #94a3b8)");

    for (const e of graph.edges()) {
        const edge = graph.edge(e);
        const sourceNode = graph.node(e.v);
        const targetNode = graph.node(e.w);
        gRoot.append("line")
            .attr("x1", sourceNode.x).attr("y1", sourceNode.y)
            .attr("x2", targetNode.x).attr("y2", targetNode.y)
            .attr("stroke", "var(--sd-border, #94a3b8)")
            .attr("stroke-width", 1.5)
            .attr("marker-end", "url(#dagre-arrow2)")
            .style("cursor", "pointer")
            .on("click", () => linkEvent(ctx, e.v, e.w, data.links.find(l => l.source === e.v && l.target === e.w)?.value ?? 0));
    }

    // Nodes
    gRoot.selectAll("circle")
        .data(data.nodes)
        .join("circle")
        .attr("cx", d => graph.node(d.name).x)
        .attr("cy", d => graph.node(d.name).y)
        .attr("r", nodeRadius)
        .attr("fill", (d, i) => accentColor(d, i, COLORS, svgEl))
        .style("cursor", "pointer")
        .on("click", (_, d) => nodeEvent(ctx, d.name));

    if (showLabels) {
        gRoot.selectAll("text")
            .data(data.nodes)
            .join("text")
            .attr("x", d => graph.node(d.name).x)
            .attr("y", d => graph.node(d.name).y - nodeRadius - 4)
            .attr("text-anchor", "middle")
            .attr("fill", "var(--sd-text)")
            .attr("font-size", 10)
            .text(d => d.name);
    }
}

/*----------------------------------------------------------------------------------------------------
  *
  * Helpers
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
