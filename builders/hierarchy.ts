import * as d3 from "d3";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import type { ConfigBase } from "../../safecontracts/src/contracts";
import { HIERARCHY_DEFAULTS } from "../../safecontracts/src/components/hierarchy";
import { resolveColors } from "../../safecontracts/src/palette";
import { elAttrs, applyIntent } from "../utils/util";
import { readList } from "../../safecontracts/src/contracts-data";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

const WIDTH = 500;
const HEIGHT = 320;

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

function buildRoot(data: Record<string, any>[], metadata: Record<string, any>): d3.HierarchyNode<any> {
    const labelField = (metadata.labelField as string) ?? HIERARCHY_DEFAULTS.labelField;
    const valueField = (metadata.valueField as string) ?? HIERARCHY_DEFAULTS.valueField;
    const idField = (metadata.idField as string) ?? HIERARCHY_DEFAULTS.idField;
    const parentField = (metadata.parentField as string) ?? HIERARCHY_DEFAULTS.parentField;

    const isFlat = data.some((d) => d[parentField] != null || d[idField] != null);
    if (isFlat) {
        const stratify = d3.stratify()
            .id((d: any) => d[idField])
            .parentId((d: any) => d[parentField]);
        const withRoot = [{ [idField]: "__root__", [parentField]: null, [labelField]: "", [valueField]: 0 },
            ...data.map((d) => ({ ...d, [parentField]: d[parentField] ?? "__root__" }))];
        return stratify(withRoot).sum((d: any) => Math.max(0, Number(d[valueField]) || 0));
    }
    return d3.hierarchy({ children: data } as any, (d: any) => d.children)
        .sum((d: any) => (d.children?.length ? 0 : Math.max(0, Number(d[valueField]) || 0)));
}

function accentFill(d: any, i: number, colors: string[], el: SVGSVGElement, accentField: string): string {
    const accent = d.data?.[accentField];
    if (accent) {
        const resolved = getComputedStyle(el).getPropertyValue(`--sd-${accent}`).trim();
        if (resolved) return resolved;
    }
    let top = d;
    while (top.depth > 1) top = top.parent;
    return colors[(top.data?.__colorIdx ?? i) % colors.length];
}

