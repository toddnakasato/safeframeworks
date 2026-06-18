import type { ConfigBase, Field } from "../../safecontracts/src/contracts";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import { el, applyPaintState, applyIntent, readList, readSchema } from "../utils/util";
import { fmtDate, fmtCurrency, fmtInt, fmtPercent, fmtStr } from "../../safecontracts/src/contracts-formatter";
import { sortBy, paginate } from "../../safecontracts/src/contracts-operations";
import type { SortDir } from "../../safecontracts/src/contracts-operations";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

// SortDir imported from contracts-operations

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

function formatValue(value: any, field: Field): string {
    if (value === null || value === undefined) return "—";
    switch (field.type) {
        case "currency":
            return fmtCurrency(Number(value));
        case "number":
            return fmtInt(Number(value));
        case "percent":
            return fmtPercent(Number(value));
        case "date":
        case "datetime":
            return fmtDate(value);
        case "boolean":
            return value ? "Yes" : "No";
        default:
            return fmtStr(value);
    }
}

function numericType(type: string): boolean {
    return type === "currency" || type === "number" || type === "percent";
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeTable(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;

    // Self-extract data + schema from the first datasource
    const schema = readSchema(config);
    const data = readList(config);
    const fields = schema.filter((f: Field) => f.visible !== false);

    const variant = (metadata.variant as string) ?? "default";
    const spacing = (metadata.spacing as string) ?? "normal";
    const headerStyle = (metadata.headerStyle as string) ?? "default";
    const rowDivider = (metadata.rowDivider as string) ?? "thin";
    const headerDivider = (metadata.headerDivider as string) ?? "thin";
    const hoverStyle = (metadata.hoverStyle as string) ?? "row";
    const zebra = (metadata.zebra as string) ?? (variant === "striped" ? "even" : "none");
    const stickyHeader = !!metadata.stickyHeader;
    const rowNumbers = !!metadata.rowNumbers;
    const truncate = metadata.truncate !== false;
    const columnLines = !!metadata.columnLines;
    const footerSummary = !!metadata.footerSummary;
    const selectable = !!metadata.selectable;
    const reorderable = !!metadata.reorderable;
    const pageSize = (metadata.pageSize as number) ?? 0;

    // Internal state
    let sortFields: { field: string; dir: SortDir }[] = [];
    if ((metadata.defaultSort as string)) {
        sortFields = [{ field: metadata.defaultSort as string, dir: (metadata.defaultSortDir as SortDir) ?? "asc" }];
    }
    let page = 0;
    const selected = new Set<string>();
    let dragIdx: number | null = null;
    let dragOverIdx: number | null = null;
    let localOrder: Record<string, any>[] | null = null;

    // External state (resolved from state.json by host)
    const hoverRow = (metadata.hoverRow as number) ?? null;
    const selectedRow = (metadata.selectedRow as number) ?? null;

    const root = el("div");
    root.setAttribute("data-component", "table");
    applyIntent(root, metadata);
    applyPaintState(root, metadata, "table");

    const { fire } = ctx;

    if (data.length === 0) {
        root.setAttribute("data-role", "empty");
        root.textContent = (metadata.emptyMessage as string) ?? "No results";
        container.appendChild(root);
        return root;
    }
    root.setAttribute("data-header-style", headerStyle);
    root.setAttribute("data-row-divider", rowDivider);
    root.setAttribute("data-header-divider", headerDivider);
    root.setAttribute("data-hover", hoverStyle);
    root.setAttribute("data-zebra", zebra);
    if (stickyHeader) root.setAttribute("data-sticky", "true");
    if (rowNumbers) root.setAttribute("data-row-numbers", "true");
    if (truncate) root.setAttribute("data-truncate", "true");
    if (columnLines) root.setAttribute("data-column-lines", "true");
    if (selectable) root.setAttribute("data-selectable", "true");
    if (footerSummary) root.setAttribute("data-footer", "true");

    function getSorted(): Record<string, any>[] {
        const source = localOrder ?? data;
        if (sortFields.length === 0) return source;
        // Apply sorts in reverse priority (last = primary)
        let result = [...source];
        for (let i = sortFields.length - 1; i >= 0; i--) {
            result = sortBy(result, sortFields[i].field, sortFields[i].dir);
        }
        return result;
    }

    function handleSort(field: Field) {
        if (!field.sortable) return;
        const existing = sortFields.findIndex(s => s.field === field.name);
        if (existing >= 0) {
            // Toggle direction or remove
            const current = sortFields[existing];
            if (current.dir === "asc") {
                sortFields[existing] = { field: field.name, dir: "desc" };
            } else {
                sortFields.splice(existing, 1);
            }
        } else {
            sortFields.push({ field: field.name, dir: "asc" });
        }
        page = 0;
        fire("sort", { field: field.name, dir: sortFields.find(s => s.field === field.name)?.dir ?? "asc" });
        render();
    }

    function selectedIndices(): number[] {
        return [...selected].map(id => data.findIndex(r => (r.Id ?? r.id ?? String(r)) === id)).filter(i => i >= 0);
    }

    function handleRowSelect(id: string) {
        if (selected.has(id)) selected.delete(id);
        else selected.add(id);
        fire("row:select", { selected: selectedIndices() });
        render();
    }

    function render() {
        root.replaceChildren();

        const sorted = getSorted();
        const pg = paginate(sorted, page + 1, pageSize); // table uses 0-indexed page internally
        const paged = pg.items;
        const totalPages = pg.totalPages;

        const scroll = el("div", "scroll");
        // Filter input
        if (metadata.filterable) {
            const filterWrap = el("div", "filter-wrap");
            const filterInput = document.createElement("input") as HTMLInputElement;
            filterInput.type = "text";
            filterInput.placeholder = (metadata.filterPlaceholder as string) ?? "Filter…";
            filterInput.setAttribute("data-role", "filter");
            filterInput.addEventListener("input", () => {
                fire("filter", { value: filterInput.value });
            });
            filterWrap.appendChild(filterInput);
            root.appendChild(filterWrap);
        }
        const table = el("table", "table");
        const thead = el("thead", "thead");
        const headerRow = el("tr", "header-row");

        if (reorderable) {
            const th = el("th", "drag-handle-header");
            th.style.width = "28px";
            headerRow.appendChild(th);
        }
        if (rowNumbers) headerRow.appendChild(el("th", "row-number-header", "#"));
        if (selectable) {
            const th = el("th", "select-header");
            const cb = document.createElement("input");
            cb.type = "checkbox";
            cb.checked = selected.size === paged.length && paged.length > 0;
            cb.onchange = () => {
                if (selected.size === paged.length) {
                    selected.clear();
                    fire("row:select", { selected: [] });
                    fire("select", { selected: [], all: false });
                } else {
                    selected.clear();
                    for (const r of paged) selected.add(r.Id ?? r.id ?? String(r));
                    fire("row:select", { selected: selectedIndices() });
                    fire("select", { selected: selectedIndices(), all: true });
                }
                render();
            };
            th.appendChild(cb);
            headerRow.appendChild(th);
        }

        for (const field of fields) {
            const th = el("th", "column-header", field.label);
            if (field.sortable) th.setAttribute("data-sortable", "true");
            const sortEntry = sortFields.find(s => s.field === field.name);
            if (sortEntry) {
                th.setAttribute("data-sorted", sortEntry.dir);
                const sortIndex = sortFields.length > 1 ? `${sortFields.indexOf(sortEntry) + 1}` : "";
                const ind = el("span", "sort-indicator", `${sortEntry.dir === "asc" ? "↑" : "↓"}${sortIndex}`);
                th.appendChild(ind);
            }
            if (numericType(field.type)) th.setAttribute("data-align", "right");
            if (field.width) th.style.width = `${field.width}px`;
            th.onclick = () => handleSort(field);
            // Column resize via pointer drag on right edge
            let resizeStart: { x: number; w: number } | null = null;
            th.onpointerdown = (e) => {
                const rect = th.getBoundingClientRect();
                if (e.clientX > rect.right - 6) {
                    resizeStart = { x: e.clientX, w: rect.width };
                    th.setPointerCapture(e.pointerId);
                    e.preventDefault();
                }
            };
            th.onpointermove = (e) => {
                if (resizeStart) {
                    const newWidth = Math.max(30, resizeStart.w + (e.clientX - resizeStart.x));
                    th.style.width = `${newWidth}px`;
                }
            };
            th.onpointerup = (e) => {
                if (resizeStart) {
                    const newWidth = Math.max(30, resizeStart.w + (e.clientX - resizeStart.x));
                    resizeStart = null;
                    th.releasePointerCapture(e.pointerId);
                    fire("column:resize", { field: field.name, width: newWidth });
                }
            };
            headerRow.appendChild(th);
        }

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = el("tbody", "tbody");
        paged.forEach((row, rowIndex) => {
            const rowId = row.Id ?? row.id ?? String(rowIndex);
            const globalIndex = pageSize ? page * pageSize + rowIndex : rowIndex;
            const tr = el("tr", "row");
            if (selected.has(rowId)) tr.setAttribute("data-selected", "true");
            tr.setAttribute("data-clickable", "true");
            tr.setAttribute("data-index", String(globalIndex));
            if (hoverRow === globalIndex) tr.setAttribute("data-row-hover", "true");
            if (selectedRow === globalIndex) tr.setAttribute("data-row-selected", "true");
            if (reorderable && dragIdx === rowIndex) tr.setAttribute("data-dragging", "true");
            if (reorderable && dragOverIdx === rowIndex) tr.setAttribute("data-drag-over", "true");
            if (reorderable) {
                tr.draggable = true;
                tr.ondragstart = (e) => {
                    dragIdx = rowIndex;
                    if (e.dataTransfer) {
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", String(rowIndex));
                    }
                    render();
                };
                tr.ondragover = (e) => {
                    e.preventDefault();
                    if (dragOverIdx !== rowIndex) {
                        dragOverIdx = rowIndex;
                        render();
                    }
                };
                tr.ondragleave = () => {
                    dragOverIdx = null;
                    render();
                };
                tr.ondrop = (e) => {
                    e.preventDefault();
                    if (dragIdx !== null && dragIdx !== rowIndex) {
                        const newOrder = [...paged];
                        const [moved] = newOrder.splice(dragIdx, 1);
                        newOrder.splice(rowIndex, 0, moved);
                        localOrder = newOrder;
                        fire("reorder", { order: newOrder.map((r, i) => ({ id: r.Id ?? r.id, index: i })) });
                    }
                    dragIdx = null;
                    dragOverIdx = null;
                    render();
                };
                tr.ondragend = () => {
                    dragIdx = null;
                    dragOverIdx = null;
                    render();
                };
            }
            tr.onclick = (e) => {
                if (reorderable && dragIdx !== null) {
                    e.stopPropagation();
                    return;
                }
                fire("row:click", { index: globalIndex });
            };
            tr.ondblclick = () => {
                fire("row:dblclick", { index: globalIndex });
            };
            tr.onmouseenter = () => {
                // cssOnly: update DOM directly, no round-trip through state.json
                container.querySelectorAll("tr[data-row-hover]").forEach(r => r.removeAttribute("data-row-hover"));
                tr.setAttribute("data-row-hover", "true");
                fire("row:hover", { index: globalIndex });
            };
            tr.onmouseleave = () => {
                tr.removeAttribute("data-row-hover");
                fire("row:leave", { index: globalIndex });
            };

            if (reorderable) {
                const td = el("td", "drag-handle", "⠿");
                td.style.cursor = "grab";
                td.style.textAlign = "center";
                td.style.color = "var(--sd-text-dim, #999)";
                td.style.userSelect = "none";
                tr.appendChild(td);
            }
            if (rowNumbers) tr.appendChild(el("td", "row-number", String(globalIndex + 1)));
            if (selectable) {
                const td = el("td", "select-cell");
                td.onclick = (e) => {
                    e.stopPropagation();
                    handleRowSelect(rowId);
                };
                const cb = document.createElement("input");
                cb.type = "checkbox";
                cb.checked = selected.has(rowId);
                cb.onchange = () => handleRowSelect(rowId);
                td.appendChild(cb);
                tr.appendChild(td);
            }
            for (let colIndex = 0; colIndex < fields.length; colIndex++) {
                const field = fields[colIndex];
                const td = el("td", "cell", formatValue(row[field.name], field));
                td.setAttribute("data-type", field.type);
                if (numericType(field.type)) td.setAttribute("data-align", "right");
                td.onclick = (e) => {
                    e.stopPropagation();
                    fire("cell:click", { index: globalIndex, col: colIndex, field: field.name });
                };
                td.ondblclick = (e) => {
                    e.stopPropagation();
                    fire("cell:dblclick", { index: globalIndex, col: colIndex, field: field.name });
                    // Fire cell:edit to signal editing intent on double-click
                    fire("cell:edit", { index: globalIndex, col: colIndex, field: field.name, value: row[field.name] });
                };
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        if (footerSummary) {
            const summaryRow: Record<string, any> = {};
            for (const field of fields) {
                if (field.type === "currency" || field.type === "number") {
                    summaryRow[field.name] = sorted.reduce((acc, r) => acc + (Number(r[field.name]) || 0), 0);
                } else if (field.type === "percent") {
                    summaryRow[field.name] = Math.round(sorted.reduce((acc, r) => acc + (Number(r[field.name]) || 0), 0) / (sorted.length || 1) * 10) / 10;
                } else {
                    summaryRow[field.name] = "";
                }
            }
            const tfoot = el("tfoot", "tfoot");
            const tr = el("tr", "summary-row");
            if (rowNumbers) tr.appendChild(el("td", "row-number", "Σ"));
            if (selectable) tr.appendChild(el("td", "select-cell"));
            fields.forEach((field, fi) => {
                const text = fi === 0 && !numericType(field.type)
                    ? `${sorted.length} rows`
                    : summaryRow[field.name] !== ""
                        ? formatValue(summaryRow[field.name], field)
                        : "";
                const td = el("td", "summary-cell", text);
                td.setAttribute("data-type", field.type);
                if (numericType(field.type)) td.setAttribute("data-align", "right");
                tr.appendChild(td);
            });
            tfoot.appendChild(tr);
            table.appendChild(tfoot);
        }

        scroll.appendChild(table);
        root.appendChild(scroll);

        if (pageSize > 0 && totalPages > 1) {
            const pagination = el("div", "pagination");
            const info = el("span", "page-info",
                `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, sorted.length)} of ${sorted.length}`);
            const controls = el("div", "page-controls");
            const prev = el("button", "page-prev", "← Prev") as HTMLButtonElement;
            if (page === 0) {
                prev.setAttribute("data-disabled", "true");
                prev.disabled = true;
            }
            prev.onclick = () => {
                page -= 1;
                fire("page", { page });
                render();
            };
            const next = el("button", "page-next", "Next →") as HTMLButtonElement;
            if (page >= totalPages - 1) {
                next.setAttribute("data-disabled", "true");
                next.disabled = true;
            }
            next.onclick = () => {
                page += 1;
                fire("page", { page });
                render();
            };
            controls.append(prev, next);
            pagination.append(info, controls);
            root.appendChild(pagination);
        }
    }
    render();

    container.appendChild(root);
    return root;
}
