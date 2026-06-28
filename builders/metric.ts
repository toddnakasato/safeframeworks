import { el, readRecord, applyIntent } from "../utils/util";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import type { ConfigBase } from "../../safecontracts/src/contracts";
import { fmtCurrency, fmtInt, fmtPercent } from "../../safecontracts/src/contracts-formatter";

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
    root.setAttribute("data-layout", "column");
    applyIntent(root, metadata);

    if (metadata.title) {
        const title = el("span");
        title.textContent = metadata.title as string;
        title.setAttribute("data-role", "label");
        root.appendChild(title);
    }

    const num = el("span");
    num.textContent = formatted;
    num.setAttribute("data-role", "value");
    root.appendChild(num);

    if (metadata.deltaField) {
        const deltaVal = Number(data[metadata.deltaField]);
        if (!isNaN(deltaVal)) {
            const dir = metadata.trend ?? (deltaVal > 0 ? "up" : deltaVal < 0 ? "down" : "flat");
            const trend = el("span");
            trend.textContent = `${trendIcon(dir as string)} ${formatByType(Math.abs(deltaVal), metadata.format as string)}`;
            trend.setAttribute("data-role", "trend");
            trend.setAttribute("data-direction", dir as string);
            root.appendChild(trend);
        }
    }

    root.onclick = () => ctx.fire("click", { value, field: metadata.valueField });

    container.appendChild(root);
    return root;
}