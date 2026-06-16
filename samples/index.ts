/**
 * Shared sample ConfigBase data for all COMPONENT_REGISTRY components.
 * config/<component>/<variation>.json — variation names are short
 * descriptions (e.g. button-primary-icon = singular; buttons-stepper =
 * group/list). Data values in data/ (shared across variations, referenced
 * by source: "file"). Event handler files in events/ (shared per type).
 *
 * resolveData() mirrors SceneHost: DataSources with source "file" get
 * data/<name>.json attached as inline so renderers receive resolved values.
 */
import type { ConfigBase, DataSource } from "../../safecontracts/src/contracts";

import buttonDangerConfig from "./config/button/button-danger.json";
import buttonDisabledConfig from "./config/button/button-disabled.json";
import buttonGhostConfig from "./config/button/button-ghost.json";
import buttonLinkIconConfig from "./config/button/button-link-icon.json";
import buttonLinkSuffixConfig from "./config/button/button-link-suffix.json";
import buttonLoadingConfig from "./config/button/button-loading.json";
import buttonOutlineIconRightConfig from "./config/button/button-outline-icon-right.json";
import buttonPrimaryIconConfig from "./config/button/button-primary-icon.json";
import buttonPrimaryLgConfig from "./config/button/button-primary-lg.json";
import buttonSecondarySmConfig from "./config/button/button-secondary-sm.json";
import buttonsAiResponsesConfig from "./config/button/buttons-ai-responses.json";
import buttonsIconToolbarConfig from "./config/button/buttons-icon-toolbar.json";
import buttonsNavMenuConfig from "./config/button/buttons-nav-menu.json";
import buttonsPaginationConfig from "./config/button/buttons-pagination.json";
import buttonsStepperConfig from "./config/button/buttons-stepper.json";
import buttonsToggleFilterConfig from "./config/button/buttons-toggle-filter.json";
import buttonsVerticalStackConfig from "./config/button/buttons-vertical-stack.json";
import calendar1Config from "./config/calendar/calendar1.json";
import calendar2Config from "./config/calendar/calendar2.json";
import callout1Config from "./config/callout/callout1.json";
import callout2Config from "./config/callout/callout2.json";
import card1Config from "./config/card/card1.json";
import card2Config from "./config/card/card2.json";
import cardInlineConfig from "./config/card/card-inline.json";
import cardStateConfig from "./config/card/card-state.json";
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
import listActionsConfig from "./config/list/list-actions.json";
import listColumnsContactsConfig from "./config/list/list-columns-contacts.json";
import listFileBrowserConfig from "./config/list/list-file-browser.json";
import listGanttTasksConfig from "./config/list/list-gantt-tasks.json";
import listHierarchyTreeConfig from "./config/list/list-hierarchy-tree.json";
import listIconLedConfig from "./config/list/list-icon-led.json";
import listPropertyGridConfig from "./config/list/list-property-grid.json";
import listSelectMultipleConfig from "./config/list/list-select-multiple.json";
import listSelectSingleConfig from "./config/list/list-select-single.json";
import listSimpleHorizontalConfig from "./config/list/list-simple-horizontal.json";
import listSimplePagedConfig from "./config/list/list-simple-paged.json";
import map1Config from "./config/map/map1.json";
import map2Config from "./config/map/map2.json";
import nav1Config from "./config/nav/nav1.json";
import nav2Config from "./config/nav/nav2.json";
import picker1Config from "./config/picker/picker1.json";
import picker2Config from "./config/picker/picker2.json";
import flowArcTradeConfig from "./config/flow/flow-arc-trade.json";
import flowChordTradeConfig from "./config/flow/flow-chord-trade.json";
import flowForceTeamConfig from "./config/flow/flow-force-team.json";
import flowSankeyRevenueConfig from "./config/flow/flow-sankey-revenue.json";
import sheetBasicConfig from "./config/sheet/sheet-basic.json";
import sheetColumnsOnlyConfig from "./config/sheet/sheet-columns-only.json";
import sheetCompactConfig from "./config/sheet/sheet-compact.json";
import sheetDarkConfig from "./config/sheet/sheet-dark.json";
import sheetEmptyConfig from "./config/sheet/sheet-empty.json";
import sheetGroupedConfig from "./config/sheet/sheet-grouped.json";
import sheetKeyValueConfig from "./config/sheet/sheet-key-value.json";
import sheetPivotConfig from "./config/sheet/sheet-pivot.json";
import sheetRowsOnlyConfig from "./config/sheet/sheet-rows-only.json";
import sheetSingleColumnConfig from "./config/sheet/sheet-single-column.json";
import sheetSkeletonConfig from "./config/sheet/sheet-skeleton.json";
import sheetSpreadsheetConfig from "./config/sheet/sheet-spreadsheet.json";
import sheetStatusConfig from "./config/sheet/sheet-status.json";
import sheetStripedConfig from "./config/sheet/sheet-striped.json";
import tableBasicConfig from "./config/table/table-basic.json";
import tableRowNumbersConfig from "./config/table/table-row-numbers.json";
import tableTransactionsConfig from "./config/table/table-transactions.json";
import tableContactsConfig from "./config/table/table-contacts.json";
import tableEventsConfig from "./config/table/table-events.json";
import tabs1Config from "./config/tabs/tabs1.json";
import tabs2Config from "./config/tabs/tabs2.json";
import timeline1Config from "./config/timeline/timeline1.json";
import timeline2Config from "./config/timeline/timeline2.json";
import toggle1Config from "./config/toggle/toggle1.json";
import toggle2Config from "./config/toggle/toggle2.json";
import tree1Config from "./config/tree/tree1.json";
import tree2Config from "./config/tree/tree2.json";
import hierarchyIcicleDiskConfig from "./config/hierarchy/hierarchy-icicle-disk.json";
import hierarchyPackBudgetConfig from "./config/hierarchy/hierarchy-pack-budget.json";
import hierarchySunburstDiskConfig from "./config/hierarchy/hierarchy-sunburst-disk.json";
import hierarchyTreemapDiskConfig from "./config/hierarchy/hierarchy-treemap-disk.json";
import week1Config from "./config/week/week1.json";
import week2Config from "./config/week/week2.json";
import week3Config from "./config/week/week3.json";

