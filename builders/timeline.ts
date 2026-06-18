import * as d3 from "d3";
import { el, applyPaintState, applyIntent, readList } from "../utils/util";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import type { ConfigBase } from "../../safecontracts/src/contracts";
import { sortBy } from "../../safecontracts/src/contracts-operations";
import { resolveColors } from "../../safecontracts/src/palette";

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
    const sorted = sortBy(data, dateField, sortDir === "asc" ? "asc" : "desc");

    const categories: string[] = [];
    if (categoryField) {
        const set = new Set<string>();
        for (const d of sorted) {
            const c = d[categoryField];
            if (c) set.add(String(c));
        }
        categories.push(...set);
    }

    const fireSelect = (index: number, item: Record<string, any>) => {
        ctx.fire("select", { index, data: item });
    };

    const root = el("div");
    root.setAttribute("data-component", "timeline");
    applyIntent(root, metadata);
    applyPaintState(root, metadata, "timeline");

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

            const x = d3
                .scalePoint()
                .domain(sorted.map((_, i) => String(i)))
                .range([60, width - 60]);

            svg.append("line")
                .attr("x1", 60)
                .attr("y1", 80)
                .attr("x2", width - 60)
                .attr("y2", 80)
                .attr("stroke", "var(--sd-border)")
                .attr("stroke-width", 2);

            sorted.forEach((d, i) => {
                const cx = x(String(i))!;
                const above = i % 2 === 0;
                const cat = categoryField ? String(d[categoryField] ?? "") : "";
                const color = cat ? getCategoryColor(categories, cat, COLORS) : COLORS[i % COLORS.length];

                svg.append("circle")
                    .attr("cx", cx)
                    .attr("cy", 80)
                    .attr("r", 6)
                    .attr("fill", color)
                    .attr("stroke", "var(--sd-surface)")
                    .attr("stroke-width", 2)
                    .style("cursor", "pointer")
                    .on("click", () => fireSelect(i, d));

                svg.append("line")
                    .attr("x1", cx)
                    .attr("y1", 80)
                    .attr("x2", cx)
                    .attr("y2", above ? 40 : 120)
                    .attr("stroke", "var(--sd-border)")
                    .attr("stroke-width", 1);

                const icon = iconField ? String(d[iconField] ?? "") : "";
                if (icon) {
                    svg.append("text")
                        .attr("x", cx)
                        .attr("y", above ? 28 : 140)
                        .attr("text-anchor", "middle")
                        .attr("font-size", 14)
                        .text(icon);
                }

                svg.append("text")
                    .attr("x", cx)
                    .attr("y", above ? (icon ? 16 : 28) : icon ? 156 : 140)
                    .attr("text-anchor", "middle")
                    .attr("fill", "var(--sd-text)")
                    .attr("font-size", 10)
                    .attr("font-weight", 600)
                    .text(String(d[labelField] ?? "").slice(0, 20));

                svg.append("text")
                    .attr("x", cx)
                    .attr("y", above ? (icon ? 4 : 16) : icon ? 168 : 152)
                    .attr("text-anchor", "middle")
                    .attr("fill", "var(--sd-text-dim)")
                    .attr("font-size", 8)
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

            const dates = sorted.map((d) => new Date(d[dateField]).getTime());
            const minDate = Math.min(...dates);
            const maxDate = Math.max(...dates);
            const x = d3
                .scaleLinear()
                .domain([minDate, maxDate])
                .range([labelW + 20, width - 20]);

            categories.forEach((cat, li) => {
                const y = li * (laneHeight + laneGap) + 20;
                const color = getCategoryColor(categories, cat, COLORS);

                svg.append("rect")
                    .attr("x", labelW + 10)
                    .attr("y", y)
                    .attr("width", width - labelW - 30)
                    .attr("height", laneHeight)
                    .attr("rx", 4)
                    .attr("fill", "var(--sd-surface-raised)")
                    .attr("opacity", 0.5);

                svg.append("text")
                    .attr("x", labelW)
                    .attr("y", y + laneHeight / 2)
                    .attr("text-anchor", "end")
                    .attr("dy", "0.35em")
                    .attr("fill", color)
                    .attr("font-size", 10)
                    .attr("font-weight", 600)
                    .text(cat);

                const laneItems = sorted.filter((d) => String(d[categoryField ?? ""] ?? "") === cat);
                laneItems.forEach((d, ei) => {
                    const cx = x(new Date(d[dateField]).getTime());
                    const icon = iconField ? String(d[iconField] ?? "") : "";

                    svg.append("circle")
                        .attr("cx", cx)
                        .attr("cy", y + laneHeight / 2)
                        .attr("r", 8)
                        .attr("fill", color)
                        .attr("stroke", "var(--sd-surface)")
                        .attr("stroke-width", 2)
                        .style("cursor", "pointer")
                        .on("click", () => fireSelect(ei, d));

                    if (icon) {
                        svg.append("text")
                            .attr("x", cx)
                            .attr("y", y + laneHeight / 2)
                            .attr("text-anchor", "middle")
                            .attr("dy", "0.35em")
                            .attr("font-size", 10)
                            .style("pointer-events", "none")
                            .text(icon);
                    }

                    const g = svg.append("g").attr("opacity", 0).style("pointer-events", "none");
                    g.append("rect")
                        .attr("x", cx - 60)
                        .attr("y", y - 22)
                        .attr("width", 120)
                        .attr("height", 18)
                        .attr("rx", 3)
                        .attr("fill", "var(--sd-surface-overlay)");
                    g.append("text")
                        .attr("x", cx)
                        .attr("y", y - 10)
                        .attr("text-anchor", "middle")
                        .attr("fill", "var(--sd-text)")
                        .attr("font-size", 9)
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

            const dates = sorted.flatMap((d) => {
                const s = new Date(d[dateField]).getTime();
                const e = endDateField && d[endDateField] ? new Date(d[endDateField]).getTime() : s + 86400000 * 7;
                return [s, e];
            });
            const minDate = Math.min(...dates);
            const maxDate = Math.max(...dates);
            const x = d3
                .scaleLinear()
                .domain([minDate, maxDate])
                .range([labelW + 10, width - 20]);

            sorted.forEach((d, i) => {
                const y = i * rowH + 20;
                const start = new Date(d[dateField]).getTime();
                const end = endDateField && d[endDateField] ? new Date(d[endDateField]).getTime() : start + 86400000 * 7;
                const cat = categoryField ? String(d[categoryField] ?? "") : "";
                const color = cat ? getCategoryColor(categories, cat, COLORS) : COLORS[i % COLORS.length];
                const icon = iconField ? String(d[iconField] ?? "") : "";

                if (i % 2 === 0) {
                    svg.append("rect").attr("x", 0).attr("y", y).attr("width", width).attr("height", rowH).attr("fill", "var(--sd-surface-raised)").attr("opacity", 0.3);
                }

                svg.append("text")
                    .attr("x", 8)
                    .attr("y", y + rowH / 2)
                    .attr("dy", "0.35em")
                    .attr("fill", "var(--sd-text)")
                    .attr("font-size", 11)
                    .attr("font-weight", 500)
                    .text(`${icon} ${String(d[labelField] ?? "")}`.trim().slice(0, 22));

                const barX = x(start);
                const barW = Math.max(8, x(end) - x(start));
                svg.append("rect")
                    .attr("x", barX)
                    .attr("y", y + 6)
                    .attr("width", 0)
                    .attr("height", rowH - 12)
                    .attr("rx", 4)
                    .attr("fill", color)
                    .attr("opacity", 0.85)
                    .style("cursor", "pointer")
                    .on("click", () => fireSelect(i, d))
                    .transition()
                    .duration(600)
                    .delay(i * 50)
                    .attr("width", barW);
            });

            const axis = d3
                .axisTop(
                    d3
                        .scaleTime()
                        .domain([new Date(minDate), new Date(maxDate)])
                        .range([labelW + 10, width - 20])
                )
                .ticks(6)
                .tickFormat(d3.timeFormat("%b %d") as any);
            svg.append("g").attr("transform", `translate(0, 16)`).call(axis).selectAll("text").attr("fill", "var(--sd-text-dim)").attr("font-size", 8);
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
            dot.style.setProperty('--sd-category-color', color);
            row.appendChild(dot);

            const content = el("div", "alt-content");
            content.appendChild(el("div", "date", String(item[dateField])));
            content.appendChild(el("div", "label", `${icon} ${String(item[labelField] ?? "")}`));
            if (cat) {
                const catEl = el("div", "category", cat);
                catEl.style.setProperty('--sd-category-color', color);
                content.appendChild(catEl);
            }
            if (desc) content.appendChild(el("div", "description", desc));
            row.appendChild(content);
            root.appendChild(row);
        });

        container.appendChild(root);
        return root;
    }

    // ── V-01 Roadmap: center line, alternating left/right, status dots ─────
    if (variant === "roadmap") {
        const line = el("div", "tl-center-line");
        root.appendChild(line);
        sorted.forEach((item, i) => {
            const left = i % 2 === 0;
            const row = el("div", "tl-roadmap-row");
            row.setAttribute("data-side", left ? "left" : "right");
            row.onclick = () => fireSelect(i, item);
            const contentL = el("div", "tl-roadmap-content");
            contentL.setAttribute("data-side", "left");
            if (!left) contentL.setAttribute("data-hidden", "true");
            contentL.appendChild(el("div", "tl-date", String(item[dateField])));
            contentL.appendChild(el("div", "tl-title", String(item[labelField] ?? "")));
            if (descriptionField && item[descriptionField]) contentL.appendChild(el("div", "tl-desc", String(item[descriptionField])));
            row.appendChild(contentL);
            const dot = el("div", "tl-dot");
            dot.setAttribute("data-status", String(item.status ?? "default"));
            row.appendChild(dot);
            const contentR = el("div", "tl-roadmap-content");
            contentR.setAttribute("data-side", "right");
            if (left) contentR.setAttribute("data-hidden", "true");
            contentR.appendChild(el("div", "tl-date", String(item[dateField])));
            contentR.appendChild(el("div", "tl-title", String(item[labelField] ?? "")));
            if (descriptionField && item[descriptionField]) contentR.appendChild(el("div", "tl-desc", String(item[descriptionField])));
            row.appendChild(contentR);
            root.appendChild(row);
        });
        const legend = el("div", "tl-legend");
        for (const s of ["done", "active", "planned"]) {
            const li = el("div", "tl-legend-item");
            const d = el("div", "tl-legend-dot"); d.setAttribute("data-status", s);
            li.appendChild(d); li.appendChild(el("span", "tl-legend-label", s));
            legend.appendChild(li);
        }
        root.appendChild(legend);
        container.appendChild(root); return root;
    }

    // ── V-02 Career: left-aligned date + dot + line + content ──────────────
    if (variant === "career") {
        sorted.forEach((item, i) => {
            const row = el("div", "tl-career-row");
            row.onclick = () => fireSelect(i, item);
            row.appendChild(el("div", "tl-career-date", String(item[dateField])));
            const dotCol = el("div", "tl-career-dot-col");
            dotCol.appendChild(el("div", "tl-dot"));
            if (i < sorted.length - 1) dotCol.appendChild(el("div", "tl-career-line"));
            row.appendChild(dotCol);
            const content = el("div", "tl-career-content");
            content.appendChild(el("div", "tl-title", String(item[labelField] ?? "")));
            if (descriptionField && item[descriptionField]) content.appendChild(el("div", "tl-desc", String(item[descriptionField])));
            if (item.category) content.appendChild(el("div", "tl-category", String(item.category)));
            row.appendChild(content);
            root.appendChild(row);
        });
        container.appendChild(root); return root;
    }

    // ── V-03 Milestones: left dot+line, status badge right ─────────────────
    if (variant === "milestones") {
        sorted.forEach((item, i) => {
            const row = el("div", "tl-milestone-row");
            row.onclick = () => fireSelect(i, item);
            const dot = el("div", "tl-dot"); dot.setAttribute("data-status", String(item.status ?? "default"));
            row.appendChild(dot);
            const content = el("div", "tl-milestone-content");
            content.appendChild(el("div", "tl-date", String(item[dateField])));
            content.appendChild(el("div", "tl-title", String(item[labelField] ?? "")));
            if (descriptionField && item[descriptionField]) content.appendChild(el("div", "tl-desc", String(item[descriptionField])));
            row.appendChild(content);
            if (item.status) {
                const badge = el("div", "tl-status-badge", String(item.status).toUpperCase());
                badge.setAttribute("data-status", String(item.status));
                row.appendChild(badge);
            }
            root.appendChild(row);
        });
        container.appendChild(root); return root;
    }

    // ── V-04 Sprint: progress bar + checklist rows ─────────────────────────
    if (variant === "sprint") {
        const doneCount = sorted.filter(d => d.done || d.status === "done").length;
        const barWrap = el("div", "tl-progress-wrap");
        barWrap.appendChild(el("div", "tl-progress-label", "PROGRESS"));
        barWrap.appendChild(el("div", "tl-progress-count", `${doneCount} / ${sorted.length}`));
        const bar = el("div", "tl-progress-bar");
        const fill = el("div", "tl-progress-fill");
        fill.style.width = `${(doneCount / sorted.length) * 100}%`;
        bar.appendChild(fill);
        barWrap.appendChild(bar);
        root.appendChild(barWrap);
        sorted.forEach((item, i) => {
            const row = el("div", "tl-sprint-row");
            if (item.active || item.status === "active") row.setAttribute("data-active", "true");
            row.onclick = () => fireSelect(i, item);
            row.appendChild(el("div", "tl-sprint-date", String(item[dateField])));
            row.appendChild(el("div", "tl-sprint-task", String(item[labelField] ?? "")));
            const check = el("div", "tl-sprint-check");
            check.setAttribute("data-done", String(!!(item.done || item.status === "done")));
            check.setAttribute("data-active", String(!!(item.active || item.status === "active")));
            row.appendChild(check);
            root.appendChild(row);
        });
        container.appendChild(root); return root;
    }

    // ── V-05 Schedule: colored time blocks with accent bar ─────────────────
    if (variant === "schedule") {
        sorted.forEach((item, i) => {
            const row = el("div", "tl-schedule-row");
            row.setAttribute("data-type", String(item.type ?? item.category ?? "default"));
            row.onclick = () => fireSelect(i, item);
            row.appendChild(el("div", "tl-schedule-bar"));
            const content = el("div", "tl-schedule-content");
            content.appendChild(el("div", "tl-schedule-time", String(item[dateField])));
            content.appendChild(el("div", "tl-title", String(item[labelField] ?? "")));
            if (descriptionField && item[descriptionField]) content.appendChild(el("div", "tl-desc", String(item[descriptionField])));
            row.appendChild(content);
            root.appendChild(row);
        });
        container.appendChild(root); return root;
    }

    // ── V-06 Incident: dark terminal style, severity badges ────────────────
    if (variant === "incident") {
        root.setAttribute("data-theme", "dark");
        sorted.forEach((item, i) => {
            const row = el("div", "tl-incident-row");
            row.onclick = () => fireSelect(i, item);
            row.appendChild(el("div", "tl-incident-ts", String(item[dateField])));
            if (item.status || item.sev) {
                const sev = el("div", "tl-incident-sev", String(item.status ?? item.sev ?? "").toUpperCase());
                sev.setAttribute("data-sev", String(item.status ?? item.sev ?? "info"));
                row.appendChild(sev);
            }
            const content = el("div", "tl-incident-content");
            content.appendChild(el("div", "tl-incident-msg", String(item[labelField] ?? "")));
            if (descriptionField && item[descriptionField]) content.appendChild(el("div", "tl-incident-svc", String(item[descriptionField])));
            row.appendChild(content);
            root.appendChild(row);
        });
        container.appendChild(root); return root;
    }

    // ── H-01 History: horizontal line, dots, items above/below ─────────────
    if (variant === "history" || variant === "versions") {
        root.style.overflowX = "auto";
        const strip = el("div", "tl-h-strip");
        // Above row
        const aboveRow = el("div", "tl-h-above");
        sorted.forEach((item, i) => {
            const cell = el("div", "tl-h-cell");
            if (item.pos === "above") {
                cell.appendChild(el("div", "tl-title", String(item[labelField] ?? "")));
                if (descriptionField && item[descriptionField]) cell.appendChild(el("div", "tl-desc", String(item[descriptionField])));
            }
            aboveRow.appendChild(cell);
        });
        strip.appendChild(aboveRow);
        // Line + dots
        const lineRow = el("div", "tl-h-line-row");
        const line = el("div", "tl-h-line");
        lineRow.appendChild(line);
        const dotsRow = el("div", "tl-h-dots");
        sorted.forEach((item, i) => {
            const dotWrap = el("div", "tl-h-dot-wrap");
            dotWrap.onclick = () => fireSelect(i, item);
            const dot = el("div", "tl-dot");
            dot.setAttribute("data-status", String(item.status ?? "default"));
            dotWrap.appendChild(dot);
            dotWrap.appendChild(el("div", "tl-date", String(item[dateField])));
            dotsRow.appendChild(dotWrap);
        });
        lineRow.appendChild(dotsRow);
        strip.appendChild(lineRow);
        // Below row
        const belowRow = el("div", "tl-h-below");
        sorted.forEach((item, i) => {
            const cell = el("div", "tl-h-cell");
            if (item.pos === "below") {
                cell.appendChild(el("div", "tl-title", String(item[labelField] ?? "")));
                if (descriptionField && item[descriptionField]) cell.appendChild(el("div", "tl-desc", String(item[descriptionField])));
            }
            belowRow.appendChild(cell);
        });
        strip.appendChild(belowRow);
        root.appendChild(strip);
        container.appendChild(root); return root;
    }

    // ── H-03 Gantt: month columns, phase bars ──────────────────────────────
    if (variant === "gantt-phases") {
        root.style.overflowX = "auto";
        const wrap = el("div", "tl-gantt-wrap");
        const months = (metadata.months as string[]) ?? [];
        const total = months.length;
        // Month headers
        const headerRow = el("div", "tl-gantt-header");
        months.forEach(m => headerRow.appendChild(el("div", "tl-gantt-month", m)));
        wrap.appendChild(headerRow);
        // Phase rows
        sorted.forEach((item, i) => {
            const row = el("div", "tl-gantt-row");
            row.onclick = () => fireSelect(i, item);
            row.appendChild(el("div", "tl-gantt-label", String(item[labelField] ?? item.title ?? "")));
            const track = el("div", "tl-gantt-track");
            const bar = el("div", "tl-gantt-bar");
            bar.setAttribute("data-type", String(item.type ?? "default"));
            bar.style.left = `${((item.start ?? 0) / total) * 100}%`;
            bar.style.width = `${(((item.end ?? 0) - (item.start ?? 0)) / total) * 100}%`;
            track.appendChild(bar);
            row.appendChild(track);
            wrap.appendChild(row);
        });
        root.appendChild(wrap);
        container.appendChild(root); return root;
    }

    // ── H-04 Sprint days: day columns with vertical bars ───────────────────
    if (variant === "sprint-days") {
        root.style.overflowX = "auto";
        const strip = el("div", "tl-sprint-days-strip");
        sorted.forEach((item, i) => {
            const col = el("div", "tl-sprint-day-col");
            if (item.today) col.setAttribute("data-today", "true");
            col.onclick = () => fireSelect(i, item);
            col.appendChild(el("div", "tl-sprint-day-label", String(item[dateField])));
            const barWrap = el("div", "tl-sprint-day-bar-wrap");
            const pct = item.total > 0 ? (item.done / item.total) * 100 : 0;
            const fill = el("div", "tl-sprint-day-bar-fill");
            fill.style.height = `${pct}%`;
            if (item.today) fill.setAttribute("data-today", "true");
            else if (pct === 100) fill.setAttribute("data-done", "true");
            barWrap.appendChild(fill);
            col.appendChild(barWrap);
            col.appendChild(el("div", "tl-sprint-day-count", `${item.done}/${item.total}`));
            if (item.today) col.appendChild(el("div", "tl-sprint-day-today", "TODAY"));
            strip.appendChild(col);
        });
        root.appendChild(strip);
        container.appendChild(root); return root;
    }

    // ── H-05 Time blocks: proportional strip ───────────────────────────────
    if (variant === "time-blocks") {
        root.style.overflowX = "auto";
        const totalH = (metadata.totalHours as number) ?? 9;
        const wrap = el("div", "tl-timeblock-wrap");
        const strip = el("div", "tl-timeblock-strip");
        sorted.forEach((item, i) => {
            const block = el("div", "tl-timeblock");
            block.setAttribute("data-type", String(item.type ?? "default"));
            block.style.left = `${((item.start ?? 0) / totalH) * 100}%`;
            block.style.width = `${((item.span ?? 1) / totalH) * 100}%`;
            block.appendChild(el("span", "tl-timeblock-label", String(item[labelField] ?? "")));
            block.onclick = () => fireSelect(i, item);
            strip.appendChild(block);
        });
        wrap.appendChild(strip);
        root.appendChild(wrap);
        container.appendChild(root); return root;
    }

    // ── H-06 Event stream: horizontal dots with labels ─────────────────────
    if (variant === "event-stream") {
        root.style.overflowX = "auto";
        root.setAttribute("data-theme", "dark");
        const strip = el("div", "tl-stream-strip");
        sorted.forEach((item, i) => {
            const col = el("div", "tl-stream-event");
            col.onclick = () => fireSelect(i, item);
            const label = el("div", "tl-stream-label", String(item[labelField] ?? ""));
            col.appendChild(label);
            const dot = el("div", "tl-dot");
            dot.setAttribute("data-sev", String(item.sev ?? "info"));
            col.appendChild(dot);
            col.appendChild(el("div", "tl-date", String(item[dateField])));
            strip.appendChild(col);
        });
        root.appendChild(strip);
        container.appendChild(root); return root;
    }

    // ── Default vertical: dot + line + content ─────────────────────────────

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
            dot.style.setProperty('--sd-category-color', color);
            marker.appendChild(dot);
        }
        if (i < sorted.length - 1) marker.appendChild(el("span", "line"));
        event.appendChild(marker);

        const content = el("div", "content");
        content.appendChild(el("div", "date", String(item[dateField])));
        content.appendChild(el("div", "label", String(item[labelField] ?? "")));
        if (cat) {
            const catEl = el("div", "category", cat);
            catEl.style.setProperty('--sd-category-color', color);
            content.appendChild(catEl);
        }
        if (desc) content.appendChild(el("div", "description", desc));
        event.appendChild(content);

        root.appendChild(event);
    });

    container.appendChild(root);
    return root;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

export function timelineData(config: ConfigBase): Record<string, any>[] {
    return readList(config);
}

function getCategoryColor(categories: string[], cat: string, colors: string[]): string {
    const idx = categories.indexOf(cat);
    return colors[idx % colors.length];
}
