import type { ConfigBase, SafeFireContext } from "../../safecontracts/src/contracts";

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

function el(tag: string, attrs: Record<string, string> = {}): HTMLElement {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeCallout(container: HTMLElement, config: ConfigBase, ctx?: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    const variant = (metadata.variant as string) ?? "insight";
    const message = (metadata.message as string) ?? "";
    const position = (metadata.position as string) ?? "right";

    const root = el("div", {
        "data-component": "callout",
        "data-variant": variant,
        "data-position": position,
    });

    root.appendChild(el("div", { "data-role": "callout-dot" }));
    const msg = el("div", { "data-role": "callout-message" });
    msg.textContent = message;
    root.appendChild(msg);
    root.appendChild(el("div", { "data-role": "callout-arrow" }));

    container.appendChild(root);
    return root;
}

export function initSafeCallouts(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-callout-config]").forEach((host) => {
        if (host.dataset.calloutMounted) return;
        host.dataset.calloutMounted = "1";
        const config = JSON.parse(host.dataset.calloutConfig!) as ConfigBase;
        createSafeCallout(host, config);
    });
}
