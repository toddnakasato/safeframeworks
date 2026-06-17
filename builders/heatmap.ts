import type { ConfigBase } from "../../safecontracts/src/contracts";
import { el, applyPaintState, applyIntent } from "../utils/util";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
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

export function createSafeHeatmap(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    const cols = (metadata.columns as number) ?? 7;
    const valueField = metadata.valueField as string;
    const labelField = metadata.labelField as string | undefined;
    const variant = (metadata.variant as string) ?? "default";

    const data = readList(config);

    const values = data.map((d) => Number(d[valueField]) || 0);
    const minVal = (metadata.minValue as number) ?? Math.min(...values);
    const maxVal = (metadata.maxValue as number) ?? Math.max(...values);

    const gap = variant === "compact" ? 2 : variant === "dense" ? 1 : 4;

    const root = el("div");
    root.setAttribute("data-component", "heatmap");
    applyIntent(root, metadata);
    applyPaintState(root, metadata, "heatmap");
    root.style.width = "100%";

    if (metadata.title) root.appendChild(el("div", "title", metadata.title as string));

    const grid = el("div", "grid");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gap = `${gap}px`;

    data.forEach((d, i) => {
        const val = Number(d[valueField]) || 0;
        const t = maxVal === minVal ? 0 : (val - minVal) / (maxVal - minVal);
        const label = labelField ? String(d[labelField] ?? "") : String(val);
        const cell = el("div", "cell");
        cell.style.aspectRatio = "1";
        cell.style.borderRadius = "var(--sd-radius-sm)";
        cell.style.background = `color-mix(in srgb, var(--sd-accent) ${Math.round((t * 0.85 + 0.05) * 100)}%, transparent)`;
        cell.style.cursor = "default";
        cell.title = label;
        cell.onclick = () => ctx.fire("cell:click", { index: i, value: val, data: d });
        grid.appendChild(cell);
    });

    root.appendChild(grid);
    container.appendChild(root);
    return root;
}
