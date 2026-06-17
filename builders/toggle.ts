import type { ConfigBase } from "../../safecontracts/src/contracts";
import { el, applyPaintState, applyIntent, readList } from "../utils/util";
import type { SafeFireContext } from "../../safecontracts/src/contracts";

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

function buildSwitchTrack(checked: boolean, disabled: boolean | undefined, onToggle: () => void): HTMLButtonElement {
    const btn = el("button", "toggle-track") as HTMLButtonElement;
    btn.type = "button";
    if (checked) btn.setAttribute("data-checked", "true");
    if (disabled) {
        btn.setAttribute("data-disabled", "true");
        btn.disabled = true;
    }
    btn.onclick = onToggle;
    btn.appendChild(el("span", "toggle-thumb"));
    return btn;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeToggle(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    const variant = (metadata.variant as string) ?? "switch";

    // Self-extract list from config data (SafeRenderer does this for react)
    const dataList: Record<string, any>[] = readList(config);

    const root = el("div");
    root.setAttribute("data-component", "toggle");
    applyIntent(root, metadata);
    applyPaintState(root, metadata, "toggle");

    function renderSwitch() {
        const label = metadata.label as string | undefined;
        const description = metadata.description as string | undefined;
        const icon = metadata.icon as string | undefined;
        const labelPosition = (metadata.labelPosition as string) ?? "right";
        const disabled = !!metadata.disabled;
        let checked = !!metadata.checked;

        root.setAttribute("data-label-position", labelPosition);
        if (disabled) root.setAttribute("data-disabled", "true");

        const buildLabelEl = (): HTMLElement | null => {
            if (!label) return null;
            const wrap = el("div", "toggle-label-wrap");
            wrap.appendChild(el("span", "toggle-label", label));
            if (description) wrap.appendChild(el("span", "toggle-description", description));
            return wrap;
        };

        function render() {
            root.replaceChildren();
            const handleToggle = () => {
                if (disabled) return;
                checked = !checked;
                ctx.fire("change", { checked, label });
                render();
            };
            const labelEl = buildLabelEl();
            if ((labelPosition === "left" || labelPosition === "top") && labelEl) root.appendChild(labelEl);
            if (icon) root.appendChild(el("span", "toggle-icon", icon));
            root.appendChild(buildSwitchTrack(checked, disabled, handleToggle));
            if (labelPosition === "right" || labelPosition === "bottom") {
                const labelEl2 = buildLabelEl();
                if (labelEl2) root.appendChild(labelEl2);
            }
        }
        render();
    }

    function renderTable() {
        const items = (metadata.items as any[]) ?? dataList;
        const states: Record<string, boolean> = {};
        for (const item of items) states[item.key] = !!item.checked;

        const handleToggle = (key: string, label: string) => {
            states[key] = !states[key];
            ctx.fire("change", { key, checked: states[key], label });
            render();
        };

        function render() {
            root.replaceChildren();
            const header = el("div", "toggle-table-header");
            header.appendChild(el("span", "toggle-table-th", "Setting"));
            const th2 = el("span", "toggle-table-th", "Enable");
            th2.setAttribute("data-align", "right");
            header.appendChild(th2);
            root.appendChild(header);

            for (const item of items) {
                const row = el("div", "toggle-table-row");
                const cell1 = el("div", "toggle-table-cell");
                cell1.appendChild(el("span", "toggle-label", item.label));
                if (item.description) cell1.appendChild(el("span", "toggle-description", item.description));
                const cell2 = el("div", "toggle-table-cell");
                cell2.setAttribute("data-align", "right");
                cell2.appendChild(buildSwitchTrack(!!states[item.key], undefined, () => handleToggle(item.key, item.label)));
                row.append(cell1, cell2);
                root.appendChild(row);
            }
        }
        render();
    }

    function renderExpandable() {
        const items = (metadata.items as any[]) ?? dataList;
        const states: Record<string, boolean> = {};
        for (const item of items) {
            states[item.key] = !!item.checked;
            for (const child of item.children ?? []) states[child.key] = !!child.checked;
        }
        const expanded: Record<string, boolean> = {};

        const handleToggle = (key: string, label: string) => {
            states[key] = !states[key];
            ctx.fire("change", { key, checked: states[key], label });
            render();
        };

        const handleExpand = (key: string) => {
            expanded[key] = !expanded[key];
            ctx.fire("expand", { key, expanded: expanded[key] });
            render();
        };

        function render() {
            root.replaceChildren();
            for (const item of items) {
                const group = el("div", "toggle-group");

                const header = el("div", "toggle-group-header");
                header.onclick = () => handleExpand(item.key);

                const expandBtn = el("button", "toggle-expand-btn", "▾");
                if (expanded[item.key]) expandBtn.setAttribute("data-expanded", "true");
                header.appendChild(expandBtn);

                if (item.icon) header.appendChild(el("span", "toggle-icon", item.icon));

                const labelWrap = el("div", "toggle-label-wrap");
                labelWrap.style.flex = "1"; // react applies this inline too
                const labelRow = el("div", "toggle-label-row");
                labelRow.appendChild(el("span", "toggle-label", item.label));
                if (item.badge) labelRow.appendChild(el("span", "toggle-badge", item.badge));
                labelWrap.appendChild(labelRow);
                if (item.description) labelWrap.appendChild(el("span", "toggle-description", item.description));
                header.appendChild(labelWrap);

                const trackWrap = el("div");
                trackWrap.onclick = (e) => e.stopPropagation();
                trackWrap.appendChild(buildSwitchTrack(!!states[item.key], undefined, () => handleToggle(item.key, item.label)));
                header.appendChild(trackWrap);

                group.appendChild(header);

                if (expanded[item.key] && item.children) {
                    const children = el("div", "toggle-group-children");
                    for (const child of item.children) {
                        const row = el("div", "toggle-child-row");
                        const wrap = el("div", "toggle-label-wrap");
                        wrap.appendChild(el("span", "toggle-label", child.label));
                        if (child.description) wrap.appendChild(el("span", "toggle-description", child.description));
                        row.appendChild(wrap);
                        row.appendChild(buildSwitchTrack(!!states[child.key], undefined, () => handleToggle(child.key, child.label)));
                        children.appendChild(row);
                    }
                    group.appendChild(children);
                }
                root.appendChild(group);
            }
        }
        render();
    }

    if (variant === "table") renderTable();
    else if (variant === "expandable") renderExpandable();
    else renderSwitch();

    container.appendChild(root);
    return root;
}
