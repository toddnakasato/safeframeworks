/**
 * Shared sample ConfigBase data for all 26 COMPONENT_REGISTRY components.
 * config/<component>/<component>N.json — multiple variations per component,
 * differing by metadata/intent. Data values in data/ (shared across
 * variations, referenced by source: "file"). Event handler files in events/
 * (shared per component type).
 *
 * resolveData() mirrors SceneHost: DataSources with source "file" get
 * data/<name>.json attached as inline so renderers receive resolved values.
 */
import type { ConfigBase, DataSource } from "../../safecontracts/src/contracts";

import button1Config from "./config/button/button1.json";
import button2Config from "./config/button/button2.json";
import button3Config from "./config/button/button3.json";
import button4Config from "./config/button/button4.json";
import button5Config from "./config/button/button5.json";
import button6Config from "./config/button/button6.json";
import button7Config from "./config/button/button7.json";
import button8Config from "./config/button/button8.json";
import button9Config from "./config/button/button9.json";
import button10Config from "./config/button/button10.json";
import button11Config from "./config/button/button11.json";
import button12Config from "./config/button/button12.json";
import button13Config from "./config/button/button13.json";
import button14Config from "./config/button/button14.json";
import button15Config from "./config/button/button15.json";
import button16Config from "./config/button/button16.json";
import button17Config from "./config/button/button17.json";
import calendar1Config from "./config/calendar/calendar1.json";
import calendar2Config from "./config/calendar/calendar2.json";
import callout1Config from "./config/callout/callout1.json";
import callout2Config from "./config/callout/callout2.json";
import card1Config from "./config/card/card1.json";
import card2Config from "./config/card/card2.json";
import chart1Config from "./config/chart/chart1.json";
import chart2Config from "./config/chart/chart2.json";
import chat1Config from "./config/chat/chat1.json";
import chat2Config from "./config/chat/chat2.json";
import columns1Config from "./config/columns/columns1.json";
import columns2Config from "./config/columns/columns2.json";
import dragDrop1Config from "./config/drag-drop/drag-drop1.json";
import dragDrop2Config from "./config/drag-drop/drag-drop2.json";
import funnel1Config from "./config/funnel/funnel1.json";
import funnel2Config from "./config/funnel/funnel2.json";
import gauge1Config from "./config/gauge/gauge1.json";
import gauge2Config from "./config/gauge/gauge2.json";
import grid1Config from "./config/grid/grid1.json";
import grid2Config from "./config/grid/grid2.json";
import heatmap1Config from "./config/heatmap/heatmap1.json";
import heatmap2Config from "./config/heatmap/heatmap2.json";
import input1Config from "./config/input/input1.json";
import input2Config from "./config/input/input2.json";
import layout1Config from "./config/layout/layout1.json";
import layout2Config from "./config/layout/layout2.json";
import map1Config from "./config/map/map1.json";
import map2Config from "./config/map/map2.json";
import nav1Config from "./config/nav/nav1.json";
import nav2Config from "./config/nav/nav2.json";
import picker1Config from "./config/picker/picker1.json";
import picker2Config from "./config/picker/picker2.json";
import sankey1Config from "./config/sankey/sankey1.json";
import sankey2Config from "./config/sankey/sankey2.json";
import sheet1Config from "./config/sheet/sheet1.json";
import sheet2Config from "./config/sheet/sheet2.json";
import table1Config from "./config/table/table1.json";
import table2Config from "./config/table/table2.json";
import tabs1Config from "./config/tabs/tabs1.json";
import tabs2Config from "./config/tabs/tabs2.json";
import timeline1Config from "./config/timeline/timeline1.json";
import timeline2Config from "./config/timeline/timeline2.json";
import toggle1Config from "./config/toggle/toggle1.json";
import toggle2Config from "./config/toggle/toggle2.json";
import tree1Config from "./config/tree/tree1.json";
import tree2Config from "./config/tree/tree2.json";
import treemap1Config from "./config/treemap/treemap1.json";
import treemap2Config from "./config/treemap/treemap2.json";
import week1Config from "./config/week/week1.json";
import week2Config from "./config/week/week2.json";
import week3Config from "./config/week/week3.json";

import cardInfoData from "./data/card-info.json";
import chartSeriesData from "./data/chart-series.json";
import dragDropItemsData from "./data/drag-drop-items.json";
import mapManhattanData from "./data/map-manhattan.json";
import sankeyFlowData from "./data/sankey-flow.json";
import tableRowsData from "./data/table-rows.json";
import timelineEventsData from "./data/timeline-events.json";
import treeNodesData from "./data/tree-nodes.json";

