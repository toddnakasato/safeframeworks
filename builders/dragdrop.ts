import type { ConfigBase } from "../../safecontracts/src/contracts";
import { el, applyIntent, readList } from "../utils/util";
import type { SafeFireContext } from "../../safecontracts/src/contracts";

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/
export function createSafeDragDrop(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const variant = (config.metadata.variant as string) ?? "generic";

    // Self-extract list from config data (SafeRenderer does this for react)
    const dataList: Record<string, any>[] = readList(config);

    const root = el("div");
    root.setAttribute("data-component", "drag-drop");
    applyIntent(root, config.metadata);

    if (variant === "file") buildFile(root, config, ctx);
    else if (variant === "palette") buildPalette(root, config, ctx);
    else if (variant === "row") buildRow(root, config, dataList, ctx);
    else if (variant === "cell") buildCell(root, config, dataList, ctx);
    else if (variant === "table") buildTable(root, config, dataList, ctx);
    else if (variant === "template") buildTemplate(root, config, ctx);
    else buildGeneric(root, config, dataList, ctx);

    container.appendChild(root);
    return root;
}

function buildGeneric(root: HTMLElement, config: ConfigBase, items: Record<string, any>[], ctx: SafeFireContext): void {
    const dropLabel = (config.metadata.dropLabel as string) ?? "Drop here";
    const dropDesc = (config.metadata.dropDescription as string) ?? "Drag an item to this zone";

    const source = el("div", "drag-source");
    items.forEach((item, i) => {
        const id = (item.id as string) ?? String(i);
        const node = el("div", "drag-item");
        node.draggable = true;
        node.addEventListener("dragstart", (e: DragEvent) => {
            node.setAttribute("data-dragging", "true");
            e.dataTransfer!.setData("application/json", JSON.stringify(item));
            e.dataTransfer!.effectAllowed = "move";
            ctx.fire("drag-start", { id, item });
        });
        node.addEventListener("dragend", () => {
            node.removeAttribute("data-dragging");
            ctx.fire("drag-end", null);
        });
        if (item.icon) node.appendChild(el("span", "drag-icon", item.icon as string));
        if (item.type) node.appendChild(el("span", "drag-type", item.type as string));
        node.appendChild(el("span", "drag-label", (item.name as string) ?? (item.label as string) ?? id));
        source.appendChild(node);
    });

    const targets = el("div", "drop-targets");
    const zone = el("div", "drop-zone");
    zone.addEventListener("drop", (e: DragEvent) => {
        e.preventDefault();
        zone.removeAttribute("data-over");
        try {
            const item = JSON.parse(e.dataTransfer!.getData("application/json"));
            ctx.fire("drop", { zone: "primary", item });
        } catch {}
    });
    zone.addEventListener("dragover", (e: DragEvent) => {
        e.preventDefault();
        e.dataTransfer!.dropEffect = "move";
        zone.setAttribute("data-over", "true");
    });
    zone.addEventListener("dragleave", () => zone.removeAttribute("data-over"));
    zone.appendChild(el("span", "drop-icon", "⬇"));
    zone.appendChild(el("span", "drop-label", dropLabel));
    zone.appendChild(el("span", "drop-description", dropDesc));
    targets.appendChild(zone);

    root.append(source, targets);
}

