/**
 * Shared sample ConfigBase data for all 26 COMPONENT_REGISTRY components.
 * One config per component in config/. Data values in data/, referenced by
 * source: "file". Event handler files in events/.
 *
 * resolveData() does what SceneHost does at runtime: for every DataSource
 * with source "file", load data/<name>.json and attach it as inline so
 * renderers receive resolved values.
 */
import type { ConfigBase, DataSource } from "../../safecontracts/src/contracts";

import buttonConfig from "./config/button.json";
import calendarConfig from "./config/calendar.json";
import calloutConfig from "./config/callout.json";
import cardConfig from "./config/card.json";
import chartConfig from "./config/chart.json";
import chatConfig from "./config/chat.json";
import columnsConfig from "./config/columns.json";
import dragDropConfig from "./config/drag-drop.json";
import funnelConfig from "./config/funnel.json";
import gaugeConfig from "./config/gauge.json";
import gridConfig from "./config/grid.json";
import heatmapConfig from "./config/heatmap.json";
import inputConfig from "./config/input.json";
import layoutConfig from "./config/layout.json";
import mapConfig from "./config/map.json";
import navConfig from "./config/nav.json";
import pickerConfig from "./config/picker.json";
import sankeyConfig from "./config/sankey.json";
import sheetConfig from "./config/sheet.json";
import tableConfig from "./config/table.json";
import tabsConfig from "./config/tabs.json";
import timelineConfig from "./config/timeline.json";
import toggleConfig from "./config/toggle.json";
import treeConfig from "./config/tree.json";
import treemapConfig from "./config/treemap.json";
import weekConfig from "./config/week.json";

import cardInfoData from "./data/card-info.json";
import chartSeriesData from "./data/chart-series.json";
import dragDropItemsData from "./data/drag-drop-items.json";
import sankeyFlowData from "./data/sankey-flow.json";
import tableRowsData from "./data/table-rows.json";
import timelineEventsData from "./data/timeline-events.json";
import treeNodesData from "./data/tree-nodes.json";

/** data/<name>.json keyed by DataSource.name — mirrors SceneHost file loading. */
const DATA_FILES: Record<string, unknown> = {
    "card-info": cardInfoData,
    "chart-series": chartSeriesData,
    "drag-drop-items": dragDropItemsData,
    "sankey-flow": sankeyFlowData,
    "table-rows": tableRowsData,
    "timeline-events": timelineEventsData,
    "tree-nodes": treeNodesData,
};

/** Resolve source: "file" references by attaching file contents as inline. */
function resolveData(config: ConfigBase): ConfigBase {
    if (!config.data) return config;
    const data: Record<string, DataSource> = {};
    for (const [key, ds] of Object.entries(config.data)) {
        data[key] = ds.source === "file" && ds.name in DATA_FILES
            ? { ...ds, inline: DATA_FILES[ds.name] as DataSource["inline"] }
            : ds;
    }
    return { ...config, data };
}

export const SAMPLES: Record<string, ConfigBase> = {
    button: resolveData(buttonConfig as unknown as ConfigBase),
    calendar: resolveData(calendarConfig as unknown as ConfigBase),
    callout: resolveData(calloutConfig as unknown as ConfigBase),
    card: resolveData(cardConfig as unknown as ConfigBase),
    chart: resolveData(chartConfig as unknown as ConfigBase),
    chat: resolveData(chatConfig as unknown as ConfigBase),
    columns: resolveData(columnsConfig as unknown as ConfigBase),
    "drag-drop": resolveData(dragDropConfig as unknown as ConfigBase),
    funnel: resolveData(funnelConfig as unknown as ConfigBase),
    gauge: resolveData(gaugeConfig as unknown as ConfigBase),
    grid: resolveData(gridConfig as unknown as ConfigBase),
    heatmap: resolveData(heatmapConfig as unknown as ConfigBase),
    input: resolveData(inputConfig as unknown as ConfigBase),
    layout: resolveData(layoutConfig as unknown as ConfigBase),
    map: resolveData(mapConfig as unknown as ConfigBase),
    nav: resolveData(navConfig as unknown as ConfigBase),
    picker: resolveData(pickerConfig as unknown as ConfigBase),
    sankey: resolveData(sankeyConfig as unknown as ConfigBase),
    sheet: resolveData(sheetConfig as unknown as ConfigBase),
    table: resolveData(tableConfig as unknown as ConfigBase),
    tabs: resolveData(tabsConfig as unknown as ConfigBase),
    timeline: resolveData(timelineConfig as unknown as ConfigBase),
    toggle: resolveData(toggleConfig as unknown as ConfigBase),
    tree: resolveData(treeConfig as unknown as ConfigBase),
    treemap: resolveData(treemapConfig as unknown as ConfigBase),
    week: resolveData(weekConfig as unknown as ConfigBase),
};