/** data/<name>.json keyed by DataSource.name — mirrors SceneHost file loading. */
const DATA_FILES: Record<string, unknown> = {
    "card-info": cardInfoData,
    "chart-series": chartSeriesData,
    "drag-drop-items": dragDropItemsData,
    "map-manhattan": mapManhattanData,
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

/** component -> variation -> resolved ConfigBase. */
export const SAMPLES: Record<string, Record<string, ConfigBase>> = {
    button: {
        "button1": resolveData(button1Config as unknown as ConfigBase),
        "button2": resolveData(button2Config as unknown as ConfigBase),
        "button3": resolveData(button3Config as unknown as ConfigBase),
        "button4": resolveData(button4Config as unknown as ConfigBase),
        "button5": resolveData(button5Config as unknown as ConfigBase),
        "button6": resolveData(button6Config as unknown as ConfigBase),
        "button7": resolveData(button7Config as unknown as ConfigBase),
        "button8": resolveData(button8Config as unknown as ConfigBase),
        "button9": resolveData(button9Config as unknown as ConfigBase),
        "button10": resolveData(button10Config as unknown as ConfigBase),
        "button11": resolveData(button11Config as unknown as ConfigBase),
        "button12": resolveData(button12Config as unknown as ConfigBase),
        "button13": resolveData(button13Config as unknown as ConfigBase),
        "button14": resolveData(button14Config as unknown as ConfigBase),
        "button15": resolveData(button15Config as unknown as ConfigBase),
        "button16": resolveData(button16Config as unknown as ConfigBase),
        "button17": resolveData(button17Config as unknown as ConfigBase),
    },
    calendar: {
        "calendar1": resolveData(calendar1Config as unknown as ConfigBase),
        "calendar2": resolveData(calendar2Config as unknown as ConfigBase),
    },
    callout: {
        "callout1": resolveData(callout1Config as unknown as ConfigBase),
        "callout2": resolveData(callout2Config as unknown as ConfigBase),
    },
    card: {
        "card1": resolveData(card1Config as unknown as ConfigBase),
        "card2": resolveData(card2Config as unknown as ConfigBase),
    },
    chart: {
        "chart1": resolveData(chart1Config as unknown as ConfigBase),
        "chart2": resolveData(chart2Config as unknown as ConfigBase),
    },
    chat: {
        "chat1": resolveData(chat1Config as unknown as ConfigBase),
        "chat2": resolveData(chat2Config as unknown as ConfigBase),
    },
    columns: {
        "columns1": resolveData(columns1Config as unknown as ConfigBase),
        "columns2": resolveData(columns2Config as unknown as ConfigBase),
    },
    "drag-drop": {
        "drag-drop1": resolveData(dragDrop1Config as unknown as ConfigBase),
        "drag-drop2": resolveData(dragDrop2Config as unknown as ConfigBase),
    },
    funnel: {
        "funnel1": resolveData(funnel1Config as unknown as ConfigBase),
        "funnel2": resolveData(funnel2Config as unknown as ConfigBase),
    },
    gauge: {
        "gauge1": resolveData(gauge1Config as unknown as ConfigBase),
        "gauge2": resolveData(gauge2Config as unknown as ConfigBase),
    },
    grid: {
        "grid1": resolveData(grid1Config as unknown as ConfigBase),
        "grid2": resolveData(grid2Config as unknown as ConfigBase),
    },
    heatmap: {
        "heatmap1": resolveData(heatmap1Config as unknown as ConfigBase),
        "heatmap2": resolveData(heatmap2Config as unknown as ConfigBase),
    },
    input: {
        "input1": resolveData(input1Config as unknown as ConfigBase),
        "input2": resolveData(input2Config as unknown as ConfigBase),
    },
    layout: {
        "layout1": resolveData(layout1Config as unknown as ConfigBase),
        "layout2": resolveData(layout2Config as unknown as ConfigBase),
    },
    map: {
        "map1": resolveData(map1Config as unknown as ConfigBase),
        "map2": resolveData(map2Config as unknown as ConfigBase),
    },
    nav: {
        "nav1": resolveData(nav1Config as unknown as ConfigBase),
        "nav2": resolveData(nav2Config as unknown as ConfigBase),
    },
    picker: {
        "picker1": resolveData(picker1Config as unknown as ConfigBase),
        "picker2": resolveData(picker2Config as unknown as ConfigBase),
    },
    sankey: {
        "sankey1": resolveData(sankey1Config as unknown as ConfigBase),
        "sankey2": resolveData(sankey2Config as unknown as ConfigBase),
    },
    sheet: {
        "sheet1": resolveData(sheet1Config as unknown as ConfigBase),
        "sheet2": resolveData(sheet2Config as unknown as ConfigBase),
    },
    table: {
        "table1": resolveData(table1Config as unknown as ConfigBase),
        "table2": resolveData(table2Config as unknown as ConfigBase),
    },
    tabs: {
        "tabs1": resolveData(tabs1Config as unknown as ConfigBase),
        "tabs2": resolveData(tabs2Config as unknown as ConfigBase),
    },
    timeline: {
        "timeline1": resolveData(timeline1Config as unknown as ConfigBase),
        "timeline2": resolveData(timeline2Config as unknown as ConfigBase),
    },
    toggle: {
        "toggle1": resolveData(toggle1Config as unknown as ConfigBase),
        "toggle2": resolveData(toggle2Config as unknown as ConfigBase),
    },
    tree: {
        "tree1": resolveData(tree1Config as unknown as ConfigBase),
        "tree2": resolveData(tree2Config as unknown as ConfigBase),
    },
    treemap: {
        "treemap1": resolveData(treemap1Config as unknown as ConfigBase),
        "treemap2": resolveData(treemap2Config as unknown as ConfigBase),
    },
    week: {
        "week1": resolveData(week1Config as unknown as ConfigBase),
        "week2": resolveData(week2Config as unknown as ConfigBase),
        "week3": resolveData(week3Config as unknown as ConfigBase),
    },
};