function buildFile(root: HTMLElement, config: ConfigBase, ctx: SafeFireContext): void {
    const dropLabel = (config.metadata.dropLabel as string) ?? "Drop files here";
    const dropDesc = (config.metadata.dropDescription as string) ?? "or click to browse";
    const accept = (config.metadata.accept as string) ?? "";
    const multiple = config.metadata.multiple !== false;

    const fireFiles = (files: FileList | File[]) => {
        const list = Array.from(files).map((f) => ({ name: f.name, size: f.size, type: f.type }));
        ctx.fire("file-drop", { files: list });
    };

    const zone = el("div", "file-zone");
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = multiple;
    input.style.display = "none";
    input.addEventListener("change", () => {
        if (input.files && input.files.length > 0) fireFiles(input.files);
    });

    zone.addEventListener("drop", (e: DragEvent) => {
        e.preventDefault();
        zone.removeAttribute("data-over");
        if (e.dataTransfer && e.dataTransfer.files.length > 0) fireFiles(e.dataTransfer.files);
    });
    zone.addEventListener("dragover", (e: DragEvent) => {
        e.preventDefault();
        e.dataTransfer!.dropEffect = "copy";
        zone.setAttribute("data-over", "true");
    });
    zone.addEventListener("dragleave", () => zone.removeAttribute("data-over"));
    zone.addEventListener("click", () => input.click());

    zone.appendChild(el("span", "drop-icon", "📁"));
    zone.appendChild(el("span", "drop-label", dropLabel));
    zone.appendChild(el("span", "drop-description", dropDesc));
    zone.appendChild(input);
    root.appendChild(zone);
}

function buildPalette(root: HTMLElement, config: ConfigBase, ctx: SafeFireContext): void {
    const categories = (config.metadata.categories as any[]) ?? [];
    const sections = (config.metadata.sections as any[]) ?? [{ id: "main", label: "Main" }];

    const sidebar = el("div", "palette-sidebar");
    for (const cat of categories) {
        const catEl = el("div", "palette-category");
        catEl.appendChild(el("div", "palette-category-label", cat.label));
        const itemsEl = el("div", "palette-items");
        for (const item of cat.items ?? []) {
            const node = el("div", "palette-item");
            node.draggable = true;
            node.addEventListener("dragstart", (e: DragEvent) => {
                node.setAttribute("data-dragging", "true");
                e.dataTransfer!.setData("application/json", JSON.stringify(item));
                e.dataTransfer!.effectAllowed = "copy";
                ctx.fire("drag-start", { item });
            });
            node.addEventListener("dragend", () => {
                node.removeAttribute("data-dragging");
                ctx.fire("drag-end", null);
            });
            if (item.icon) node.appendChild(el("span", "drag-icon", item.icon));
            node.appendChild(el("span", "drag-label", item.label));
            itemsEl.appendChild(node);
        }
        catEl.appendChild(itemsEl);
        sidebar.appendChild(catEl);
    }

    const sectionsEl = el("div", "palette-sections");
    for (const sec of sections) {
        const secEl = el("div", "palette-section");
        secEl.addEventListener("drop", (e: DragEvent) => {
            e.preventDefault();
            secEl.removeAttribute("data-over");
            try {
                const item = JSON.parse(e.dataTransfer!.getData("application/json"));
                ctx.fire("drop", { section: sec.id, item });
            } catch {}
        });
        secEl.addEventListener("dragover", (e: DragEvent) => {
            e.preventDefault();
            e.dataTransfer!.dropEffect = "copy";
            secEl.setAttribute("data-over", "true");
        });
        secEl.addEventListener("dragleave", () => secEl.removeAttribute("data-over"));
        secEl.appendChild(el("span", "section-label", sec.label));
        sectionsEl.appendChild(secEl);
    }

    root.append(sidebar, sectionsEl);
}

/*----------------------------------------------------------------------------------------------------
 * Row variant — drag rows to reorder
 ----------------------------------------------------------------------------------------------------*/
