import * as d3 from "d3";
import { el } from "../utils/util";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import { getDataSource } from "../../safecontracts/src/contracts";
import type { ConfigBase } from "../../safecontracts/src/contracts";
import { sortBy } from "../../safecontracts/src/contracts-operations";
import { resolveColors } from "../../safecontracts/src/palette";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

export function timelineData(config: ConfigBase): Record<string, any>[] {
    const ds = getDataSource(config);
    const raw = ds?.inline;
    return Array.isArray(raw) ? raw : [];
}

function getCategoryColor(categories: string[], cat: string, colors: string[]): string {
    const idx = categories.indexOf(cat);
    return colors[idx % colors.length];
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeTimeline(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    const COLORS = resolveColors(metadata);
    const variant = (metadata.variant as string) ?? "default";
    const dateField = metadata.dateField as string;
    const labelField = metadata.labelField as string;
    const descriptionField = metadata.descriptionField as string | undefined;
    const categoryField = metadata.categoryField as string | undefined;
    const iconField = metadata.iconField as string | undefined;
    const endDateField = metadata.endDateField as string | undefined;
    const sortDir = (metadata.sortDir as string) ?? "desc";

    const data = timelineData(config);
    const sorted = sortBy(data, dateField, (sortDir === "asc" ? "asc" : "desc"));

    const categories: string[] = [];
    if (categoryField) {
        const set = new Set<string>();
        for (const d of sorted) { const c = d[categoryField]; if (c) set.add(String(c)); }
        categories.push(...set);
    }

    const fireSelect = (index: number, item: Record<string, any>) => {
        ctx.fire("select", { index, data: item });
    };

    const root = el("div");
    root.setAttribute("data-component", "timeline");
    root.setAttribute("data-variant", variant);

    if (variant === "horizontal" || variant === "swimlane" || variant === "gantt") {
        root.style.width = "100%";
        root.style.overflowX = "auto";
        const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgEl.style.width = "100%";
        if (variant === "horizontal") svgEl.style.minWidth = "600px";
        svgEl.style.display = "block";
        root.appendChild(svgEl);
        const svg = d3.select(svgEl);

        if (variant === "horizontal") {
            const width = Math.max(600, sorted.length * 120);
            const height = 200;
            svg.attr("viewBox", `0 0 ${width} ${height}`);

            const x = d3.scalePoint()
                .domain(sorted.map((_, i) => String(i)))
                .range([60, width - 60]);

            svg.append("line")
                .attr("x1", 60).attr("y1", 80).attr("x2", width - 60).attr("y2", 80)
                .attr("stroke", "var(--sd-border)").attr("stroke-width", 2);

            sorted.forEach((d, i) => {
                const cx = x(String(i))!;
                const above = i % 2 === 0;
                const cat = categoryField ? String(d[categoryField] ?? "") : "";
                const color = cat ? getCategoryColor(categories, cat, COLORS) : COLORS[i % COLORS.length];

                svg.append("circle")
                    .attr("cx", cx).attr("cy", 80).attr("r", 6)
                    .attr("fill", color).attr("stroke", "var(--sd-surface)").attr("stroke-width", 2)
                    .style("cursor", "pointer")
                    .on("click", () => fireSelect(i, d));

                svg.append("line")
                    .attr("x1", cx).attr("y1", 80)
                    .attr("x2", cx).attr("y2", above ? 40 : 120)
                    .attr("stroke", "var(--sd-border)").attr("stroke-width", 1);

                const icon = iconField ? String(d[iconField] ?? "") : "";
                if (icon) {
                    svg.append("text")
                        .attr("x", cx).attr("y", above ? 28 : 140)
                        .attr("text-anchor", "middle").attr("font-size", 14)
                        .text(icon);
                }

                svg.append("text")
                    .attr("x", cx).attr("y", above ? (icon ? 16 : 28) : (icon ? 156 : 140))
                    .attr("text-anchor", "middle")
                    .attr("fill", "var(--sd-text)").attr("font-size", 10).attr("font-weight", 600)
                    .text(String(d[labelField] ?? "").slice(0, 20));

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

            categories.forEach((cat, li) => {
                const y = li * (laneHeight + laneGap) + 20;
                const color = getCategoryColor(categories, cat, COLORS);

                svg.append("rect")
                    .attr("x", labelW + 10).attr("y", y)
                    .attr("width", width - labelW - 30).attr("height", laneHeight)
                    .attr("rx", 4).attr("fill", "var(--sd-surface-raised)").attr("opacity", 0.5);

                svg.append("text")
                    .attr("x", labelW).attr("y", y + laneHeight / 2)
                    .attr("text-anchor", "end").attr("dy", "0.35em")
                    .attr("fill", color).attr("font-size", 10).attr("font-weight", 600)
                    .text(cat);

                const laneItems = sorted.filter(d => String(d[categoryField ?? ""] ?? "") === cat);
                laneItems.forEach((d, ei) => {
                    const cx = x(new Date(d[dateField]).getTime());
                    const icon = iconField ? String(d[iconField] ?? "") : "";

                    svg.append("circle")
                        .attr("cx", cx).attr("cy", y + laneHeight / 2).attr("r", 8)
                        .attr("fill", color).attr("stroke", "var(--sd-surface)").attr("stroke-width", 2)
                        .style("cursor", "pointer")
                        .on("click", () => fireSelect(ei, d));

                    if (icon) {
                        svg.append("text")
                            .attr("x", cx).attr("y", y + laneHeight / 2)
                            .attr("text-anchor", "middle").attr("dy", "0.35em").attr("font-size", 10)
                            .style("pointer-events", "none")
                            .text(icon);
                    }

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

                if (i % 2 === 0) {
                    svg.append("rect")
                        .attr("x", 0).attr("y", y)
                        .attr("width", width).attr("height", rowH)
                        .attr("fill", "var(--sd-surface-raised)").attr("opacity", 0.3);
                }

                svg.append("text")
                    .attr("x", 8).attr("y", y + rowH / 2)
                    .attr("dy", "0.35em")
                    .attr("fill", "var(--sd-text)").attr("font-size", 11).attr("font-weight", 500)
                    .text(`${icon} ${String(d[labelField] ?? "")}`.trim().slice(0, 22));

                const barX = x(start);
                const barW = Math.max(8, x(end) - x(start));
                svg.append("rect")
                    .attr("x", barX).attr("y", y + 6)
                    .attr("width", 0).attr("height", rowH - 12)
                    .attr("rx", 4).attr("fill", color).attr("opacity", 0.85)
                    .style("cursor", "pointer")
                    .on("click", () => fireSelect(i, d))
                    .transition().duration(600).delay(i * 50)
                    .attr("width", barW);
            });

            const axis = d3.axisTop(d3.scaleTime().domain([new Date(minDate), new Date(maxDate)]).range([labelW + 10, width - 20]))
                .ticks(6).tickFormat(d3.timeFormat("%b %d") as any);
            svg.append("g")
                .attr("transform", `translate(0, 16)`)
                .call(axis)
                .selectAll("text").attr("fill", "var(--sd-text-dim)").attr("font-size", 8);
            svg.selectAll(".domain").attr("stroke", "var(--sd-border)");
            svg.selectAll(".tick line").attr("stroke", "var(--sd-border)");
        }

        container.appendChild(root);
        return root;
    }

    if (variant === "alternating") {
        root.appendChild(el("div", "center-line"));
        sorted.forEach((item, i) => {
            const isLeft = i % 2 === 0;
            const cat = categoryField ? String(item[categoryField] ?? "") : "";
            const color = cat ? getCategoryColor(categories, cat, COLORS) : COLORS[i % COLORS.length];
            const icon = iconField ? String(item[iconField] ?? "") : "";
            const desc = descriptionField ? String(item[descriptionField] ?? "") : "";

            const row = el("div", "alt-row");
            row.setAttribute("data-side", isLeft ? "left" : "right");
            row.onclick = () => fireSelect(i, item);

            const dot = el("div", "alt-dot");
            dot.style.background = color;
            row.appendChild(dot);

            const content = el("div", "alt-content");
            content.appendChild(el("div", "date", String(item[dateField])));
            content.appendChild(el("div", "label", `${icon} ${String(item[labelField] ?? "")}`));
            if (cat) {
                const catEl = el("div", "category", cat);
                catEl.style.color = color;
                content.appendChild(catEl);
            }
            if (desc) content.appendChild(el("div", "description", desc));
            row.appendChild(content);
            root.appendChild(row);
        });

        container.appendChild(root);
        return root;
    }

    sorted.forEach((item, i) => {
        const cat = categoryField ? String(item[categoryField] ?? "") : "";
        const color = cat ? getCategoryColor(categories, cat, COLORS) : COLORS[i % COLORS.length];
        const icon = iconField ? String(item[iconField] ?? "") : "";
        const desc = descriptionField ? String(item[descriptionField] ?? "") : "";

        const event = el("div", "event");
        event.onclick = () => fireSelect(i, item);

        const marker = el("div", "marker");
        if (icon) {
            marker.appendChild(el("span", "icon", icon));
        } else {
            const dot = el("span", "dot");
            dot.style.background = color;
            marker.appendChild(dot);
        }
        if (i < sorted.length - 1) marker.appendChild(el("span", "line"));
        event.appendChild(marker);

        const content = el("div", "content");
        content.appendChild(el("div", "date", String(item[dateField])));
        content.appendChild(el("div", "label", String(item[labelField] ?? "")));
        if (cat) {
            const catEl = el("div", "category", cat);
            catEl.style.color = color;
            content.appendChild(catEl);
        }
        if (desc) content.appendChild(el("div", "description", desc));
        event.appendChild(content);

        root.appendChild(event);
    });

    container.appendChild(root);
    return root;
}

export function initSafeTimelines(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-timeline-config]").forEach((host) => {
        if (host.dataset.timelineMounted) return;
        host.dataset.timelineMounted = "1";
        const config = JSON.parse(host.dataset.timelineConfig!) as ConfigBase;
        createSafeTimeline(host, config);
    });
}