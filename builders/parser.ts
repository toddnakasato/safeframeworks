import type { ConfigBase } from "../../safecontracts/src/contracts";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import { elAttrs, applyPaintState, applyIntent, readList } from "../utils/util";

/*----------------------------------------------------------------------------------------------------
 *
 * Parser — document structure viewer. Split panel with tabbed navigation.
 *
 * Left panel:  Parse (document preview) | Generate (placeholder) | Verify (placeholder)
 * Right panel: Document Sections (tree) | JSON Structure (raw JSON)
 *
 * From figma: Atom Parser spec.
 *
 ----------------------------------------------------------------------------------------------------*/

interface ParserNode {
    record: Record<string, any>;
    id: string;
    children: ParserNode[];
    depth: number;
}

function buildParserTree(data: Record<string, any>[], idField: string, parentField: string): ParserNode[] {
    const map = new Map<string, ParserNode>();
    const roots: ParserNode[] = [];

    for (const record of data) {
        const id = String(record[idField] ?? "");
        map.set(id, { record, id, children: [], depth: 0 });
    }

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

    function setDepth(nodes: ParserNode[], depth: number) {
        for (const n of nodes) {
            n.depth = depth;
            setDepth(n.children, depth + 1);
        }
    }
    setDepth(roots, 0);

    return roots;
}

const TYPE_ICONS: Record<string, string> = {
    header: "doc",
    section: "folder",
    table: "chart",
    "text-block": "text",
    footer: "list",
};