function tagTopLevel(root: d3.HierarchyNode<any>): void {
    (root.children ?? []).forEach((c: any, i: number) => { c.data.__colorIdx = i; });
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

function renderTreemap(svgEl: SVGSVGElement, root: d3.HierarchyNode<any>, metadata: Record<string, any>, ctx: SafeFireContext): void {
    const COLORS = resolveColors(metadata);
    const labelField = (metadata.labelField as string) ?? HIERARCHY_DEFAULTS.labelField;
    const valueField = (metadata.valueField as string) ?? HIERARCHY_DEFAULTS.valueField;
    const accentField = (metadata.accentField as string) ?? HIERARCHY_DEFAULTS.accentField;
    const showValues = (metadata.showValues as boolean) ?? HIERARCHY_DEFAULTS.showValues;
    const padding = (metadata.padding as number) ?? HIERARCHY_DEFAULTS.padding;

    d3.treemap().size([WIDTH, HEIGHT]).padding(padding).round(true)(root as any);
    const svg = d3.select(svgEl);
    const leaves = (root as any).leaves();

    const cells = svg.append("g").selectAll("g").data(leaves).join("g")
        .attr("transform", (d: any) => `translate(${d.x0},${d.y0})`)
        .style("cursor", "pointer")
        .on("click", (_, d: any) => ctx.fire("select", { data: d.data, value: d.value }));

    cells.append("rect")
        .attr("width", (d: any) => Math.max(0, d.x1 - d.x0))
        .attr("height", (d: any) => Math.max(0, d.y1 - d.y0))
        .attr("fill", (d: any, i) => accentFill(d, i, COLORS, svgEl, accentField))
        .attr("rx", 3)
        .attr("opacity", 0.85);

    cells.each(function (d: any) {
        const w = d.x1 - d.x0;
        const h = d.y1 - d.y0;
        if (w < 30 || h < 20) return;
        const label = d.data[labelField] ?? "";
        const el = d3.select(this as SVGGElement);
        el.append("text")
            .attr("x", 4).attr("y", 14)
            .attr("fill", "var(--sd-surface)").attr("font-size", Math.min(12, w / 6))
            .attr("font-weight", 600)
            .text(String(label).slice(0, Math.floor(w / 6)));
        if (showValues && h > 34) {
            el.append("text")
                .attr("x", 4).attr("y", 28)
                .attr("fill", "var(--sd-text)").attr("font-size", Math.min(10, w / 8))
                .text(Number(d.data[valueField] ?? d.value).toLocaleString());
        }
    });
}

function renderSunburst(svgEl: SVGSVGElement, root: d3.HierarchyNode<any>, metadata: Record<string, any>, ctx: SafeFireContext): void {
    const COLORS = resolveColors(metadata);
    const labelField = (metadata.labelField as string) ?? HIERARCHY_DEFAULTS.labelField;
    const accentField = (metadata.accentField as string) ?? HIERARCHY_DEFAULTS.accentField;
    const showValues = (metadata.showValues as boolean) ?? HIERARCHY_DEFAULTS.showValues;

    const radius = Math.min(WIDTH, HEIGHT) / 2 - 4;
    d3.partition().size([2 * Math.PI, radius])(root as any);

    const svg = d3.select(svgEl);
    const g = svg.append("g").attr("transform", `translate(${WIDTH / 2},${HEIGHT / 2})`);

    const arcGen = d3.arc<any>()
        .startAngle((d) => d.x0)
        .endAngle((d) => d.x1)
        .innerRadius((d) => d.y0)
        .outerRadius((d) => Math.max(d.y0, d.y1 - 1))
        .padAngle(0.005);

    const nodes = (root as any).descendants().filter((d: any) => d.depth > 0);

    g.selectAll("path").data(nodes).join("path")
        .attr("d", arcGen)
        .attr("fill", (d: any, i: number) => accentFill(d, i, COLORS, svgEl, accentField))
        .attr("opacity", (d: any) => 1 - (d.depth - 1) * 0.18)
        .style("cursor", "pointer")
        .on("click", (_, d: any) => ctx.fire("select", { data: d.data, value: d.value }));

    if (showValues) {
        g.selectAll("text")
            .data(nodes.filter((d: any) => (d.x1 - d.x0) > 0.25 && (d.y1 - d.y0) > 18))
            .join("text")
            .attr("transform", (d: any) => {
                const angle = ((d.x0 + d.x1) / 2) * (180 / Math.PI) - 90;
                const r = (d.y0 + d.y1) / 2;
                return `rotate(${angle}) translate(${r},0) rotate(${angle > 90 ? 180 : 0})`;
            })
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("fill", "var(--sd-surface)")
            .attr("font-size", 9)
            .text((d: any) => String(d.data[labelField] ?? "").slice(0, 12));
    }
}

function renderPack(svgEl: SVGSVGElement, root: d3.HierarchyNode<any>, metadata: Record<string, any>, ctx: SafeFireContext): void {
    const COLORS = resolveColors(metadata);
    const labelField = (metadata.labelField as string) ?? HIERARCHY_DEFAULTS.labelField;
    const accentField = (metadata.accentField as string) ?? HIERARCHY_DEFAULTS.accentField;
    const padding = (metadata.padding as number) ?? HIERARCHY_DEFAULTS.padding;

    d3.pack().size([WIDTH, HEIGHT]).padding(padding + 2)(root as any);

    const svg = d3.select(svgEl);
    const nodes = (root as any).descendants().filter((d: any) => d.depth > 0);

    const g = svg.append("g");
    g.selectAll("circle").data(nodes).join("circle")
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y)
        .attr("r", (d: any) => d.r)
        .attr("fill", (d: any, i: number) => d.children ? "var(--sd-surface-raised)" : accentFill(d, i, COLORS, svgEl, accentField))
        .attr("stroke", (d: any) => d.children ? "var(--sd-border)" : "none")
        .attr("opacity", (d: any) => d.children ? 0.6 : 0.85)
        .style("cursor", "pointer")
        .on("click", (_, d: any) => ctx.fire("select", { data: d.data, value: d.value }));

    g.selectAll("text")
        .data(nodes.filter((d: any) => !d.children && d.r > 16))
        .join("text")
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("fill", "var(--sd-surface)")
        .attr("font-size", (d: any) => Math.min(11, d.r / 2.4))
        .text((d: any) => String(d.data[labelField] ?? "").slice(0, Math.floor(d.r / 3.2)));
}

