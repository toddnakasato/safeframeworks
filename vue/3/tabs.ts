/**
 * Tabs builder for this renderer's SafeTabs — tabbed panel navigation.
 *
 * Framework-agnostic DOM port of the react SafeTabs implementation:
 *   Variants: default (underline), pill, boxed.
 *   Position: top, bottom, left, right.
 *
 * Structure + data-* attributes, plus the same structural inline styles the
 * react JSX sets (flex direction / borders / paddings) so one stylesheet
 * covers both. Active-tab state lives in the builder closure. Each tab maps
 * to a child ConfigBase via key; the panel renders an empty
 * [data-tab-content][data-tab-key] marker — the consumer renders
 * children[active] into it. Fires "select" with the active tab key.
 */
import type { ConfigBase, OnSafeEvent } from "../../../safecontracts/src/contracts";
import { createSafeEvent } from "../../../safecontracts/src/contracts";

interface TabItem {
    key: string;
    label: string;
    icon?: string;
    badge?: string | number;
}

/** Build the tabs into a container. Returns the root for removal. */
export function createSafeTabs(container: HTMLElement, config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
    const { metadata, children } = config;
    const tabs: TabItem[] = (metadata.tabs as TabItem[]) ?? [];
    const variant = (metadata.variant as string) ?? "default";
    const position = (metadata.position as string) ?? "top";
    let active = (metadata.defaultActive as string) ?? tabs[0]?.key ?? "";

    const isVertical = position === "left" || position === "right";
    const borderStyle = "1px solid var(--sd-border, var(--border, #ccc))";

    const root = document.createElement("div");
    root.setAttribute("data-component", "tabs");
    root.setAttribute("data-variant", variant);
    root.setAttribute("data-position", position);
    root.style.display = "flex";
    root.style.flexDirection = isVertical
        ? (position === "left" ? "row" : "row-reverse")
        : (position === "top" ? "column" : "column-reverse");

    function render() {
        root.replaceChildren();

        /* Tab bar */
        const bar = document.createElement("div");
        bar.setAttribute("data-tabs-bar", "");
        bar.style.display = "flex";
        bar.style.flexDirection = isVertical ? "column" : "row";
        bar.style.gap = variant === "pill" ? "4px" : "0";
        if (isVertical) {
            if (position === "left") bar.style.borderRight = borderStyle;
            if (position === "right") bar.style.borderLeft = borderStyle;
            bar.style.padding = "4px";
        } else {
            if (position === "top") bar.style.borderBottom = borderStyle;
            if (position === "bottom") bar.style.borderTop = borderStyle;
        }

        for (const tab of tabs) {
            const btn = document.createElement("button");
            btn.setAttribute("data-tab", "");
            if (active === tab.key) btn.setAttribute("data-active", "");
            btn.onclick = () => {
                active = tab.key;
                onEvent?.(createSafeEvent("tabs", "select", { key: tab.key }));
                render();
            };
            btn.style.display = "flex";
            btn.style.alignItems = "center";
            btn.style.gap = "6px";
            btn.style.padding = variant === "pill" ? "6px 14px" : "8px 16px";
            btn.style.border = "none";
            btn.style.cursor = "pointer";
            btn.style.fontWeight = active === tab.key ? "600" : "400";
            btn.style.background = "transparent";
            btn.style.color = "inherit";

            if (tab.icon) {
                const icon = document.createElement("span");
                icon.textContent = tab.icon;
                btn.appendChild(icon);
            }
            const label = document.createElement("span");
            label.textContent = tab.label;
            btn.appendChild(label);
            if (tab.badge !== undefined) {
                const badge = document.createElement("span");
                badge.setAttribute("data-tab-badge", "");
                badge.style.fontSize = "10px";
                badge.style.fontWeight = "600";
                badge.style.padding = "1px 6px";
                badge.style.borderRadius = "10px";
                badge.textContent = String(tab.badge);
                btn.appendChild(badge);
            }
            bar.appendChild(btn);
        }
        root.appendChild(bar);

        /* Active panel — only render if children exist */
        if (children && Object.keys(children).length > 0) {
            const panel = document.createElement("div");
            panel.setAttribute("data-tabs-panel", "");
            panel.style.flex = "1";
            panel.style.overflow = "auto";
            if ((children as Record<string, any>)[active]) {
                const content = document.createElement("div");
                content.setAttribute("data-tab-content", "");
                content.setAttribute("data-tab-key", active);
                /* Consumer renders children[active] via renderConfigBase */
                panel.appendChild(content);
            }
            root.appendChild(panel);
        }
    }
    render();

    container.appendChild(root);
    return root;
}

/**
 * Scan-and-mount for server-rendered hosts (Astro): build tabs in every
 * div[data-tabs-config] not yet mounted.
 */
export function initSafeTabs(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-tabs-config]").forEach((host) => {
        if (host.dataset.tabsMounted) return;
        host.dataset.tabsMounted = "1";
        const config = JSON.parse(host.dataset.tabsConfig!) as ConfigBase;
        createSafeTabs(host, config);
    });
}
