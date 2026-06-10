/**
 * Callout builder for this renderer's SafeCallout — positioned annotation
 * bubble.
 *
 * Framework-agnostic DOM port of the react SafeCallout. Display-only:
 * colored dot + message + pointer arrow. Data-attributes for variant and
 * position — paint lives in safestyles. Same data-role markup as the react
 * JSX implementation, so one stylesheet covers both. Fires no events.
 */
import type { ConfigBase, OnSafeEvent } from "../../../safecontracts/src/contracts";

function el(tag: string, attrs: Record<string, string> = {}): HTMLElement {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
}

/** Build the callout into a container. Returns the root for removal. */
export function createSafeCallout(container: HTMLElement, config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
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

/**
 * Scan-and-mount for server-rendered hosts (Astro): build a callout in every
 * div[data-callout-config] not yet mounted.
 */
export function initSafeCallouts(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-callout-config]").forEach((host) => {
        if (host.dataset.calloutMounted) return;
        host.dataset.calloutMounted = "1";
        const config = JSON.parse(host.dataset.calloutConfig!) as ConfigBase;
        createSafeCallout(host, config);
    });
}
