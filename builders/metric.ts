import { el, readRecord } from "../utils/util";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import type { ConfigBase } from "../../safecontracts/src/contracts";
import { fmtCurrency, fmtInt, fmtPercent } from "../../safecontracts/src/formatter";

function formatByType(value: number, format: string | undefined): string {
    switch (format) {
        case "currency": return fmtCurrency(value);
        case "percent": return fmtPercent(value);
        case "compact":
            if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
            if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
            return fmtInt(value);
        default: return fmtInt(value);
    }
}

function trendIcon(dir: string): string {
    if (dir === "up") return "↑";
    if (dir === "down") return "↓";
    return "→";
}

export function createSafeMetric(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    // External paint state (resolved from state.json by host)
    const _selectedMetric = metadata.selectedMetric ?? null;

    const data = readRecord(config);
    const value = Number(data[metadata.valueField]) || 0;
    const formatted = formatByType(value, metadata.format as string);

    const root = el("div");
    root.setAttribute("data-component", "metric");
    root.style.display = "flex";
    root.style.flexDirection = "column";
    root.style.alignItems = "center";
    root.style.textAlign = "center";
    root.style.gap = "var(--sd-space-sm)";
    root.style.cursor = "pointer";

    if (metadata.title) {
        const title = el("span");
        title.textContent = metadata.title as string;
        title.style.fontSize = "var(--sd-font-md)";
        title.style.fontWeight = "600";
        title.style.textTransform = "uppercase";
        title.style.letterSpacing = "0.08em";
        title.style.color = "var(--sd-text-muted)";
        root.appendChild(title);
    }

    const num = el("span");
    num.textContent = formatted;
    num.style.fontWeight = "600";
    num.style.color = "var(--sd-text)";
    num.style.fontSize = "var(--sd-font-3xl)";
    num.style.fontVariantNumeric = "tabular-nums";
    root.appendChild(num);

    if (metadata.deltaField) {
        const deltaVal = Number(data[metadata.deltaField]);
        if (!isNaN(deltaVal)) {
            const dir = metadata.trend ?? (deltaVal > 0 ? "up" : deltaVal < 0 ? "down" : "flat");
            const trend = el("span");
            trend.textContent = `${trendIcon(dir as string)} ${formatByType(Math.abs(deltaVal), metadata.format as string)}`;
            trend.style.fontSize = "var(--sd-font-md)";
            trend.style.fontWeight = "500";
            trend.style.color = dir === "up" ? "var(--sd-success)" : dir === "down" ? "var(--sd-danger)" : "var(--sd-text-dim)";
            root.appendChild(trend);
        }
    }

    root.onclick = () => ctx.fire("click", { value, field: metadata.valueField });

    container.appendChild(root);
    return root;
}