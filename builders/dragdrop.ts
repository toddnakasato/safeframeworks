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
    else if (variant === "team-assign") buildTeamAssign(root, config, dataList, ctx);
    else if (variant === "work-item") buildWorkItem(root, config, dataList, ctx);
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
    zone.setAttribute("data-layout", "column");
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
    zone.appendChild(el("span", "drop-icon", "down"));
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

    const doFiles = (files: FileList | File[]) => {
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
        if (input.files && input.files.length > 0) doFiles(input.files);
    });

    zone.addEventListener("drop", (e: DragEvent) => {
        e.preventDefault();
        zone.removeAttribute("data-over");
        if (e.dataTransfer && e.dataTransfer.files.length > 0) doFiles(e.dataTransfer.files);
    });
    zone.addEventListener("dragover", (e: DragEvent) => {
        e.preventDefault();
        e.dataTransfer!.dropEffect = "copy";
        zone.setAttribute("data-over", "true");
    });
    zone.addEventListener("dragleave", () => zone.removeAttribute("data-over"));
    zone.addEventListener("click", () => input.click());

    zone.appendChild(el("span", "drop-icon", "file"));
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
    container.setAttribute("data-layout", "column");

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
    table.setAttribute("data-layout", "column");

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
                        const fileItem = el("div", "file-item", `${f.name} → Row ${i + 1}`);
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
        zoneEl.setAttribute("data-layout", "column");
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

/*----------------------------------------------------------------------------------------------------
 * Team-assign variant — drag people from roster to team drop zones
 ----------------------------------------------------------------------------------------------------*/
function buildTeamAssign(root: HTMLElement, config: ConfigBase, items: Record<string, any>[], ctx: SafeFireContext): void {
    const nameField = (config.metadata.nameField as string) ?? "name";
    const roleField = (config.metadata.roleField as string) ?? "role";
    const avatarField = (config.metadata.avatarField as string) ?? "avatar";
    const teams = (config.metadata.teams as any[]) ?? [{ id: "team-a", name: "Team A", icon: "settings" }, { id: "team-b", name: "Team B", icon: "rocket" }];

    const roster = el("div", "roster");
    roster.setAttribute("data-layout", "column");
    const teamGrid = el("div", "grid");

    // Track assignments: teamId -> item ids
    const assignments: Record<string, Set<string>> = {};
    teams.forEach(t => { assignments[t.id] = new Set(); });

    function renderRoster() {
        roster.replaceChildren();
        const assignedIds = new Set<string>();
        Object.values(assignments).forEach(s => s.forEach(id => assignedIds.add(id)));
        const remaining = items.filter(item => !assignedIds.has(String(item.id ?? "")));

        // Progress bar
        const progressWrap = el("div", "progress-bar");
        const progressFill = el("div", "progress-fill");
        const pct = items.length > 0 ? ((items.length - remaining.length) / items.length) * 100 : 0;
        progressFill.style.width = `${pct}%`;
        progressWrap.appendChild(progressFill);
        roster.appendChild(progressWrap);

        remaining.forEach((item, i) => {
            const rosterItem = el("div", "roster-item");
            rosterItem.draggable = true;
            const handle = el("span", "drag-handle", "⠿");
            const avatar = el("span", "avatar", String(item[avatarField] ?? (String(item[nameField] ?? "")[0] ?? "?")));
            const info = el("div", "roster-info");
            info.setAttribute("data-layout", "column");
            const nameEl = el("span", "roster-name", String(item[nameField] ?? `Person ${i + 1}`));
            const roleEl = el("span", "type-badge", String(item[roleField] ?? ""));
            info.appendChild(nameEl);
            info.appendChild(roleEl);
            rosterItem.append(handle, avatar, info);

            rosterItem.addEventListener("dragstart", (e: DragEvent) => {
                rosterItem.setAttribute("data-dragging", "true");
                e.dataTransfer!.setData("application/json", JSON.stringify(item));
                e.dataTransfer!.effectAllowed = "move";
            });
            rosterItem.addEventListener("dragend", () => rosterItem.removeAttribute("data-dragging"));
            roster.appendChild(rosterItem);
        });
    }

    function renderTeams() {
        teamGrid.replaceChildren();
        teams.forEach(team => {
            const zone = el("div", "team-zone");
            zone.setAttribute("data-zone", team.id);

            const header = el("div", "team-header");
            header.appendChild(el("span", "team-name", `${team.icon ?? ""} ${team.name}`));
            const count = el("span", "points", String(assignments[team.id].size));
            header.appendChild(count);
            zone.appendChild(header);

            const members = el("div", "team-members");
            assignments[team.id].forEach(id => {
                const person = items.find(it => String(it.id ?? "") === id);
                if (!person) return;
                const row = el("div", "roster-item");
                row.appendChild(el("span", "avatar", String(person[avatarField] ?? "?")));
                row.appendChild(el("span", "roster-name", String(person[nameField] ?? "")));
                members.appendChild(row);
            });
            if (assignments[team.id].size === 0) {
                members.appendChild(el("div", "drop-zone", "Drop here"));
            }
            zone.appendChild(members);

            zone.addEventListener("drop", (e: DragEvent) => {
                e.preventDefault();
                zone.removeAttribute("data-over");
                try {
                    const item = JSON.parse(e.dataTransfer!.getData("application/json"));
                    const id = String(item.id ?? "");
                    // Remove from other teams
                    Object.values(assignments).forEach(s => s.delete(id));
                    assignments[team.id].add(id);
                    ctx.fire("drop", { zone: team.id, item });
                    renderRoster();
                    renderTeams();
                } catch {}
            });
            zone.addEventListener("dragover", (e: DragEvent) => { e.preventDefault(); zone.setAttribute("data-over", "true"); });
            zone.addEventListener("dragleave", () => zone.removeAttribute("data-over"));
            teamGrid.appendChild(zone);
        });
    }

    renderRoster();
    renderTeams();
    root.append(roster, teamGrid);
}

