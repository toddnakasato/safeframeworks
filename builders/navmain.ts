import type { ConfigBase, OnSafeEvent, SafeFireContext } from "../../safecontracts/src/contracts";
import { el } from "../utils/util";

export type RenderChild = (config: ConfigBase, onEvent?: OnSafeEvent, container?: HTMLElement) => HTMLElement;

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeNavMain(
    container: HTMLElement,
    config: ConfigBase,
    _ctx?: SafeFireContext,
    renderChild?: RenderChild,
): HTMLElement {
    const metadata = config.metadata;
    const variant = (metadata.variant as string) ?? "default";
    const width = metadata.width as string | undefined;

    const children = Object.entries(config.children ?? {});
    const hasHeader = children.some(([, c]) => (c as any).metadata?.position === "header");
    const hasFooter = children.some(([, c]) => (c as any).metadata?.position === "footer");

    const root = el("div");
    root.setAttribute("data-component", "navmain");
    root.setAttribute("data-variant", variant);
    if (width) root.style.width = width;

    if (variant === "default") {
        for (const [key, childConfig] of children) {
            const cell = el("div", "navmain-item");
            cell.setAttribute("data-key", key);
            if (renderChild) renderChild(childConfig as ConfigBase, undefined, cell);
            root.appendChild(cell);
        }
    } else {
        const headerEl = (variant === "header" || variant === "header-footer") ? el("div", "navmain-header") : null;
        const bodyEl = el("div", "navmain-body");
        const footerEl = (variant === "footer" || variant === "header-footer") ? el("div", "navmain-footer") : null;

        for (const [key, childConfig] of children) {
            const childMeta = (childConfig as any).metadata ?? {};
            const position = childMeta.position as string | undefined;
            const cell = el("div", "navmain-item");
            cell.setAttribute("data-key", key);
            if (renderChild) renderChild(childConfig as ConfigBase, undefined, cell);

            if (position === "header" && headerEl) {
                headerEl.appendChild(cell);
            } else if (position === "footer" && footerEl) {
                footerEl.appendChild(cell);
            } else {
                bodyEl.appendChild(cell);
            }
        }

        if (headerEl) root.appendChild(headerEl);
        root.appendChild(bodyEl);
        if (footerEl) root.appendChild(footerEl);
    }

    container.appendChild(root);
    return root;
}
