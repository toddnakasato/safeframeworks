/**
 * Heatmap builder for this renderer's SafeHeatmap — grid of value-colored cells.
 *
 * Framework-agnostic DOM port of the react JSX implementation:
 * value range → accent color intensity per cell via color-mix.
 *
 * Structure + data-* attributes mirror react exactly; the only inline styles
 * are those react itself sets inline (grid template, cell tint).
 * Events: "cell:click".
 */
import type { ConfigBase, OnSafeEvent } from "../../../safecontracts/src/contracts";
import { createSafeEvent } from "../../../safecontracts/src/contracts";

function el(tag: string, role?: string, text?: string): HTMLElement {
    const e = document.createElement(tag);
    if (role) e.setAttribute("data-role", role);
    if (text != null) e.textContent = text;
    return e;
}

/** Build the heatmap into a container. Returns the root for removal. */
export function createSafeHeatmap(container: HTMLElement, config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
    const metadata = config.metadata;
    const cols = (metadata.columns as number) ?? 7;
    const valueField = metadata.valueField as string;
    const labelField = metadata.labelField as string | undefined;
    const variant = (metadata.variant as string) ?? "default";

    // Self-extract list data from the first DataSource (contract: list).
    const ds = Object.values(config.data ?? {})[0];
    const raw = ds?.inline;
    const data: Record<string, any>[] = Array.isArray(raw) ? raw : [];

    const values = data.map((d) => Number(d[valueField]) || 0);
    const minVal = (metadata.minValue as number) ?? Math.min(...values);
    const maxVal = (metadata.maxValue as number) ?? Math.max(...values);

    const gap = variant === "compact" ? 2 : variant === "dense" ? 1 : 4;

    const root = el("div");
    root.setAttribute("data-component", "heatmap");
    root.setAttribute("data-variant", variant);
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
        cell.onclick = () => onEvent?.(createSafeEvent("heatmap", "cell:click", { index: i, value: val, data: d }));
        grid.appendChild(cell);
    });

    root.appendChild(grid);
    container.appendChild(root);
    return root;
}

/**
 * Scan-and-mount for server-rendered hosts (Astro): build a heatmap in every
 * div[data-heatmap-config] not yet mounted.
 */
export function initSafeHeatmaps(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-heatmap-config]").forEach((host) => {
        if (host.dataset.heatmapMounted) return;
        host.dataset.heatmapMounted = "1";
        const config = JSON.parse(host.dataset.heatmapConfig!) as ConfigBase;
        createSafeHeatmap(host, config);
    });
}