import cardInfoData from "./data/card-info.json";
import chartSeriesData from "./data/chart-series.json";
import dragDropItemsData from "./data/drag-drop-items.json";
import listAchievementsData from "./data/list-achievements.json";
import listContactsData from "./data/list-contacts.json";
import listFilesData from "./data/list-files.json";
import listGanttData from "./data/list-gantt.json";
import listHierarchyData from "./data/list-hierarchy.json";
import listPropertiesData from "./data/list-properties.json";
import listSimpleData from "./data/list-simple.json";
import listTasksData from "./data/list-tasks.json";
import listThemesData from "./data/list-themes.json";
import mapManhattanData from "./data/map-manhattan.json";
import sheetChannelTrafficData from "./data/sheet-channel-traffic.json";
import sheetDenseLogData from "./data/sheet-dense-log.json";
import sheetFormulasData from "./data/sheet-formulas.json";
import sheetGroupedStaffData from "./data/sheet-grouped-staff.json";
import sheetMetricsData from "./data/sheet-metrics.json";
import sheetPeopleData from "./data/sheet-people.json";
import sheetProjectsStatusData from "./data/sheet-projects-status.json";
import sheetRegionSalesData from "./data/sheet-region-sales.json";
import sheetTickersData from "./data/sheet-tickers.json";
import flowRevenueData from "./data/flow-revenue.json";
import flowRegionTradeData from "./data/flow-region-trade.json";
import flowTeamNetworkData from "./data/flow-team-network.json";
import hierarchyBudgetData from "./data/hierarchy-budget.json";
import hierarchyDiskUsageData from "./data/hierarchy-disk-usage.json";
import tableRowsData from "./data/table-rows.json";
import timelineEventsData from "./data/timeline-events.json";
import treeNodesData from "./data/tree-nodes.json";
import { RESOLVED_DATA } from "./data-resolved";

