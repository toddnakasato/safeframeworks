import type { ConfigBase } from "../../safecontracts/src/contracts";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import { elAttrs, applyPaintState, applyIntent, readList } from "../utils/util";
import { buildTree } from "../../safecontracts/src/components/tree";
import type { TreeNode } from "../../safecontracts/src/components/tree";

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeTree(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    // External paint state (resolved from state.json by host)
    const _selectedNode = metadata.selectedNode ?? null;
    const _expanded = metadata.expanded ?? null;

    const variant = (metadata.variant as string) ?? "default";
    const spacing = (metadata.spacing as string) ?? "normal";
    const surface = (metadata.surface as string) ?? "base";
    const idField = (metadata.idField as string) ?? "Id";
    const parentField = (metadata.parentField as string) ?? "ParentId";
    const expandAll = !!metadata.expandAll;
    const expandDepth = (metadata.expandDepth as number) ?? (expandAll ? 99 : 1);
    const labelField = (metadata.labelField as string) ?? "Name";
    const iconField = metadata.iconField as string | undefined;
    const badgeField = metadata.badgeField as string | undefined;
    const subtitleField = metadata.subtitleField as string | undefined;
    const indent = (metadata.indent as number) ?? 20;
    const connectors = !!metadata.connectors;

    const data = readList(config);

    if (data.length === 0) {
        const empty = elAttrs("div", { "data-component": "tree", "data-role": "empty" });
        empty.textContent = "No items";
        container.appendChild(empty);
        return empty;
    }

    const tree = buildTree(data, idField, parentField);

    const expanded = new Set<string>();
    (function walk(nodes: TreeNode[], depth: number) {
        for (const n of nodes) {
            if (depth < expandDepth) {
                expanded.add(n.id);
                walk(n.children, depth + 1);
            }
        }
    })(tree, 0);

    let selected: string | null = null;

    const root = elAttrs("div", {
        "data-component": "tree",
        "data-variant": variant,
        "data-spacing": spacing,
        "data-surface": surface,
    });
    applyIntent(root, metadata);
    applyPaintState(root, metadata, "tree");

    const handleToggle = (id: string) => {
        if (expanded.has(id)) expanded.delete(id);
        else expanded.add(id);
        ctx.fire("expand", { id });
        render();
    };

    const handleSelect = (node: TreeNode) => {
        selected = node.id;
        ctx.fire("select", { id: node.id, record: node.record });
        render();
    };

    function appendNode(parent: HTMLElement, node: TreeNode) {
        const isExpanded = expanded.has(node.id);
        const hasChildren = node.children.length > 0;
        const isSelected = selected === node.id;

        const row = elAttrs("div", { "data-role": "node", "data-depth": String(node.depth) });
        if (isSelected) row.setAttribute("data-selected", "true");
        if (hasChildren) row.setAttribute("data-has-children", "true");
        if (isExpanded) row.setAttribute("data-expanded", "true");
        // Structural indent — react sets this inline too.
        row.style.paddingLeft = `${node.depth * indent}px`;
        row.onclick = () => handleSelect(node);

        if (hasChildren) {
            const toggle = elAttrs("span", { "data-role": "toggle" });
            toggle.textContent = isExpanded ? "▼" : "▶";
            toggle.onclick = (e) => { e.stopPropagation(); handleToggle(node.id); };
            row.appendChild(toggle);
        } else {
            row.appendChild(elAttrs("span", { "data-role": "leaf-spacer" }));
        }
        if (connectors && node.depth > 0) row.appendChild(elAttrs("span", { "data-role": "connector" }));
        if (iconField && node.record[iconField]) {
            const icon = elAttrs("span", { "data-role": "icon" });
            icon.textContent = String(node.record[iconField]);
            row.appendChild(icon);
        }
        const label = elAttrs("span", { "data-role": "label" });
        label.textContent = String(node.record[labelField] ?? "");
        row.appendChild(label);
        if (subtitleField && node.record[subtitleField]) {
            const sub = elAttrs("span", { "data-role": "subtitle" });
            sub.textContent = String(node.record[subtitleField]);
            row.appendChild(sub);
        }
        if (badgeField && node.record[badgeField]) {
            const badge = elAttrs("span", { "data-role": "badge" });
            badge.textContent = String(node.record[badgeField]);
            row.appendChild(badge);
        }

        parent.appendChild(row);
        if (isExpanded) for (const child of node.children) appendNode(parent, child);
    }

    function render() {
        root.replaceChildren();
        for (const node of tree) appendNode(root, node);
    }
    render();

    container.appendChild(root);
    return root;
}