function renderIcicle(svgEl: SVGSVGElement, root: d3.HierarchyNode<any>, metadata: Record<string, any>, ctx: SafeFireContext): void {
    const COLORS = resolveColors(metadata);
    const labelField = (metadata.labelField as string) ?? HIERARCHY_DEFAULTS.labelField;
    const accentField = (metadata.accentField as string) ?? HIERARCHY_DEFAULTS.accentField;
    const padding = (metadata.padding as number) ?? HIERARCHY_DEFAULTS.padding;

    d3.partition().size([HEIGHT, WIDTH]).padding(padding / 2)(root as any);

    const svg = d3.select(svgEl);
    const nodes = (root as any).descendants().filter((d: any) => d.depth > 0);

    const cells = svg.append("g").selectAll("g").data(nodes).join("g")
        .attr("transform", (d: any) => `translate(${d.y0},${d.x0})`)
        .style("cursor", "pointer")
        .on("click", (_, d: any) => ctx.fire("select", { data: d.data, value: d.value }));

    cells.append("rect")
        .attr("width", (d: any) => Math.max(0, d.y1 - d.y0))
        .attr("height", (d: any) => Math.max(0, d.x1 - d.x0))
        .attr("fill", (d: any, i: number) => accentFill(d, i, COLORS, svgEl, accentField))
        .attr("opacity", (d: any) => 1 - (d.depth - 1) * 0.15)
        .attr("rx", 2);

    cells.filter((d: any) => (d.x1 - d.x0) > 14 && (d.y1 - d.y0) > 36)
        .append("text")
        .attr("x", 4)
        .attr("y", (d: any) => (d.x1 - d.x0) / 2)
        .attr("dy", "0.35em")
        .attr("fill", "var(--sd-surface)")
        .attr("font-size", 10)
        .attr("font-weight", 600)
        .text((d: any) => String(d.data[labelField] ?? "").slice(0, Math.floor((d.y1 - d.y0) / 7)));
}

export function createSafeHierarchy(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    // External paint state (resolved from state.json by host)
    const _selectedNode = metadata.selectedNode ?? null;

    const variant = (metadata.variant as string) ?? HIERARCHY_DEFAULTS.variant;

    const data = readList(config);

    const rootEl = document.createElement("div");
    rootEl.setAttribute("data-component", "hierarchy");
    applyIntent(rootEl, metadata);
    rootEl.setAttribute("data-variant", variant);

    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEl.style.width = "100%";
    svgEl.style.maxWidth = "600px";
    svgEl.style.display = "block";
    svgEl.setAttribute("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);
    rootEl.appendChild(svgEl);
    container.appendChild(rootEl);

    if (data.length === 0) return rootEl;

    const root = buildRoot(data, metadata);
    tagTopLevel(root);

    if (variant === "sunburst") renderSunburst(svgEl, root, metadata, ctx);
    else if (variant === "pack") renderPack(svgEl, root, metadata, ctx);
    else if (variant === "icicle") renderIcicle(svgEl, root, metadata, ctx);
    else renderTreemap(svgEl, root, metadata, ctx);

    return rootEl;
}
