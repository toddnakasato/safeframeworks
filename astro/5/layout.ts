/**
 * Layout builder for this renderer's SafeLayout — named-region composition.
 *
 * Framework-agnostic structural shell of the react JSX implementation.
 * The react version composes live child ReactNodes into regions; outside the
 * react renderer the builders cannot recurse into a full renderer, so each
 * region renders as a labelled container instead (same visible output as the
 * previous stub shells), with contract-true data-* markup.
 *
 * Structure + data-* attributes ONLY — paint lives in safestyles.
 * Events: "back" (back button). Same data-component/data-variant markup as
 * the react JSX implementation, so one stylesheet covers both.
 */
import type { ConfigBase, OnSafeEvent } from "../../../safecontracts/src/contracts";
import { createSafeEvent, LAYOUT_VARIANTS } from "../../../safecontracts/src/contracts";

function el(tag: string, role?: string, text?: string): HTMLElement {
    const e = document.createElement(tag);
    if (role) e.setAttribute("data-role", role);
    if (text != null) e.textContent = text;
    return e;
}

/** Build the layout shell into a container. Returns the root for removal. */
export function createSafeLayout(container: HTMLElement, config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
    const metadata = config.metadata;
    const variant = (metadata.variant as string) ?? "single";
    const backLabel = metadata.backLabel as string | undefined;

    const root = el("div");
    root.setAttribute("data-component", "layout");
    root.setAttribute("data-variant", variant);

    if (backLabel) {
        const back = el("button", "layout-back", backLabel);
        back.onclick = () => onEvent?.(createSafeEvent("layout", "back", {}));
        root.appendChild(back);
    }

    root.appendChild(el("div", "layout-note", `Layout variant: ${variant}`));

    // Region containers: variant's named regions, or child keys for "stack".
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

/**
 * Scan-and-mount for server-rendered hosts (Astro): build a layout in every
 * div[data-layout-config] not yet mounted.
 */
export function initSafeLayouts(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-layout-config]").forEach((host) => {
        if (host.dataset.layoutMounted) return;
        host.dataset.layoutMounted = "1";
        const config = JSON.parse(host.dataset.layoutConfig!) as ConfigBase;
        createSafeLayout(host, config);
    });
}