export function createSafeParser(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;

    const idField = (metadata.idField as string) ?? "id";
    const parentField = (metadata.parentField as string) ?? "parentId";
    const labelField = (metadata.labelField as string) ?? "label";
    const typeField = (metadata.typeField as string) ?? "type";
    const fieldsField = (metadata.fieldsField as string) ?? "fields";
    const boundsField = (metadata.boundsField as string) ?? "bounds";
    const title = (metadata.title as string) ?? "Document Parser Specification";
    const subtitle = (metadata.subtitle as string) ?? "";
    const showFields = metadata.showFields !== false;
    const showBounds = metadata.showBounds !== false;
    const expandAll = metadata.expandAll !== false;

    const data = readList(config);

    const root = elAttrs("div", { "data-component": "parser", "data-layout": "column" });
    applyIntent(root, metadata);
    applyPaintState(root, metadata, "parser");

    /* ================================================================
     * Header
     * ================================================================ */
    const header = elAttrs("div", { "data-role": "header" });
    const titleEl = elAttrs("div", { "data-role": "title" });
    titleEl.textContent = title;
    header.appendChild(titleEl);
    if (subtitle) {
        const sub = elAttrs("div", { "data-role": "subtitle" });
        sub.textContent = subtitle;
        header.appendChild(sub);
    }
    root.appendChild(header);

    if (data.length === 0) {
        const empty = elAttrs("div", { "data-role": "empty" });
        empty.textContent = "No document parts loaded";
        root.appendChild(empty);
        container.appendChild(root);
        return root;
    }

    /* ================================================================
     * Split panel body
     * ================================================================ */
    const body = elAttrs("div", { "data-role": "body" });

    /* --- Helper: build a tab bar + content panels --- */
    function buildTabs(
        tabs: { id: string; label: string; build: (panel: HTMLElement) => void }[],
        defaultTab?: string
    ): HTMLElement {
        const wrapper = elAttrs("div", { "data-role": "tab-group", "data-layout": "column" });
        const bar = elAttrs("div", { "data-role": "tab-bar" });
        const contentArea = elAttrs("div", { "data-role": "tab-content" });

        const panels = new Map<string, HTMLElement>();
        const buttons = new Map<string, HTMLElement>();

        for (const tab of tabs) {
            const btn = elAttrs("button", { "data-role": "tab", "data-tab": tab.id });
            btn.textContent = tab.label;
            bar.appendChild(btn);
            buttons.set(tab.id, btn);

            const panel = elAttrs("div", { "data-role": "tab-panel", "data-tab": tab.id });
            tab.build(panel);
            panels.set(tab.id, panel);
            contentArea.appendChild(panel);
        }

        function activate(id: string) {
            for (const [tid, p] of panels) {
                p.style.display = tid === id ? "" : "none";
            }
            for (const [tid, b] of buttons) {
                if (tid === id) b.setAttribute("data-active", "true");
                else b.removeAttribute("data-active");
            }
        }

        for (const tab of tabs) {
            buttons.get(tab.id)!.onclick = () => activate(tab.id);
        }

        activate(defaultTab ?? tabs[0]?.id ?? "");

        wrapper.appendChild(bar);
        wrapper.appendChild(contentArea);
        return wrapper;
    }

    /* ================================================================
     * Left panel — Parse | Generate | Verify
     * ================================================================ */
    const leftPanel = elAttrs("div", { "data-role": "panel-left", "data-layout": "column" });

    const leftTabs = buildTabs([
        {
            id: "parse",
            label: "Parse",
            build: (panel) => {
                const info = elAttrs("div", { "data-role": "parse-header" });
                const infoTitle = elAttrs("div", { "data-role": "parse-title" });
                infoTitle.textContent = "Upload Document";
                info.appendChild(infoTitle);
                const infoSub = elAttrs("div", { "data-role": "parse-subtitle" });
                infoSub.textContent = "Load a document to parse and extract sections";
                info.appendChild(infoSub);
                panel.appendChild(info);

                /* Summary by type — serves as the document preview area */
                const preview = elAttrs("div", { "data-role": "parse-preview" });
                const typeCounts: Record<string, number> = {};
                for (const row of data) {
                    const t = String(row[typeField] ?? "unknown");
                    typeCounts[t] = (typeCounts[t] ?? 0) + 1;
                }
                const summaryTitle = elAttrs("div", { "data-role": "summary-title" });
                summaryTitle.textContent = `Document Structure — ${data.length} parts`;
                preview.appendChild(summaryTitle);
                for (const [t, count] of Object.entries(typeCounts)) {
                    const item = elAttrs("div", { "data-role": "summary-item" });
                    const icon = elAttrs("span", { "data-role": "type-icon" });
                    icon.textContent = TYPE_ICONS[t] ?? "doc";
                    item.appendChild(icon);
                    const label = elAttrs("span", { "data-role": "summary-label" });
                    label.textContent = t;
                    item.appendChild(label);
                    const badge = elAttrs("span", { "data-role": "summary-count" });
                    badge.textContent = String(count);
                    item.appendChild(badge);
                    preview.appendChild(item);
                }
                panel.appendChild(preview);
            },
        },
        {
            id: "generate",
            label: "Generate",
            build: (panel) => {
                const placeholder = elAttrs("div", { "data-role": "placeholder", "data-layout": "column" });
                const icon = elAttrs("div", { "data-role": "placeholder-icon" });
                icon.textContent = "upload";
                placeholder.appendChild(icon);
                const msg = elAttrs("div", { "data-role": "placeholder-title" });
                msg.textContent = "Generate Feature";
                placeholder.appendChild(msg);
                const desc = elAttrs("div", { "data-role": "placeholder-desc" });
                desc.textContent = "Recreate documents based on sections and JSON structure";
                placeholder.appendChild(desc);
                panel.appendChild(placeholder);
            },
        },
        {
            id: "verify",
            label: "Verify",
            build: (panel) => {
                const placeholder = elAttrs("div", { "data-role": "placeholder", "data-layout": "column" });
                const icon = elAttrs("div", { "data-role": "placeholder-icon" });
                icon.textContent = "check";
                placeholder.appendChild(icon);
                const msg = elAttrs("div", { "data-role": "placeholder-title" });
                msg.textContent = "Verification Suite";
                placeholder.appendChild(msg);
                const desc = elAttrs("div", { "data-role": "placeholder-desc" });
                desc.textContent = "Automated validation tests for document sections and data integrity";
                placeholder.appendChild(desc);
                panel.appendChild(placeholder);
            },
        },
    ], "parse");

    leftPanel.appendChild(leftTabs);
    body.appendChild(leftPanel);

    /* ================================================================
     * Right panel — Document Sections | JSON Structure
     * ================================================================ */
    const rightPanel = elAttrs("div", { "data-role": "panel-right", "data-layout": "column" });

    const tree = buildParserTree(data, idField, parentField);

    const expanded = new Set<string>();
    if (expandAll) {
        (function walk(nodes: ParserNode[]) {
            for (const n of nodes) {
                expanded.add(n.id);
                walk(n.children);
            }
        })(tree);
    }

    let selected: string | null = null;

    const handleToggle = (id: string) => {
        if (expanded.has(id)) {
            expanded.delete(id);
            ctx.fire("collapse", { id });
        } else {
            expanded.add(id);
            ctx.fire("expand", { id });
        }
        renderTree();
    };

    const handleSelect = (node: ParserNode) => {
        selected = node.id;
        ctx.fire("select", { id: node.id, record: node.record });
        renderTree();
    };

    /* Tree node renderer */
    function appendNode(parent: HTMLElement, node: ParserNode) {
        const isExpanded = expanded.has(node.id);
        const hasChildren = node.children.length > 0;
        const isSelected = selected === node.id;
        const partType = String(node.record[typeField] ?? "unknown");

        const row = elAttrs("div", {
            "data-role": "node",
            "data-depth": String(node.depth),
            "data-part-type": partType,
        });
        if (isSelected) row.setAttribute("data-selected", "true");
        if (hasChildren) row.setAttribute("data-has-children", "true");
        if (isExpanded) row.setAttribute("data-expanded", "true");
        row.style.paddingLeft = `${node.depth * 20}px`;
        row.onclick = () => handleSelect(node);

        if (hasChildren) {
            const toggle = elAttrs("span", { "data-role": "toggle" });
            toggle.textContent = isExpanded ? "▼" : "▶";
            toggle.onclick = (e) => { e.stopPropagation(); handleToggle(node.id); };
            row.appendChild(toggle);
        } else {
            row.appendChild(elAttrs("span", { "data-role": "leaf-spacer" }));
        }

        const typeIcon = elAttrs("span", { "data-role": "type-icon" });
        typeIcon.textContent = TYPE_ICONS[partType] ?? "doc";
        row.appendChild(typeIcon);

        const label = elAttrs("span", { "data-role": "label" });
        label.textContent = String(node.record[labelField] ?? "");
        row.appendChild(label);

        const typeBadge = elAttrs("span", { "data-role": "type-badge" });
        typeBadge.textContent = partType;
        row.appendChild(typeBadge);

        parent.appendChild(row);

        if (isExpanded) {
            const detail = elAttrs("div", { "data-role": "node-detail" });
            detail.style.paddingLeft = `${(node.depth + 1) * 20 + 16}px`;

            if (showFields) {
                const fields = node.record[fieldsField];
                if (Array.isArray(fields) && fields.length > 0) {
                    for (const field of fields) {
                        const fieldRow = elAttrs("div", { "data-role": "field" });
                        const fieldLabel = elAttrs("span", { "data-role": "field-label" });
                        fieldLabel.textContent = `${field.label ?? field.name ?? ""}:`;
                        fieldRow.appendChild(fieldLabel);
                        const fieldValue = elAttrs("span", { "data-role": "field-value" });
                        fieldValue.textContent = String(field.value ?? "");
                        fieldRow.appendChild(fieldValue);
                        detail.appendChild(fieldRow);
                    }
                }
            }

            if (showBounds) {
                const bounds = node.record[boundsField];
                if (bounds && typeof bounds === "object") {
                    const boundsRow = elAttrs("div", { "data-role": "bounds" });
                    boundsRow.textContent = `${bounds.width ?? 0}% × ${bounds.height ?? 0}%`;
                    detail.appendChild(boundsRow);
                }
            }

            if (detail.childElementCount > 0) parent.appendChild(detail);

            for (const child of node.children) appendNode(parent, child);
        }
    }

    /* Tree container — used by "Document Sections" tab */
    let treeContainer: HTMLElement;

    function renderTree() {
        treeContainer.replaceChildren();
        for (const node of tree) appendNode(treeContainer, node);
    }

    const rightTabs = buildTabs([
        {
            id: "sections",
            label: `Document Sections (${data.length})`,
            build: (panel) => {
                treeContainer = elAttrs("div", { "data-role": "tree" });
                renderTree();
                panel.appendChild(treeContainer);
            },
        },
        {
            id: "json",
            label: "JSON Structure",
            build: (panel) => {
                const jsonWrap = elAttrs("div", { "data-role": "json-view" });

                const copyBtn = elAttrs("button", { "data-role": "copy-btn" });
                copyBtn.textContent = "Copy JSON";
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
                        copyBtn.textContent = "check Copied!";
                        setTimeout(() => { copyBtn.textContent = "Copy JSON"; }, 2000);
                    }).catch(() => {});
                };
                jsonWrap.appendChild(copyBtn);

                const pre = elAttrs("pre", { "data-role": "json-pre" });
                const code = elAttrs("code", { "data-role": "json-code" });
                code.textContent = JSON.stringify(data, null, 2);
                pre.appendChild(code);
                jsonWrap.appendChild(pre);
                panel.appendChild(jsonWrap);
            },
        },
    ], "sections");

    rightPanel.appendChild(rightTabs);
    body.appendChild(rightPanel);
    root.appendChild(body);

    container.appendChild(root);
    return root;
}
