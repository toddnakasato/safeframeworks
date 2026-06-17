import * as d3 from "d3";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import type { ConfigBase } from "../../safecontracts/src/contracts";
import { elAttrs, applyPaintState, applyIntent } from "../utils/util";
import { readList } from "../../safecontracts/src/contracts-data";

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

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeGauge(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    const variant = (metadata.variant as string) ?? "default";
    const valueField = metadata.valueField as string;
    const labelField = metadata.labelField as string | undefined;
    const min = (metadata.min as number) ?? 0;
    const max = (metadata.max as number) ?? 100;
    const target = metadata.target as number | undefined;
    const unit = (metadata.unit as string) ?? "";
    const arcWidth = (metadata.arcWidth as number) ?? 20;
    const thresholds = (metadata.thresholds as [number, string][]) ?? [[60, "var(--sd-danger)"], [80, "var(--sd-warning)"], [100, "var(--sd-success)"]];

    // Self-extract record data from the first DataSource (contract: record).
    const data = readList(config);

    const value = Number(data[valueField]) ?? 0;
    const label = labelField ? String(data[labelField] ?? "") : "";
    const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));

    const startAngle = variant === "half" ? -Math.PI / 2 : -Math.PI * 0.75;
    const endAngle = variant === "half" ? Math.PI / 2 : Math.PI * 0.75;

    const getColor = () => {
        for (const [threshold, col] of thresholds) {
            if (pct * 100 <= threshold) return col;
        }
        return thresholds[thresholds.length - 1]?.[1] ?? "var(--sd-accent)";
    };

    const root = document.createElement("div");
    root.setAttribute("data-component", "gauge");
    applyIntent(root, metadata);
    applyPaintState(root, metadata, "gauge");
    root.onclick = () => ctx.fire("click", { value });

    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEl.style.width = "100%";
    svgEl.style.maxWidth = "200px";
    svgEl.style.display = "block";
    svgEl.style.margin = "0 auto";
    root.appendChild(svgEl);

    const svg = d3.select(svgEl);

    const width = 200;
    const height = variant === "half" ? 120 : 200;
    const radius = 80;

    svg.attr("viewBox", `0 0 ${width} ${height}`);
    const g = svg.append("g").attr("transform", `translate(${width / 2}, ${variant === "half" ? height - 10 : height / 2})`);

    const arc = d3.arc().innerRadius(radius - arcWidth).outerRadius(radius).cornerRadius(4);

    g.append("path")
        .attr("d", arc({ startAngle, endAngle, innerRadius: radius - arcWidth, outerRadius: radius } as any))
        .attr("fill", "var(--sd-border)");

    const valueEnd = startAngle + (endAngle - startAngle) * pct;
    g.append("path")
        .attr("d", arc({ startAngle, endAngle: startAngle, innerRadius: radius - arcWidth, outerRadius: radius } as any))
        .attr("fill", getColor())
        .transition()
        .duration(800)
        .attrTween("d", () => {
            const interp = d3.interpolate(startAngle, valueEnd);
            return (t: number) => arc({ startAngle, endAngle: interp(t), innerRadius: radius - arcWidth, outerRadius: radius } as any)!;
        });

    if (target != null) {
        const targetPct = (target - min) / (max - min);
        const targetAngle = startAngle + (endAngle - startAngle) * targetPct;
        g.append("line")
            .attr("x1", Math.cos(targetAngle - Math.PI / 2) * (radius - arcWidth - 4))
            .attr("y1", Math.sin(targetAngle - Math.PI / 2) * (radius - arcWidth - 4))
            .attr("x2", Math.cos(targetAngle - Math.PI / 2) * (radius + 4))
            .attr("y2", Math.sin(targetAngle - Math.PI / 2) * (radius + 4))
            .attr("stroke", "var(--sd-text)")
            .attr("stroke-width", 2);
    }

    g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", variant === "half" ? "-0.5em" : "0.1em")
        .attr("fill", "var(--sd-text)")
        .attr("font-size", "var(--sd-font-3xl)")
        .attr("font-weight", 700)
        .text(`${Math.round(value)}${unit}`);

    if (label) {
        g.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", variant === "half" ? "1em" : "1.8em")
            .attr("fill", "var(--sd-text-dim)")
            .attr("font-size", "var(--sd-font-sm)")
            .text(label);
    }

    container.appendChild(root);
    return root;
}
