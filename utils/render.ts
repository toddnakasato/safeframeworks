/**
 * utils/render.ts — universal component renderer.
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
import { buildPayloadViaCli } from "./payload-delegate";
import { createSafeButton } from "../builders/button";
import { createSafeCalendar } from "../builders/calendar";
import { createSafeCallout } from "../builders/callout";
import { createSafeCard } from "../builders/card";
import { createSafeChat } from "../builders/chat";
import { createSafeColumns } from "../builders/columns";
import { createSafeDragDrop } from "../builders/dragdrop";
import { createSafeFunnel } from "../builders/funnel";
import { createSafeGauge } from "../builders/gauge";
import { createSafeGrid } from "../builders/grid";
import { createSafeHeatmap } from "../builders/heatmap";
import { createSafeHierarchy } from "../builders/hierarchy";
import { createSafeInput } from "../builders/input";
import { createSafeLayout } from "../builders/layout";
import { createSafeList } from "../builders/list";
import { createSafeMetric } from "../builders/metric";
import { createSafeNav } from "../builders/nav";
import { createSafeNavMain } from "../builders/navmain";
import { createSafePicker } from "../builders/picker";
import { createSafeSheet } from "../builders/sheet";
import { createSafeTable } from "../builders/table";
import { createSafeTabs } from "../builders/tabs";
import { createSafeTimeline } from "../builders/timeline";
import { createSafeToggle } from "../builders/toggle";
import { createSafeTree } from "../builders/tree";
import { createSafeBriefing } from "../builders/briefing";
import { createSafePlan } from "../builders/plan";
import { createSafeSkillUp } from "../builders/skillup";
import { createSafeDispatch } from "../builders/dispatch";
import { createSafeParser } from "../builders/parser";
import { createSafeWeek } from "../builders/week";
import { createSafeProofViewer } from "../dev/proof-viewer";
import { createSafeChart } from "../builders/chart";
import { createSafeFlow, flowData } from "../builders/flow";
import { createSafeMap, mapData } from "../builders/map";
import { createSafeScene } from "../builders/scene";
import { createSafeStoryFlow } from "../builders/storyflow";

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
        case "briefing":
            createSafeBriefing(container, config, ctx, buildComponent);
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
        case "navmain":
            createSafeNavMain(container, config, ctx);
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
        case "plan":
            createSafePlan(container, config, ctx);
            break;
        case "skillup":
            createSafeSkillUp(container, config, ctx);
            break;
        case "dispatch":
            createSafeDispatch(container, config, ctx);
            break;
        case "parser":
            createSafeParser(container, config, ctx);
            break;
        case "week":
            createSafeWeek(container, config, ctx);
            break;
        case "chart": {
            const canvas = document.createElement("canvas");
            container.appendChild(canvas);
            createSafeChart(canvas, config, ctx);
            break;
        }
        case "flow": {
            const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgEl.style.width = "100%";
            svgEl.style.maxWidth = "600px";
            svgEl.style.display = "block";
            container.appendChild(svgEl);
            createSafeFlow(svgEl, config, flowData(config), ctx);
            break;
        }
        case "map":
            container.style.height = ((config.metadata?.height as string) ?? "400px");
            createSafeMap(container, config, mapData(config), ctx);
            break;
        case "scene":
            createSafeScene(container, config, ctx);
            break;
        case "story-flow":
            createSafeStoryFlow(container, config, ctx);
            break;
        case "proof-viewer":
            createSafeProofViewer(container, config, stampedOnEvent);
            break;
        default:
            container.appendChild(el("div", `Unknown component: ${component}`));
    }

    return container;
}
