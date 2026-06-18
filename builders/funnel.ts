import * as d3 from "d3";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import type { ConfigBase } from "../../safecontracts/src/contracts";
import { resolveColors } from "../../safecontracts/src/palette";
import { elAttrs, applyPaintState, applyIntent, readList } from "../utils/util";

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeFunnel(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    const FUNNEL_COLORS = resolveColors(metadata);
    const variant = (metadata.variant as string) ?? "default";
    const labelField = metadata.labelField as string;
    const valueField = metadata.valueField as string;
    const showConversion = metadata.showConversion !== false;
    const showPercent = metadata.showPercent !== false;

    const data = readList(config);

    const root = document.createElement("div");
    root.setAttribute("data-component", "funnel");
    applyIntent(root, metadata);
    applyPaintState(root, metadata, "funnel");

    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEl.style.width = "100%";
    svgEl.style.maxWidth = "500px";
    svgEl.style.display = "block";
    root.appendChild(svgEl);
    container.appendChild(root);

    if (data.length === 0) return root;

    const svg = d3.select(svgEl);
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

        const g = svg
            .append("g")
            .style("cursor", "pointer")
            .on("click", () => ctx.fire("select", { index: i, data: d }));

        g.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", 0)
            .attr("height", barHeight)
            .attr("rx", 4)
            .attr("fill", color)
            .transition()
            .duration(600)
            .delay(i * 100)
            .attr("width", barW);

        g.append("text")
            .attr("x", width / 2)
            .attr("y", y + barHeight / 2)
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("fill", "var(--sd-surface)")
            .attr("font-size", 12)
            .attr("font-weight", 600)
            .text(String(d[labelField] ?? ""));

        const displayVal = val.toLocaleString();
        const pctText = showPercent ? ` (${Math.round(pct * 100)}%)` : "";
        g.append("text")
            .attr("x", x + barW + 8)
            .attr("y", y + barHeight / 2)
            .attr("dy", "0.35em")
            .attr("fill", "var(--sd-text-dim)")
            .attr("font-size", 11)
            .text(`${displayVal}${pctText}`);

        if (showConversion && i > 0) {
            const prevVal = Number(data[i - 1][valueField]) ?? 1;
            const convRate = prevVal > 0 ? Math.round((val / prevVal) * 100) : 0;
            svg.append("text")
                .attr("x", 12)
                .attr("y", y - 1)
                .attr("fill", "var(--sd-text-dim)")
                .attr("font-size", 9)
                .text(`↓ ${convRate}%`);
        }
    });

    return root;
}
