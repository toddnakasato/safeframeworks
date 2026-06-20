import type { ConfigBase, OnSafeEvent } from "../../safecontracts/src/contracts";
import { el } from "../utils/util";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import { LAYOUT_VARIANTS } from "../../safecontracts/src/contracts";

/**
 * Render callback — the host provides this so the layout builder
 * can render any child ConfigBase into a DOM element.
 */
export type RenderChild = (config: ConfigBase, onEvent?: OnSafeEvent) => HTMLElement;

/**
 * Create a layout component. Regions are determined by the variant.
 * Children are rendered into regions via the renderChild callback.
 */
export function createSafeLayout(
    container: HTMLElement,
    config: ConfigBase,
    onEvent?: OnSafeEvent,
    renderChild?: RenderChild,
): HTMLElement {
    const metadata = config.metadata;
    const variant = (metadata.variant as string) ?? "single";
    const columns = metadata.columns as string | undefined;
    const backLabel = metadata.backLabel as string | undefined;

    const root = el("div");
    root.setAttribute("data-component", "layout");
    root.setAttribute("data-variant", variant);

    // External paint state (resolved from state.json by host)
    const _activeScene = metadata.activeScene ?? null;
    if (_activeScene != null) root.setAttribute("data-active-scene", String(_activeScene));

    // Custom grid columns/rows override from metadata
    if (columns) {
        if (variant === "left-main" || variant === "main-detail" || variant === "left-main-right") {
            root.style.gridTemplateColumns = columns;
        } else if (variant === "header-main" || variant === "header-main-detail") {
            root.style.gridTemplateRows = columns;
        }
    }

    if (backLabel) {
        const back = el("button", "layout-back", backLabel);
        back.onclick = () => { if (onEvent) onEvent({ id: "", name: "back", origin: { kind: "app", id: config.metadata?.id as string ?? "layout" }, data: {}, ts: new Date().toISOString() }); };
        root.appendChild(back);
    }

    const regionNames: string[] = variant === "stack"
        ? Object.keys(config.children ?? {})
        : [...(LAYOUT_VARIANTS[variant] ?? ["main"])];

    for (const region of regionNames) {
        const r = el("div");
        r.setAttribute("data-role", "layout-region");
        r.setAttribute("data-region", region);

        // Render child into region
        const child = config.children?.[region];
        if (child && renderChild) {
            r.appendChild(renderChild(child, onEvent));
        }

        root.appendChild(r);
    }

    container.appendChild(root);
    return root;
}
