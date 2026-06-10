/**
 * Tree builder for this renderer's SafeTree — config-driven hierarchical
 * tree view.
 *
 * Framework-agnostic DOM port of the react SafeTree: flat data in
 * (id/label/parentId records) → tree structure out. Expand/collapse and
 * selection state live in a closure with render() rebuild.
 *
 * Structure + data-* attributes ONLY — paint lives in safestyles. Same
 * data-role markup as the react JSX implementation, so one stylesheet
 * covers both. Events: "expand" (toggle), "select" (node click).
 */
import type { ConfigBase, OnSafeEvent } from "../../../safecontracts/src/contracts";
import { createSafeEvent } from "../../../safecontracts/src/contracts";

interface TreeNode {
    record: Record<string, any>;
    id: string;
    children: TreeNode[];
    depth: number;
}

function buildTree(data: Record<string, any>[], idField: string, parentField: string): TreeNode[] {
    const map = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    // Create nodes
    for (const record of data) {
        const id = String(record[idField] ?? "");
        map.set(id, { record, id, children: [], depth: 0 });
    }

    // Build hierarchy
    for (const record of data) {
        const id = String(record[idField] ?? "");
        const parentId = record[parentField];
        const node = map.get(id)!;

        if (parentId == null || parentId === "" || parentId === id) {
            roots.push(node);
        } else {
            const parent = map.get(String(parentId));
            if (parent) parent.children.push(node);
            else roots.push(node);
        }
    }

    // Set depths
    function setDepth(nodes: TreeNode[], depth: number) {
        for (const n of nodes) {
            n.depth = depth;
            setDepth(n.children, depth + 1);
        }
    }
    setDepth(roots, 0);

    return roots;
}

function el(tag: string, attrs: Record<string, string> = {}): HTMLElement {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
}

/** Build the tree into a container. Returns the root for removal. */
export function createSafeTree(container: HTMLElement, config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
    const metadata = config.metadata;
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

    // Self-extract list from config data (SafeRenderer does this for react)
    const ds = Object.values(config.data ?? {})[0] as any;
    const raw = ds?.inline;
    const data: Record<string, any>[] = Array.isArray(raw) ? raw : [];

    if (data.length === 0) {
        const empty = el("div", { "data-component": "tree", "data-role": "empty" });
        empty.textContent = "No items";
        container.appendChild(empty);
        return empty;
    }

    const tree = buildTree(data, idField, parentField);

    // Collect all node ids up to expandDepth
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

    const root = el("div", {
        "data-component": "tree",
        "data-variant": variant,
        "data-spacing": spacing,
        "data-surface": surface,
    });

    const handleToggle = (id: string) => {
        if (expanded.has(id)) expanded.delete(id);
        else expanded.add(id);
        onEvent?.(createSafeEvent("tree", "expand", { id }));
        render();
    };

    const handleSelect = (node: TreeNode) => {
        selected = node.id;
        onEvent?.(createSafeEvent("tree", "select", { id: node.id, record: node.record }));
        render();
    };

    function appendNode(parent: HTMLElement, node: TreeNode) {
        const isExpanded = expanded.has(node.id);
        const hasChildren = node.children.length > 0;
        const isSelected = selected === node.id;

        const row = el("div", { "data-role": "node", "data-depth": String(node.depth) });
        if (isSelected) row.setAttribute("data-selected", "true");
        if (hasChildren) row.setAttribute("data-has-children", "true");
        if (isExpanded) row.setAttribute("data-expanded", "true");
        // Structural indent — react sets this inline too.
        row.style.paddingLeft = `${node.depth * indent}px`;
        row.onclick = () => handleSelect(node);

        if (hasChildren) {
            const toggle = el("span", { "data-role": "toggle" });
            toggle.textContent = isExpanded ? "▼" : "▶";
            toggle.onclick = (e) => { e.stopPropagation(); handleToggle(node.id); };
            row.appendChild(toggle);
        } else {
            row.appendChild(el("span", { "data-role": "leaf-spacer" }));
        }
        if (connectors && node.depth > 0) row.appendChild(el("span", { "data-role": "connector" }));
        if (iconField && node.record[iconField]) {
            const icon = el("span", { "data-role": "icon" });
            icon.textContent = String(node.record[iconField]);
            row.appendChild(icon);
        }
        const label = el("span", { "data-role": "label" });
        label.textContent = String(node.record[labelField] ?? "");
        row.appendChild(label);
        if (subtitleField && node.record[subtitleField]) {
            const sub = el("span", { "data-role": "subtitle" });
            sub.textContent = String(node.record[subtitleField]);
            row.appendChild(sub);
        }
        if (badgeField && node.record[badgeField]) {
            const badge = el("span", { "data-role": "badge" });
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

/**
 * Scan-and-mount for server-rendered hosts (Astro): build a tree in every
 * div[data-tree-config] not yet mounted.
 */
export function initSafeTrees(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-tree-config]").forEach((host) => {
        if (host.dataset.treeMounted) return;
        host.dataset.treeMounted = "1";
        const config = JSON.parse(host.dataset.treeConfig!) as ConfigBase;
        createSafeTree(host, config);
    });
}