/** data/<name>.json keyed by DataSource.name — mirrors SceneHost file loading. */
const DATA_FILES: Record<string, unknown> = {
    "sheet-channel-traffic": sheetChannelTrafficData,
    "sheet-dense-log": sheetDenseLogData,
    "sheet-formulas": sheetFormulasData,
    "sheet-grouped-staff": sheetGroupedStaffData,
    "sheet-metrics": sheetMetricsData,
    "sheet-people": sheetPeopleData,
    "sheet-projects-status": sheetProjectsStatusData,
    "sheet-region-sales": sheetRegionSalesData,
    "sheet-tickers": sheetTickersData,
    "card-info": cardInfoData,
    "chart-series": chartSeriesData,
    "drag-drop-items": dragDropItemsData,
    "list-achievements": listAchievementsData,
    "list-contacts": listContactsData,
    "list-files": listFilesData,
    "list-gantt": listGanttData,
    "list-hierarchy": listHierarchyData,
    "list-properties": listPropertiesData,
    "list-simple": listSimpleData,
    "list-tasks": listTasksData,
    "list-themes": listThemesData,
    "map-manhattan": mapManhattanData,
    "flow-revenue": flowRevenueData,
    "flow-region-trade": flowRegionTradeData,
    "flow-team-network": flowTeamNetworkData,
    "hierarchy-budget": hierarchyBudgetData,
    "hierarchy-disk-usage": hierarchyDiskUsageData,
    "table-rows": tableRowsData,
    "transactions": RESOLVED_DATA["transactions"],
    "contacts": RESOLVED_DATA["contacts"],
    "events": RESOLVED_DATA["events"],
    "timeline-events": timelineEventsData,
    "tree-nodes": treeNodesData,
};

/** Sample runtime state — backs source: "state" datasources, mirroring
 *  what resolveDataSources does with state[name] at runtime. */
const SAMPLE_STATE: Record<string, any> = {
    "card-state": { title: "State Card — value resolved from state[\"card-state\"]" },
};

/** Resolve source references by attaching values as inline.
 *  file → DATA_FILES[name], state → SAMPLE_STATE[name]. */
function resolveData(config: ConfigBase): ConfigBase {
    if (!config.data) return config;
    const data: Record<string, DataSource> = {};
    for (const [key, ds] of Object.entries(config.data)) {
        if (ds.source === "file" && ds.name in DATA_FILES) {
            data[key] = { ...ds, inline: DATA_FILES[ds.name] as DataSource["inline"] };
        } else if (ds.source === "state" && ds.name in SAMPLE_STATE) {
            data[key] = { ...ds, inline: SAMPLE_STATE[ds.name] as DataSource["inline"] };
        } else {
            data[key] = ds;
        }
    }
    return { ...config, data };
}

