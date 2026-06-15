/**
 * builders/render.ts — universal component renderer.
 *
 * Given a ConfigBase, dispatches to the correct createSafe* builder.
 * Used by createSafeLayout's renderChild callback to recursively
 * build children into regions. Framework-free.
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
 * Stamps the eventHandler.handler on onEvent before passing to child builders —
 * same logic as SafeRenderer's stampedOnEvent.
 */
export function buildComponent(config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
    const component = config.component ?? (config.metadata?.component as string);
    const container = document.createElement("div");

    // Stamp handler — same logic as SafeRenderer lines 62-77
    const handler = config.eventHandler?.handler;
    const stampedOnEvent: OnSafeEvent | undefined =
        onEvent && handler
            ? (event) => onEvent({ ...event, handler })
            : onEvent;

    switch (component) {
        case "layout":
            createSafeLayout(container, config, stampedOnEvent, buildComponent);
            break;
        case "button":
            createSafeButton(container, config, stampedOnEvent);
            break;
        case "calendar":
            createSafeCalendar(container, config, stampedOnEvent);
            break;
        case "callout":
            createSafeCallout(container, config, stampedOnEvent);
            break;
        case "card":
            createSafeCard(container, config, stampedOnEvent);
            break;
        case "chat":
            createSafeChat(container, config, stampedOnEvent);
            break;
        case "columns":
            createSafeColumns(container, config, stampedOnEvent);
            break;
        case "drag-drop":
            createSafeDragDrop(container, config, stampedOnEvent);
            break;
        case "funnel":
            createSafeFunnel(container, config, stampedOnEvent);
            break;
        case "gauge":
            createSafeGauge(container, config, stampedOnEvent);
            break;
        case "grid":
            createSafeGrid(container, config, stampedOnEvent);
            break;
        case "heatmap":
            createSafeHeatmap(container, config, stampedOnEvent);
            break;
        case "hierarchy":
            createSafeHierarchy(container, config, stampedOnEvent);
            break;
        case "input":
            createSafeInput(container, config, stampedOnEvent);
            break;
        case "list":
            createSafeList(container, config, stampedOnEvent);
            break;
        case "metric":
            createSafeMetric(container, config, stampedOnEvent);
            break;
        case "nav":
            createSafeNav(container, config, stampedOnEvent);
            break;
        case "picker":
            createSafePicker(container, config, stampedOnEvent);
            break;
        case "sheet":
            createSafeSheet(container, config, stampedOnEvent);
            break;
        case "table":
            createSafeTable(container, config, stampedOnEvent);
            break;
        case "tabs":
            createSafeTabs(container, config, stampedOnEvent);
            break;
        case "timeline":
            createSafeTimeline(container, config, stampedOnEvent);
            break;
        case "toggle":
            createSafeToggle(container, config, stampedOnEvent);
            break;
        case "tree":
            createSafeTree(container, config, stampedOnEvent);
            break;
        case "week":
            createSafeWeek(container, config, stampedOnEvent);
            break;
        default:
            container.appendChild(el("div", `Unknown component: ${component}`));
    }

    return container;
}
