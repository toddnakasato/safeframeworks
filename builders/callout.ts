import type { ConfigBase, SafeFireContext } from "../../safecontracts/src/contracts";
import { elAttrs, applyIntent } from "../utils/util";

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
        "data-position": position
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
