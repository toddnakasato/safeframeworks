import type { ConfigBase } from "../../safecontracts/src/contracts";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import { elAttrs, applyPaintState, applyIntent } from "../utils/util";
import type { TabItem } from "../../safecontracts/src/components/tabs";

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

    function render() {
        root.replaceChildren();

        const bar = elAttrs("div", { "data-tabs-bar": "", "data-position": position });

        for (const tab of tabs) {
            const btn = elAttrs("button", { "data-tab": "" });
            if (active === tab.key) btn.setAttribute("data-active", "");
            btn.onclick = () => {
                active = tab.key;
                ctx.fire("select", { key: tab.key });
                render();
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

        if (children && Object.keys(children).length > 0) {
            const panel = elAttrs("div", { "data-tabs-panel": "" });
            if ((children as Record<string, any>)[active]) {
                const content = elAttrs("div", { "data-tab-content": "", "data-tab-key": active });
                panel.appendChild(content);
            }
            root.appendChild(panel);
        }
    }
    render();

    container.appendChild(root);
    return root;
}
