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
import calendarSingleMonthConfig from "./config/calendar/calendar-single-month.json";
import calendarBrowseConfig from "./config/calendar/calendar-browse.json";
import calendarDetailLeftConfig from "./config/calendar/calendar-detail-left.json";
import calendarDetailRightConfig from "./config/calendar/calendar-detail-right.json";
import calendarYearHorizontalConfig from "./config/calendar/calendar-year-horizontal.json";
import calendarYearConfig from "./config/calendar/calendar-year.json";
import calloutInfoConfig from "./config/callout/callout-info.json";
import calloutWarningConfig from "./config/callout/callout-warning.json";
import cardOutlineConfig from "./config/card/card-outline.json";
import cardElevatedConfig from "./config/card/card-elevated.json";
import cardInlineConfig from "./config/card/card-inline.json";
import cardStateConfig from "./config/card/card-state.json";
import chartBarConfig from "./config/chart/chart-bar.json";
import chartPieConfig from "./config/chart/chart-pie.json";
import chatConversationConfig from "./config/chat/chat-conversation.json";
import chatSimpleConfig from "./config/chat/chat-simple.json";
import columnsTwoConfig from "./config/columns/columns-two.json";
import columnsThreeConfig from "./config/columns/columns-three.json";
import dragDropListConfig from "./config/drag-drop/drag-drop-list.json";
import dragDropKanbanConfig from "./config/drag-drop/drag-drop-kanban.json";
import funnelVerticalConfig from "./config/funnel/funnel-vertical.json";
import funnelHorizontalConfig from "./config/funnel/funnel-horizontal.json";
import gaugeRadialConfig from "./config/gauge/gauge-radial.json";
import gaugeMinimalConfig from "./config/gauge/gauge-minimal.json";
import gridDetailConfig from "./config/grid/grid-detail.json";
import gridCompactConfig from "./config/grid/grid-compact.json";
import heatmapMatrixConfig from "./config/heatmap/heatmap-matrix.json";
import heatmapDenseConfig from "./config/heatmap/heatmap-dense.json";
import inputFormConfig from "./config/input/input-form.json";
import inputSingleConfig from "./config/input/input-single.json";
import layoutStackConfig from "./config/layout/layout-stack.json";
import layoutSidebarConfig from "./config/layout/layout-sidebar.json";
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
import mapMarkersConfig from "./config/map/map-markers.json";
import mapPathConfig from "./config/map/map-path.json";
import navHorizontalConfig from "./config/nav/nav-horizontal.json";
import navSidebarConfig from "./config/nav/nav-sidebar.json";
import pickerListConfig from "./config/picker/picker-list.json";
import pickerCardConfig from "./config/picker/picker-card.json";
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
import tabsHorizontalConfig from "./config/tabs/tabs-horizontal.json";
import tabsVerticalConfig from "./config/tabs/tabs-vertical.json";
import timelineVerticalConfig from "./config/timeline/timeline-vertical.json";
import timelineAlternatingConfig from "./config/timeline/timeline-alternating.json";
import timelineRoadmapConfig from "./config/timeline/timeline-roadmap.json";
import timelineCareerConfig from "./config/timeline/timeline-career.json";
import timelineMilestonesConfig from "./config/timeline/timeline-milestones.json";
import timelineSprintConfig from "./config/timeline/timeline-sprint.json";
import timelineScheduleConfig from "./config/timeline/timeline-schedule.json";
import timelineIncidentConfig from "./config/timeline/timeline-incident.json";
import toggleSwitchConfig from "./config/toggle/toggle-switch.json";
import toggleCheckboxConfig from "./config/toggle/toggle-checkbox.json";
import treeNestedConfig from "./config/tree/tree-nested.json";
import treeFlatConfig from "./config/tree/tree-flat.json";
import hierarchyIcicleDiskConfig from "./config/hierarchy/hierarchy-icicle-disk.json";
import hierarchyPackBudgetConfig from "./config/hierarchy/hierarchy-pack-budget.json";
import hierarchySunburstDiskConfig from "./config/hierarchy/hierarchy-sunburst-disk.json";
import hierarchyTreemapDiskConfig from "./config/hierarchy/hierarchy-treemap-disk.json";
import weekFullConfig from "./config/week/week-full.json";
import weekWorkweekConfig from "./config/week/week-workweek.json";
import weekCompactConfig from "./config/week/week-compact.json";

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
        "calendar-single-month": resolveData(calendarSingleMonthConfig as unknown as ConfigBase),
        "calendar-browse": resolveData(calendarBrowseConfig as unknown as ConfigBase),
        "calendar-detail-left": resolveData(calendarDetailLeftConfig as unknown as ConfigBase),
        "calendar-detail-right": resolveData(calendarDetailRightConfig as unknown as ConfigBase),
        "calendar-year-horizontal": resolveData(calendarYearHorizontalConfig as unknown as ConfigBase),
        "calendar-year": resolveData(calendarYearConfig as unknown as ConfigBase),
    },
    callout: {
        "callout-info": resolveData(calloutInfoConfig as unknown as ConfigBase),
        "callout-warning": resolveData(calloutWarningConfig as unknown as ConfigBase),
    },
    card: {
        "card-outline": resolveData(cardOutlineConfig as unknown as ConfigBase),
        "card-elevated": resolveData(cardElevatedConfig as unknown as ConfigBase),
        "card-inline": resolveData(cardInlineConfig as unknown as ConfigBase),
        "card-state": resolveData(cardStateConfig as unknown as ConfigBase),
    },
    chart: {
        "chart-bar": resolveData(chartBarConfig as unknown as ConfigBase),
        "chart-pie": resolveData(chartPieConfig as unknown as ConfigBase),
    },
    chat: {
        "chat-conversation": resolveData(chatConversationConfig as unknown as ConfigBase),
        "chat-simple": resolveData(chatSimpleConfig as unknown as ConfigBase),
    },
    columns: {
        "columns-two": resolveData(columnsTwoConfig as unknown as ConfigBase),
        "columns-three": resolveData(columnsThreeConfig as unknown as ConfigBase),
    },
    "drag-drop": {
        "drag-drop-list": resolveData(dragDropListConfig as unknown as ConfigBase),
        "drag-drop-kanban": resolveData(dragDropKanbanConfig as unknown as ConfigBase),
    },
    funnel: {
        "funnel-vertical": resolveData(funnelVerticalConfig as unknown as ConfigBase),
        "funnel-horizontal": resolveData(funnelHorizontalConfig as unknown as ConfigBase),
    },
    gauge: {
        "gauge-radial": resolveData(gaugeRadialConfig as unknown as ConfigBase),
        "gauge-minimal": resolveData(gaugeMinimalConfig as unknown as ConfigBase),
    },
    grid: {
        "grid-detail": resolveData(gridDetailConfig as unknown as ConfigBase),
        "grid-compact": resolveData(gridCompactConfig as unknown as ConfigBase),
    },
    heatmap: {
        "heatmap-matrix": resolveData(heatmapMatrixConfig as unknown as ConfigBase),
        "heatmap-dense": resolveData(heatmapDenseConfig as unknown as ConfigBase),
    },
    input: {
        "input-form": resolveData(inputFormConfig as unknown as ConfigBase),
        "input-single": resolveData(inputSingleConfig as unknown as ConfigBase),
    },
    layout: {
        "layout-stack": resolveData(layoutStackConfig as unknown as ConfigBase),
        "layout-sidebar": resolveData(layoutSidebarConfig as unknown as ConfigBase),
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
        "map-markers": resolveData(mapMarkersConfig as unknown as ConfigBase),
        "map-path": resolveData(mapPathConfig as unknown as ConfigBase),
    },
    nav: {
        "nav-horizontal": resolveData(navHorizontalConfig as unknown as ConfigBase),
        "nav-sidebar": resolveData(navSidebarConfig as unknown as ConfigBase),
    },
    picker: {
        "picker-list": resolveData(pickerListConfig as unknown as ConfigBase),
        "picker-card": resolveData(pickerCardConfig as unknown as ConfigBase),
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
        "tabs-horizontal": resolveData(tabsHorizontalConfig as unknown as ConfigBase),
        "tabs-vertical": resolveData(tabsVerticalConfig as unknown as ConfigBase),
    },
    timeline: {
        "timeline-vertical": resolveData(timelineVerticalConfig as unknown as ConfigBase),
        "timeline-alternating": resolveData(timelineAlternatingConfig as unknown as ConfigBase),
        "timeline-roadmap": resolveData(timelineRoadmapConfig as unknown as ConfigBase),
        "timeline-career": resolveData(timelineCareerConfig as unknown as ConfigBase),
        "timeline-milestones": resolveData(timelineMilestonesConfig as unknown as ConfigBase),
        "timeline-sprint": resolveData(timelineSprintConfig as unknown as ConfigBase),
        "timeline-schedule": resolveData(timelineScheduleConfig as unknown as ConfigBase),
        "timeline-incident": resolveData(timelineIncidentConfig as unknown as ConfigBase),
    },
    toggle: {
        "toggle-switch": resolveData(toggleSwitchConfig as unknown as ConfigBase),
        "toggle-checkbox": resolveData(toggleCheckboxConfig as unknown as ConfigBase),
    },
    tree: {
        "tree-nested": resolveData(treeNestedConfig as unknown as ConfigBase),
        "tree-flat": resolveData(treeFlatConfig as unknown as ConfigBase),
    },
    hierarchy: {
        "hierarchy-icicle-disk": resolveData(hierarchyIcicleDiskConfig as unknown as ConfigBase),
        "hierarchy-pack-budget": resolveData(hierarchyPackBudgetConfig as unknown as ConfigBase),
        "hierarchy-sunburst-disk": resolveData(hierarchySunburstDiskConfig as unknown as ConfigBase),
        "hierarchy-treemap-disk": resolveData(hierarchyTreemapDiskConfig as unknown as ConfigBase),
    },
    week: {
        "week-full": resolveData(weekFullConfig as unknown as ConfigBase),
        "week-workweek": resolveData(weekWorkweekConfig as unknown as ConfigBase),
        "week-compact": resolveData(weekCompactConfig as unknown as ConfigBase),
    },
};