function buildRow(root: HTMLElement, config: ConfigBase, items: Record<string, any>[], ctx: SafeFireContext): void {
    const labelField = (config.metadata.labelField as string) ?? "name";
    const container = el("div", "drop-zone");

    function render() {
        container.replaceChildren();
        items.forEach((item, i) => {
            const row = el("div", "row");
            row.draggable = true;
            const handle = el("span", "drag-handle", "⠿");
            row.appendChild(handle);
            const label = el("span", "drag-label", String(item[labelField] ?? `Item ${i + 1}`));
            row.appendChild(label);

            row.addEventListener("dragstart", (e: DragEvent) => {
                row.setAttribute("data-dragging", "true");
                e.dataTransfer!.setData("text/plain", String(i));
                e.dataTransfer!.effectAllowed = "move";
            });
            row.addEventListener("dragend", () => row.removeAttribute("data-dragging"));
            row.addEventListener("dragover", (e: DragEvent) => { e.preventDefault(); row.setAttribute("data-over", "true"); });
            row.addEventListener("dragleave", () => row.removeAttribute("data-over"));
            row.addEventListener("drop", (e: DragEvent) => {
                e.preventDefault();
                row.removeAttribute("data-over");
                const fromIdx = parseInt(e.dataTransfer!.getData("text/plain"));
                if (!isNaN(fromIdx) && fromIdx !== i) {
                    const moved = items.splice(fromIdx, 1)[0];
                    items.splice(i, 0, moved);
                    ctx.fire("drop", { fromIndex: fromIdx, toIndex: i });
                    render();
                }
            });
            container.appendChild(row);
        });
    }
    render();
    root.appendChild(container);
}

/*----------------------------------------------------------------------------------------------------
 * Cell variant — drag cells in a grid
 ----------------------------------------------------------------------------------------------------*/
function buildCell(root: HTMLElement, config: ConfigBase, items: Record<string, any>[], ctx: SafeFireContext): void {
    const columns = (config.metadata.columns as number) ?? 3;
    const grid = el("div", "grid");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    items.forEach((item, i) => {
        const cell = el("div", "cell");
        cell.draggable = true;
        const dragItem = el("div", "drag-item");
        dragItem.textContent = String(item.name ?? item.label ?? `Cell ${i + 1}`);
        cell.appendChild(dragItem);

        cell.addEventListener("dragstart", (e: DragEvent) => {
            cell.setAttribute("data-dragging", "true");
            e.dataTransfer!.setData("text/plain", String(i));
            e.dataTransfer!.effectAllowed = "move";
        });
        cell.addEventListener("dragend", () => cell.removeAttribute("data-dragging"));
        cell.addEventListener("dragover", (e: DragEvent) => { e.preventDefault(); cell.setAttribute("data-over", "true"); });
        cell.addEventListener("dragleave", () => cell.removeAttribute("data-over"));
        cell.addEventListener("drop", (e: DragEvent) => {
            e.preventDefault();
            cell.removeAttribute("data-over");
            const fromIdx = parseInt(e.dataTransfer!.getData("text/plain"));
            if (!isNaN(fromIdx) && fromIdx !== i) {
                const temp = items[fromIdx];
                items[fromIdx] = items[i];
                items[i] = temp;
                ctx.fire("drop", { fromIndex: fromIdx, toIndex: i });
                rebuildGrid();
            }
        });
        grid.appendChild(cell);
    });

    function rebuildGrid() {
        grid.replaceChildren();
        buildCell(root, config, items, ctx);
    }

    root.appendChild(grid);
}

/*----------------------------------------------------------------------------------------------------
 * Table variant — comprehensive table with row reorder, file drop per row
 ----------------------------------------------------------------------------------------------------*/
