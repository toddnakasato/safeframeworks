import type { ConfigBase, OnSafeEvent } from "../../safecontracts/src/contracts";
import { el } from "./util";
import { fireLayout } from "../../safecontracts/src/contracts-emit";
import { LAYOUT_VARIANTS } from "../../safecontracts/src/contracts";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeLayout(container: HTMLElement, config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
    const instanceId = config.metadata?.name as string | undefined;
    const metadata = config.metadata;
    const variant = (metadata.variant as string) ?? "single";
    const backLabel = metadata.backLabel as string | undefined;

    const root = el("div");
    root.setAttribute("data-component", "layout");
    root.setAttribute("data-variant", variant);

    if (backLabel) {
        const back = el("button", "layout-back", backLabel);
        back.onclick = () => fireLayout(onEvent, "back", {}, { instanceId });
        root.appendChild(back);
    }

    root.appendChild(el("div", "layout-note", `Layout variant: ${variant}`));

    const regions: string[] = variant === "stack"
        ? Object.keys(config.children ?? {})
        : [...(LAYOUT_VARIANTS[variant] ?? ["main"])];

    for (const region of regions) {
        const r = el("div", "layout-region", region);
        r.setAttribute("data-region", region);
        root.appendChild(r);
    }

    container.appendChild(root);
    return root;
}

export function initSafeLayouts(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-layout-config]").forEach((host) => {
        if (host.dataset.layoutMounted) return;
        host.dataset.layoutMounted = "1";
        const config = JSON.parse(host.dataset.layoutConfig!) as ConfigBase;
        createSafeLayout(host, config);
    });
}
