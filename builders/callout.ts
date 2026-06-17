import type { ConfigBase, SafeFireContext } from "../../safecontracts/src/contracts";
import { elAttrs, applyIntent } from "../utils/util";

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

export function createSafeCallout(container: HTMLElement, config: ConfigBase, ctx?: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    const variant = (metadata.variant as string) ?? "insight";
    const message = (metadata.message as string) ?? "";
    const position = (metadata.position as string) ?? "right";

    const root = elAttrs("div", {
        "data-component": "callout",
        "data-variant": variant,
        "data-position": position,
    });
    applyIntent(root, metadata);

    root.appendChild(elAttrs("div", { "data-role": "callout-dot" }));
    const msg = elAttrs("div", { "data-role": "callout-message" });
    msg.textContent = message;
    root.appendChild(msg);
    root.appendChild(elAttrs("div", { "data-role": "callout-arrow" }));

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