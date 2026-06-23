import type { ConfigBase } from "../../safecontracts/src/contracts";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import { elAttrs, applyPaintState, applyIntent } from "../utils/util";
import type { TabItem } from "../../safecontracts/src/components/tabs";
import { buildComponent } from "../utils/render";

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeTabs(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const { metadata, children } = config;
    const tabs: TabItem[] = (metadata.tabs as TabItem[]) ?? [];
    const variant = (metadata.variant as string) ?? "default";
    const position = (metadata.position as string) ?? "top";
    let active = (metadata.defaultActive as string) ?? tabs[0]?.key ?? "";

    const root = elAttrs("div", { "data-component": "tabs", "data-position": position });
    applyIntent(root, metadata);
    applyPaintState(root, metadata, "tabs");

    // --- Tab bar — built once, listeners stable ---
    const bar = elAttrs("div", { "data-tabs-bar": "", "data-position": position });

    for (const tab of tabs) {
        const btn = elAttrs("button", { "data-tab": "" });
        if (active === tab.key) btn.setAttribute("data-active", "");

        btn.onclick = () => {
            // Update active attr on all buttons
            bar.querySelectorAll("[data-tab]").forEach(b => b.removeAttribute("data-active"));
            btn.setAttribute("data-active", "");
            active = tab.key;
            ctx.fire("select", { key: tab.key });
            mountActive();
        };

        if (tab.icon) {
            const icon = elAttrs("span", { "data-role": "tab-icon" });
            icon.textContent = tab.icon;
            btn.appendChild(icon);
        }
        const label = elAttrs("span", { "data-role": "tab-label" });
        label.textContent = tab.label;
        btn.appendChild(label);

        if (tab.badge !== undefined) {
            const badge = elAttrs("span", { "data-tab-badge": "" });
            badge.textContent = String(tab.badge);
            btn.appendChild(badge);
        }

        bar.appendChild(btn);
    }

    root.appendChild(bar);

    // --- Panel — swapped on each click, never rebuilds the bar ---
    const panel = elAttrs("div", { "data-tabs-panel": "" });
    root.appendChild(panel);

    function mountActive() {
        panel.innerHTML = "";
        const childConfig = children ? (children as Record<string, ConfigBase>)[active] : null;
        if (childConfig) {
            const content = elAttrs("div", { "data-tab-content": "", "data-tab-key": active });
            const childEl = buildComponent(childConfig, ctx.onEvent);
            content.appendChild(childEl);
            panel.appendChild(content);
        }
    }

    mountActive();

    container.appendChild(root);
    return root;
}
