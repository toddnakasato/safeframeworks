import {
    Chart,
    BarController, BarElement,
    LineController, LineElement, PointElement,
    PieController, ArcElement,
    ScatterController,
    RadarController, RadialLinearScale,
    CategoryScale, LinearScale,
    Filler, Legend, Tooltip,
} from "chart.js";
import type { ChartConfiguration } from "chart.js";
import { getDataSource } from "../../safecontracts/src/contracts";
import type { ConfigBase, OnSafeEvent } from "../../safecontracts/src/contracts";
import { fireChart } from "../../safecontracts/src/contracts-emit";
import { resolveColors } from "../../safecontracts/src/palette";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

Chart.register(
    BarController, BarElement,
    LineController, LineElement, PointElement,
    PieController, ArcElement,
    ScatterController,
    RadarController, RadialLinearScale,
    CategoryScale, LinearScale,
    Filler, Legend, Tooltip,
);

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

function resolveCssColor(color: string): string {
    const m = color.match(/^var\((--[\w-]+)\s*(?:,\s*(.+))?\)$/);
    if (!m) return color;
    const resolved = getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim();
    return resolved || m[2]?.trim() || color;
}

export function chartData(config: ConfigBase): Record<string, any>[] {
    const ds = getDataSource(config);
    return Array.isArray(ds?.inline) ? ds.inline : [];
}

function yFields(config: ConfigBase): string[] {
    const y = config.metadata.yField;
    if (!y) return ["value"];
    return Array.isArray(y) ? y : [y];
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function buildChartConfig(config: ConfigBase): ChartConfiguration {
    const meta = config.metadata;
    const data = chartData(config);
    const colors = resolveColors(meta).map(resolveCssColor);
    const x = (meta.xField as string) ?? "label";
    const ys = yFields(config);
    const labels = data.map((d) => d[x]);
    const chartType = (meta.chartType as string) ?? "bar";

    const text = resolveCssColor("var(--sd-text-dim, #6b7280)");
    const border = resolveCssColor("var(--sd-border, #e5e7eb)");

    const scales: any = chartType === "radar"
        ? { r: { grid: { color: border }, ticks: { color: text } } }
        : chartType === "pie"
            ? undefined
            : {
                x: { grid: { display: meta.grid !== false, color: border }, ticks: { color: text } },
                y: { grid: { display: meta.grid !== false, color: border }, ticks: { color: text } },
            };

    const baseOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: meta.legend === true, labels: { color: text } } },
        ...(scales ? { scales } : {}),
    };

    if (chartType === "pie") {
        return {
            type: "pie",
            data: {
                labels,
                datasets: [{
                    data: data.map((d) => d[ys[0]]),
                    backgroundColor: data.map((_, i) => colors[i % colors.length]),
                    borderWidth: 0,
                }],
            },
            options: baseOptions,
        };
    }

    if (chartType === "scatter") {
        return {
            type: "scatter",
            data: {
                datasets: ys.map((f, i) => ({
                    label: f,
                    data: data.map((d) => ({ x: d[x], y: d[f] })),
                    backgroundColor: colors[i % colors.length],
                })),
            },
            options: baseOptions,
        };
    }

    if (chartType === "radar") {
        return {
            type: "radar",
            data: {
                labels,
                datasets: ys.map((f, i) => ({
                    label: f,
                    data: data.map((d) => d[f]),
                    borderColor: colors[i % colors.length],
                    backgroundColor: colors[i % colors.length] + "40",
                })),
            },
            options: baseOptions,
        };
    }

    // bar | line | area | composed
    const composedTypes = (meta.composedTypes as string[]) ?? ys.map((_, i) => (i === 0 ? "bar" : "line"));
    return {
        type: chartType === "bar" ? "bar" : "line",
        data: {
            labels,
            datasets: ys.map((f, i) => {
                const dsType = chartType === "composed" ? (composedTypes[i] ?? "line") : chartType;
                const color = colors[i % colors.length];
                return {
                    type: (dsType === "area" ? "line" : dsType) as any,
                    label: f,
                    data: data.map((d) => d[f]),
                    borderColor: color,
                    backgroundColor: dsType === "bar" ? color : color + "40",
                    borderWidth: 2,
                    fill: dsType === "area",
                    tension: 0.3,
                    pointRadius: dsType === "bar" ? undefined : 0,
                    borderRadius: dsType === "bar" ? 4 : undefined,
                };
            }),
        },
        options: baseOptions,
    };
}

export function createSafeChart(canvas: HTMLCanvasElement, config: ConfigBase, onEvent?: OnSafeEvent): Chart {
    const instanceId = config.metadata?.name as string | undefined;
    const metadata = config.metadata;
    canvas.setAttribute("data-component", "chart");
    canvas.setAttribute("data-variant", (metadata.variant as string) ?? "default");
    canvas.setAttribute("data-chart-type", (metadata.chartType as string) ?? "bar");
    const cfg = buildChartConfig(config);
    cfg.options = {
        ...cfg.options,
        onClick: (_evt: any, elements: any[]) => {
            if (!onEvent || !elements?.length) return;
            const el = elements[0];
            const data = chartData(config);
            fireChart(onEvent, "click", {
                index: el.index,
                datasetIndex: el.datasetIndex,
                row: data[el.index],
            }, { instanceId });
        },
    };
    return new Chart(canvas, cfg);
}

export function initSafeCharts(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLCanvasElement>("canvas[data-chart-config]").forEach((canvas) => {
        if (canvas.dataset.chartMounted) return;
        canvas.dataset.chartMounted = "1";
        const config = JSON.parse(canvas.dataset.chartConfig!) as ConfigBase;
        createSafeChart(canvas, config);
    });
}