function buildTable(root: HTMLElement, config: ConfigBase, items: Record<string, any>[], ctx: SafeFireContext): void {
    const columns = (config.metadata.tableColumns as string[]) ?? Object.keys(items[0] ?? {}).filter(k => k !== "id");
    const labelField = (config.metadata.labelField as string) ?? "name";

    const fileList = el("div", "file-list");
    const table = el("div", "drop-zone");

    function render() {
        table.replaceChildren();
        items.forEach((item, i) => {
            const row = el("div", "row");
            row.draggable = true;
            const handle = el("span", "drag-handle", "⠿");
            row.appendChild(handle);

            for (const col of columns) {
                const cell = el("span", "cell");
                cell.textContent = String(item[col] ?? "");
                row.appendChild(cell);
            }

            row.addEventListener("dragstart", (e: DragEvent) => {
                row.setAttribute("data-dragging", "true");
                e.dataTransfer!.setData("text/plain", String(i));
                e.dataTransfer!.effectAllowed = "move";
            });
            row.addEventListener("dragend", () => row.removeAttribute("data-dragging"));
            row.addEventListener("dragover", (e: DragEvent) => { e.preventDefault(); row.setAttribute("data-over", "true"); });
            row.addEventListener("dragleave", () => row.removeAttribute("data-over"));
            row.addEventListener("drop", (e: DragEvent) => {
                e.preventDefault();
                row.removeAttribute("data-over");
                // Handle file drops on rows
                if (e.dataTransfer && e.dataTransfer.files.length > 0) {
                    const files = Array.from(e.dataTransfer.files).map(f => ({ name: f.name, size: f.size, type: f.type }));
                    ctx.fire("file-drop", { rowIndex: i, files });
                    for (const f of files) {
                        const fileItem = el("div", "file-item", `📎 ${f.name} → Row ${i + 1}`);
                        fileList.appendChild(fileItem);
                    }
                    return;
                }
                const fromIdx = parseInt(e.dataTransfer!.getData("text/plain"));
                if (!isNaN(fromIdx) && fromIdx !== i) {
                    const moved = items.splice(fromIdx, 1)[0];
                    items.splice(i, 0, moved);
                    ctx.fire("drop", { fromIndex: fromIdx, toIndex: i });
                    render();
                }
            });
            table.appendChild(row);
        });
    }
    render();
    root.append(table, fileList);
}

/*----------------------------------------------------------------------------------------------------
 * Template variant — multi-zone layout with labeled drop targets
 ----------------------------------------------------------------------------------------------------*/
function buildTemplate(root: HTMLElement, config: ConfigBase, ctx: SafeFireContext): void {
    const layout = (config.metadata.layout as string) ?? "main";
    const zones = layoutZones(layout);

    const grid = el("div", "grid");

    for (const zone of zones) {
        const zoneEl = el("div", "drop-zone");
        zoneEl.setAttribute("data-zone", zone);
        const label = el("div", "zone-label", zone);
        zoneEl.appendChild(label);

        zoneEl.addEventListener("drop", (e: DragEvent) => {
            e.preventDefault();
            zoneEl.removeAttribute("data-over");
            try {
                const item = JSON.parse(e.dataTransfer!.getData("application/json"));
                ctx.fire("drop", { zone, item });
                const dropped = el("div", "drag-item", String(item.label ?? item.name ?? "Dropped"));
                zoneEl.appendChild(dropped);
            } catch {}
        });
        zoneEl.addEventListener("dragover", (e: DragEvent) => {
            e.preventDefault();
            e.dataTransfer!.dropEffect = "copy";
            zoneEl.setAttribute("data-over", "true");
        });
        zoneEl.addEventListener("dragleave", () => zoneEl.removeAttribute("data-over"));
        grid.appendChild(zoneEl);
    }

    root.appendChild(grid);
}

function layoutZones(layout: string): string[] {
    switch (layout) {
        case "main": return ["main"];
        case "top-main": return ["top", "main"];
        case "left-main": return ["left", "main"];
        case "main-right": return ["main", "right"];
        case "main-bottom": return ["main", "bottom"];
        case "top-main-right": return ["top", "main", "right"];
        case "top-left-main": return ["top", "left", "main"];
        case "left-main-right": return ["left", "main", "right"];
        case "top-main-bottom": return ["top", "main", "bottom"];
        case "top-left-main-right": return ["top", "left", "main", "right"];
        case "top-left-main-bottom": return ["top", "left", "main", "bottom"];
        case "top-main-right-bottom": return ["top", "main", "right", "bottom"];
        case "complete": return ["top", "left", "main", "right", "bottom"];
        default: return ["main"];
    }
}
