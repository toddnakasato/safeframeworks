/**
 * builders/render.ts — universal component renderer.
 *
 * Given a ConfigBase, dispatches to the correct createSafe* builder.
 * Used by createSafeLayout's renderChild callback to recursively
 * build children into regions. Framework-free.
 *
 * Creates a SafeFireContext per component so builders fire events via
 * ctx.fire("event", { coords }) — no per-builder fire wrappers.
 */
import type { ConfigBase, OnSafeEvent, SafeFireContext } from "../../safecontracts/src/contracts";
import { createSafeFireContext } from "../../safecontracts/src/contracts";
import { buildPayloadViaCli } from "../utils/payload-delegate";
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
import { createSafeProofViewer } from "../dev/proof-viewer";

const el = (tag: string, text?: string): HTMLElement => {
    const e = document.createElement(tag);
    if (text) e.textContent = text;
    return e;
};

/**
 * Render any ConfigBase to a DOM element using the shared builders.
 * Stamps the eventHandler.handler on onEvent before passing to child builders —
 * same logic as SafeRenderer's ctx.
 * Creates a SafeFireContext so builders fire via ctx.fire().
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

    // Create SafeFireContext — one per component, passed to every builder
    const ctx = createSafeFireContext(config, stampedOnEvent, buildPayloadViaCli);

    switch (component) {
        case "layout":
            createSafeLayout(container, config, stampedOnEvent, buildComponent);
            break;
        case "button":
            createSafeButton(container, config, ctx);
            break;
        case "calendar":
            createSafeCalendar(container, config, ctx);
            break;
        case "callout":
            createSafeCallout(container, config, ctx);
            break;
        case "card":
            createSafeCard(container, config, ctx);
            break;
        case "chat":
            createSafeChat(container, config, ctx);
            break;
        case "columns":
            createSafeColumns(container, config, ctx);
            break;
        case "drag-drop":
            createSafeDragDrop(container, config, ctx);
            break;
        case "funnel":
            createSafeFunnel(container, config, ctx);
            break;
        case "gauge":
            createSafeGauge(container, config, ctx);
            break;
        case "grid":
            createSafeGrid(container, config, ctx);
            break;
        case "heatmap":
            createSafeHeatmap(container, config, ctx);
            break;
        case "hierarchy":
            createSafeHierarchy(container, config, ctx);
            break;
        case "input":
            createSafeInput(container, config, ctx);
            break;
        case "list":
            createSafeList(container, config, ctx);
            break;
        case "metric":
            createSafeMetric(container, config, ctx);
            break;
        case "nav":
            createSafeNav(container, config, ctx);
            break;
        case "picker":
            createSafePicker(container, config, ctx);
            break;
        case "sheet":
            createSafeSheet(container, config, ctx);
            break;
        case "table":
            createSafeTable(container, config, ctx);
            break;
        case "tabs":
            createSafeTabs(container, config, ctx);
            break;
        case "timeline":
            createSafeTimeline(container, config, ctx);
            break;
        case "toggle":
            createSafeToggle(container, config, ctx);
            break;
        case "tree":
            createSafeTree(container, config, ctx);
            break;
        case "week":
            createSafeWeek(container, config, ctx);
            break;
        case "proof-viewer":
            createSafeProofViewer(container, config, stampedOnEvent);
            break;
        default:
            container.appendChild(el("div", `Unknown component: ${component}`));
    }

    return container;
}
