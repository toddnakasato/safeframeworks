import type { ConfigBase } from "../../safecontracts/src/contracts";
import { el, applyIntent } from "../utils/util";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import { getDataSource } from "../../safecontracts/src/contracts";

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

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

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

export function createSafeDragDrop(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const variant = (config.metadata.variant as string) ?? "generic";

    // Self-extract list from config data (SafeRenderer does this for react)
    const ds = getDataSource(config) as any;
    const rawData = ds?.inline;
    const dataList: Record<string, any>[] = Array.isArray(rawData) ? rawData : [];

    const root = el("div");
    root.setAttribute("data-component", "drag-drop");
    applyIntent(root, config.metadata);
    root.setAttribute("data-variant", variant);

    if (variant === "file") buildFile(root, config, ctx);
    else if (variant === "palette") buildPalette(root, config, ctx);
    else buildGeneric(root, config, dataList, ctx);

    container.appendChild(root);
    return root;
}

export function initSafeDragDrops(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-dragdrop-config]").forEach((host) => {
        if (host.dataset.dragdropMounted) return;
        host.dataset.dragdropMounted = "1";
        const config = JSON.parse(host.dataset.dragdropConfig!) as ConfigBase;
        createSafeDragDrop(host, config);
    });
}