/** component -> variation -> resolved ConfigBase. */
export const SAMPLES: Record<string, Record<string, ConfigBase>> = {
    button: {
        "button-danger": resolveData(buttonDangerConfig as unknown as ConfigBase),
        "button-disabled": resolveData(buttonDisabledConfig as unknown as ConfigBase),
        "button-ghost": resolveData(buttonGhostConfig as unknown as ConfigBase),
        "button-link-icon": resolveData(buttonLinkIconConfig as unknown as ConfigBase),
        "button-link-suffix": resolveData(buttonLinkSuffixConfig as unknown as ConfigBase),
        "button-loading": resolveData(buttonLoadingConfig as unknown as ConfigBase),
        "button-outline-icon-right": resolveData(buttonOutlineIconRightConfig as unknown as ConfigBase),
        "button-primary-icon": resolveData(buttonPrimaryIconConfig as unknown as ConfigBase),
        "button-primary-lg": resolveData(buttonPrimaryLgConfig as unknown as ConfigBase),
        "button-secondary-sm": resolveData(buttonSecondarySmConfig as unknown as ConfigBase),
        "buttons-ai-responses": resolveData(buttonsAiResponsesConfig as unknown as ConfigBase),
        "buttons-icon-toolbar": resolveData(buttonsIconToolbarConfig as unknown as ConfigBase),
        "buttons-nav-menu": resolveData(buttonsNavMenuConfig as unknown as ConfigBase),
        "buttons-pagination": resolveData(buttonsPaginationConfig as unknown as ConfigBase),
        "buttons-stepper": resolveData(buttonsStepperConfig as unknown as ConfigBase),
        "buttons-toggle-filter": resolveData(buttonsToggleFilterConfig as unknown as ConfigBase),
        "buttons-vertical-stack": resolveData(buttonsVerticalStackConfig as unknown as ConfigBase),
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
        "card-inline": resolveData(cardInlineConfig as unknown as ConfigBase),
        "card-state": resolveData(cardStateConfig as unknown as ConfigBase),
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
    list: {
        "list-actions": resolveData(listActionsConfig as unknown as ConfigBase),
        "list-columns-contacts": resolveData(listColumnsContactsConfig as unknown as ConfigBase),
        "list-file-browser": resolveData(listFileBrowserConfig as unknown as ConfigBase),
        "list-gantt-tasks": resolveData(listGanttTasksConfig as unknown as ConfigBase),
        "list-hierarchy-tree": resolveData(listHierarchyTreeConfig as unknown as ConfigBase),
        "list-icon-led": resolveData(listIconLedConfig as unknown as ConfigBase),
        "list-property-grid": resolveData(listPropertyGridConfig as unknown as ConfigBase),
        "list-select-multiple": resolveData(listSelectMultipleConfig as unknown as ConfigBase),
        "list-select-single": resolveData(listSelectSingleConfig as unknown as ConfigBase),
        "list-simple-horizontal": resolveData(listSimpleHorizontalConfig as unknown as ConfigBase),
        "list-simple-paged": resolveData(listSimplePagedConfig as unknown as ConfigBase),
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
    flow: {
        "flow-arc-trade": resolveData(flowArcTradeConfig as unknown as ConfigBase),
        "flow-chord-trade": resolveData(flowChordTradeConfig as unknown as ConfigBase),
        "flow-force-team": resolveData(flowForceTeamConfig as unknown as ConfigBase),
        "flow-sankey-revenue": resolveData(flowSankeyRevenueConfig as unknown as ConfigBase),
    },
    sheet: {
        "sheet-basic": resolveData(sheetBasicConfig as unknown as ConfigBase),
        "sheet-columns-only": resolveData(sheetColumnsOnlyConfig as unknown as ConfigBase),
        "sheet-compact": resolveData(sheetCompactConfig as unknown as ConfigBase),
        "sheet-dark": resolveData(sheetDarkConfig as unknown as ConfigBase),
        "sheet-empty": resolveData(sheetEmptyConfig as unknown as ConfigBase),
        "sheet-grouped": resolveData(sheetGroupedConfig as unknown as ConfigBase),
        "sheet-key-value": resolveData(sheetKeyValueConfig as unknown as ConfigBase),
        "sheet-pivot": resolveData(sheetPivotConfig as unknown as ConfigBase),
        "sheet-rows-only": resolveData(sheetRowsOnlyConfig as unknown as ConfigBase),
        "sheet-single-column": resolveData(sheetSingleColumnConfig as unknown as ConfigBase),
        "sheet-skeleton": resolveData(sheetSkeletonConfig as unknown as ConfigBase),
        "sheet-spreadsheet": resolveData(sheetSpreadsheetConfig as unknown as ConfigBase),
        "sheet-status": resolveData(sheetStatusConfig as unknown as ConfigBase),
        "sheet-striped": resolveData(sheetStripedConfig as unknown as ConfigBase),
    },
    table: {
        "table-basic": resolveData(tableBasicConfig as unknown as ConfigBase),
        "table-row-numbers": resolveData(tableRowNumbersConfig as unknown as ConfigBase),
        "table-transactions": resolveData(tableTransactionsConfig as unknown as ConfigBase),
        "table-contacts": resolveData(tableContactsConfig as unknown as ConfigBase),
        "table-events": resolveData(tableEventsConfig as unknown as ConfigBase),
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
    hierarchy: {
        "hierarchy-icicle-disk": resolveData(hierarchyIcicleDiskConfig as unknown as ConfigBase),
        "hierarchy-pack-budget": resolveData(hierarchyPackBudgetConfig as unknown as ConfigBase),
        "hierarchy-sunburst-disk": resolveData(hierarchySunburstDiskConfig as unknown as ConfigBase),
        "hierarchy-treemap-disk": resolveData(hierarchyTreemapDiskConfig as unknown as ConfigBase),
    },
    week: {
        "week1": resolveData(week1Config as unknown as ConfigBase),
        "week2": resolveData(week2Config as unknown as ConfigBase),
        "week3": resolveData(week3Config as unknown as ConfigBase),
    },
};
