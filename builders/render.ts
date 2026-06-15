/**
 * builders/render.ts — universal component renderer.
 *
 * Given a ConfigBase, dispatches to the correct createSafe* builder.
 * Used by createSafeLayout's renderChild callback to recursively
 * render children into regions. Framework-free.
 */
import type { ConfigBase, OnSafeEvent } from "../../safecontracts/src/contracts";
import { createSafeButton } from "./button";
import { createSafeCalendar } from "./calendar";
import { createSafeCallout } from "./callout";
import { createSafeCard } from "./card";
import { createSafeChat } from "./chat";
import { createSafeColumns } from "./columns";
import { createSafeDragDrop } from "./dragdrop";
import { createSafeFunnel } from "./funnel";
import { createSafeGauge } from "./gauge";
import { createSafeGrid } from "./grid";
import { createSafeHeatmap } from "./heatmap";
import { createSafeHierarchy } from "./hierarchy";
import { createSafeInput } from "./input";
import { createSafeLayout } from "./layout";
import { createSafeList } from "./list";
import { createSafeMetric } from "./metric";
import { createSafeNav } from "./nav";
import { createSafePicker } from "./picker";
import { createSafeSheet } from "./sheet";
import { createSafeTable } from "./table";
import { createSafeTabs } from "./tabs";
import { createSafeTimeline } from "./timeline";
import { createSafeToggle } from "./toggle";
import { createSafeTree } from "./tree";
import { createSafeWeek } from "./week";

const el = (tag: string, text?: string): HTMLElement => {
    const e = document.createElement(tag);
    if (text) e.textContent = text;
    return e;
};

/**
 * Render any ConfigBase to a DOM element using the shared builders.
 * This is the universal renderChild callback for layout and other containers.
 */
export function renderConfigToDom(config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
    const component = config.component ?? (config.metadata?.component as string);
    const container = document.createElement("div");

    switch (component) {
        case "layout":
            createSafeLayout(container, config, onEvent, renderConfigToDom);
            break;
        case "button":
            createSafeButton(container, config, onEvent);
            break;
        case "calendar":
            createSafeCalendar(container, config, onEvent);
            break;
        case "callout":
            createSafeCallout(container, config, onEvent);
            break;
        case "card":
            createSafeCard(container, config, onEvent);
            break;
        case "chat":
            createSafeChat(container, config, onEvent);
            break;
        case "columns":
            createSafeColumns(container, config, onEvent);
            break;
        case "drag-drop":
            createSafeDragDrop(container, config, onEvent);
            break;
        case "funnel":
            createSafeFunnel(container, config, onEvent);
            break;
        case "gauge":
            createSafeGauge(container, config, onEvent);
            break;
        case "grid":
            createSafeGrid(container, config, onEvent);
            break;
        case "heatmap":
            createSafeHeatmap(container, config, onEvent);
            break;
        case "hierarchy":
            createSafeHierarchy(container, config, onEvent);
            break;
        case "input":
            createSafeInput(container, config, onEvent);
            break;
        case "list":
            createSafeList(container, config, onEvent);
            break;
        case "metric":
            createSafeMetric(container, config, onEvent);
            break;
        case "nav":
            createSafeNav(container, config, onEvent);
            break;
        case "picker":
            createSafePicker(container, config, onEvent);
            break;
        case "sheet":
            createSafeSheet(container, config, onEvent);
            break;
        case "table":
            createSafeTable(container, config, onEvent);
            break;
        case "tabs":
            createSafeTabs(container, config, onEvent);
            break;
        case "timeline":
            createSafeTimeline(container, config, onEvent);
            break;
        case "toggle":
            createSafeToggle(container, config, onEvent);
            break;
        case "tree":
            createSafeTree(container, config, onEvent);
            break;
        case "week":
            createSafeWeek(container, config, onEvent);
            break;
        default:
            container.appendChild(el("div", `Unknown component: ${component}`));
    }

    return container;
}