/*----------------------------------------------------------------------------------------------------
 * Work-item variant — drag sprint backlog items to team lanes with filters
 ----------------------------------------------------------------------------------------------------*/
function buildWorkItem(root: HTMLElement, config: ConfigBase, items: Record<string, any>[], ctx: SafeFireContext): void {
    const titleField = (config.metadata.titleField as string) ?? "title";
    const typeField = (config.metadata.typeField as string) ?? "type";
    const priorityField = (config.metadata.priorityField as string) ?? "priority";
    const pointsField = (config.metadata.pointsField as string) ?? "points";
    const teams = (config.metadata.teams as any[]) ?? [{ id: "alpha", name: "Alpha", icon: "settings" }, { id: "beta", name: "Beta", icon: "rocket" }];

    const priorityDots: Record<string, string> = { critical: "circle-alert", high: "circle-dot", medium: "circle", low: "circle-dashed" };
    const typeIcons: Record<string, string> = { feature: "star", bug: "bug", chore: "clipboard-list", spike: "zap", security: "shield" };

    let activeFilter = "all";
    const assignments: Record<string, Set<string>> = {};
    teams.forEach(t => { assignments[t.id] = new Set(); });

    const sidebar = el("div", "roster");
    const teamGrid = el("div", "grid");

    function renderSidebar() {
        sidebar.replaceChildren();
        const assignedIds = new Set<string>();
        Object.values(assignments).forEach(s => s.forEach(id => assignedIds.add(id)));
        const remaining = items.filter(item => !assignedIds.has(String(item.id ?? "")));

        // Filter bar
        const filterBar = el("div", "filter-bar");
        const types = ["all", ...new Set(items.map(i => String(i[typeField] ?? "")).filter(Boolean))];
        types.forEach(t => {
            const pill = el("span", "filter-pill", t === "all" ? "All" : `${typeIcons[t] ?? ""} ${t}`);
            if (t === activeFilter) pill.setAttribute("data-active", "true");
            pill.addEventListener("click", () => { activeFilter = t; renderSidebar(); ctx.fire("filter", { type: t }); });
            filterBar.appendChild(pill);
        });
        sidebar.appendChild(filterBar);

        // Progress bar
        const progressWrap = el("div", "progress-bar");
        const progressFill = el("div", "progress-fill");
        const pct = items.length > 0 ? ((items.length - remaining.length) / items.length) * 100 : 0;
        progressFill.style.width = `${pct}%`;
        progressWrap.appendChild(progressFill);
        sidebar.appendChild(progressWrap);

        const filtered = activeFilter === "all" ? remaining : remaining.filter(i => String(i[typeField] ?? "") === activeFilter);
        filtered.forEach((item) => {
            const card = el("div", "roster-item");
            card.draggable = true;
            const handle = el("span", "drag-handle", "⠿");
            const priorityDot = el("span", "priority-dot");
            priorityDot.setAttribute("data-icon", priorityDots[String(item[priorityField] ?? "low")] ?? "circle-dashed");
            const content = el("div", "roster-info");
            const title = el("span", "roster-name", String(item[titleField] ?? ""));
            const meta = el("div", "roster-meta");
            const typeBadge = el("span", "type-badge");
            typeBadge.setAttribute("data-icon", typeIcons[String(item[typeField] ?? "")] ?? "file");
            typeBadge.textContent = String(item[typeField] ?? "");
            const pts = el("span", "points", `${item[pointsField] ?? 0}pt`);
            meta.append(typeBadge, pts);
            content.append(title, meta);
            card.append(handle, priorityDot, content);

            card.addEventListener("dragstart", (e: DragEvent) => {
                card.setAttribute("data-dragging", "true");
                e.dataTransfer!.setData("application/json", JSON.stringify(item));
                e.dataTransfer!.effectAllowed = "move";
            });
            card.addEventListener("dragend", () => card.removeAttribute("data-dragging"));
            sidebar.appendChild(card);
        });
    }

    function renderTeams() {
        teamGrid.replaceChildren();
        teams.forEach(team => {
            const zone = el("div", "team-zone");
            zone.setAttribute("data-zone", team.id);

            const header = el("div", "team-header");
            header.appendChild(el("span", "team-name", `${team.icon ?? ""} ${team.name}`));
            const totalPts = [...assignments[team.id]].reduce((sum, id) => {
                const item = items.find(i => String(i.id ?? "") === id);
                return sum + (Number(item?.[pointsField]) || 0);
            }, 0);
            header.appendChild(el("span", "points", `${totalPts}pts · ${assignments[team.id].size}`));
            zone.appendChild(header);

            const members = el("div", "team-members");
            assignments[team.id].forEach(id => {
                const item = items.find(i => String(i.id ?? "") === id);
                if (!item) return;
                const row = el("div", "roster-item");
                const pDot = el("span", "priority-dot");
                pDot.setAttribute("data-icon", priorityDots[String(item[priorityField] ?? "low")] ?? "circle-dashed");
                row.appendChild(pDot);
                row.appendChild(el("span", "roster-name", String(item[titleField] ?? "")));
                row.appendChild(el("span", "points", `${item[pointsField] ?? 0}pt`));
                members.appendChild(row);
            });
            if (assignments[team.id].size === 0) {
                members.appendChild(el("div", "drop-zone", "Drop items here"));
            }
            zone.appendChild(members);

            zone.addEventListener("drop", (e: DragEvent) => {
                e.preventDefault();
                zone.removeAttribute("data-over");
                try {
                    const item = JSON.parse(e.dataTransfer!.getData("application/json"));
                    const id = String(item.id ?? "");
                    Object.values(assignments).forEach(s => s.delete(id));
                    assignments[team.id].add(id);
                    ctx.fire("drop", { zone: team.id, item });
                    renderSidebar();
                    renderTeams();
                } catch {}
            });
            zone.addEventListener("dragover", (e: DragEvent) => { e.preventDefault(); zone.setAttribute("data-over", "true"); });
            zone.addEventListener("dragleave", () => zone.removeAttribute("data-over"));
            teamGrid.appendChild(zone);
        });
    }

    renderSidebar();
    renderTeams();
    root.append(sidebar, teamGrid);
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
