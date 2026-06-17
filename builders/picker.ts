import type { ConfigBase, RowCell, RowDef } from "../../safecontracts/src/contracts";
import { el, applyPaintState, applyIntent } from "../utils/util";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import { getDataSource } from "../../safecontracts/src/contracts";
import { filterBy } from "../../safecontracts/src/contracts-operations";
import { readList } from "../../safecontracts/src/contracts-data";

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

export function createSafePicker(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    const isCardGrid = metadata.variant === "card-grid";

    // Self-extract list from config data (SafeRenderer does this for react)
    const ds = getDataSource(config) as any;
    const data: Record<string, any>[] = readList(config);

    const accent = (metadata.accent as string) ?? "brand";
    const spacing = (metadata.spacing as string) ?? "normal";
    const surface = (metadata.surface as string) ?? "base";
    const radius = (metadata.radius as string) ?? "md";
    const searchFields = (metadata.searchFields as string[]) ??
        ([metadata.labelField, metadata.subtitleField].filter(Boolean) as string[]);

    const filterField = metadata.filterField as string | undefined;
    let filterValue = (metadata.filterValue as string) ?? "";
    let search = "";

    const filterOptions: string[] = (() => {
        if (!filterField) return [];
        const vals = new Set<string>();
        for (const row of data) {
            const v = row[filterField];
            if (v != null && String(v).trim()) vals.add(String(v));
        }
        return Array.from(vals).sort();
    })();

    const rows: RowDef[] = (metadata.rows as RowDef[]) ?? [];
    if (rows.length === 0) {
        const schema = (getDataSource(config) as any)?.schema;
        if (schema?.fields) {
            const f = schema.fields.filter((x: any) => x.visible !== false);
            if (f.length >= 2) rows.push([{ field: f[0].name, style: "label" }, { field: f[1].name, align: "end", style: "badge" }]);
            else if (f.length === 1) rows.push([{ field: f[0].name, style: "label" }]);
            if (f.length >= 3) rows.push([{ field: f[2].name, style: "subtitle" }]);
        }
    }

    const root = el("div");
    root.setAttribute("data-component", "picker");
    applyIntent(root, metadata);
    applyPaintState(root, metadata, "picker");

    // Paint intent attributes
    const _selectedItem = metadata.selectedItem ?? null;
    if (_selectedItem != null) root.setAttribute("data-selected-item", String(_selectedItem));

    // External paint state (resolved from state.json by host)

    root.setAttribute("data-variant", isCardGrid ? "card-grid" : ((metadata.variant as string) ?? "default"));
    root.setAttribute("data-surface", surface);
    root.setAttribute("data-accent", accent);
    root.setAttribute("data-spacing", spacing);
    root.setAttribute("data-radius", radius);
    const maxWidth = metadata.maxWidth as string | undefined;
    if (maxWidth) root.style.maxWidth = maxWidth;

    if (metadata.title) root.appendChild(el("div", "title", metadata.title as string));

    const showSearch = metadata.showSearch !== false;
    if (showSearch) {
        const form = el("form", "search-form");
        form.addEventListener("submit", (e) => e.preventDefault());

        if (filterField && filterOptions.length > 0) {
            const select = document.createElement("select");
            select.setAttribute("data-role", "filter");
            select.setAttribute("data-accent", accent);
            select.setAttribute("data-radius", radius);
            const all = document.createElement("option");
            all.value = "";
            all.textContent = (metadata.filterLabel as string) ?? "All";
            select.appendChild(all);
            for (const v of filterOptions) {
                const opt = document.createElement("option");
                opt.value = v;
                opt.textContent = v;
                select.appendChild(opt);
            }
            select.value = filterValue;
            select.addEventListener("change", () => {
                filterValue = select.value;
                ctx.fire("filter", { field: filterField, value: select.value });
                renderResults();
            });
            form.appendChild(select);
        }

        const input = document.createElement("input");
        input.setAttribute("data-role", "search-input");
        input.setAttribute("data-surface", surface);
        input.setAttribute("data-accent", accent);
        input.setAttribute("data-radius", radius);
        input.setAttribute("data-spacing", spacing);
        input.placeholder = (metadata.placeholder as string) ?? "Search…";
        input.autofocus = true;
        input.addEventListener("input", () => {
            search = input.value;
            renderResults();
        });
        form.appendChild(input);
        root.appendChild(form);
    }

    const results: HTMLElement = isCardGrid ? el("div", "grid") : el("ul", "list");
    if (isCardGrid) {
        const cardMin = (metadata.cardMinWidth as string) ?? "220px";
        results.style.display = "grid";
        results.style.gridTemplateColumns = `repeat(auto-fill, minmax(${cardMin}, 1fr))`;
        results.style.gap = "10px";
        results.style.alignContent = "start";
    } else {
        results.setAttribute("data-surface", surface);
        results.setAttribute("data-radius", radius);
    }
    root.appendChild(results);

    function getFiltered(): Record<string, any>[] {
        let result = data;
        if (filterField && filterValue) {
            result = result.filter((row) => String(row[filterField] ?? "") === filterValue);
        }
        if (search.trim()) {
            result = filterBy(result, search, searchFields);
        }
        return result;
    }

    function buildCell(cell: RowCell, row: Record<string, any>): HTMLElement | null {
        if (cell.text) {
            const c = el("div", undefined, cell.text);
            if (cell.style) c.setAttribute("data-style", cell.style);
            if (cell.align) c.setAttribute("data-align", cell.align);
            return c;
        }
        const val = row[cell.field];
        if (val == null || String(val).trim() === "") return null;
        const c = el("div", undefined, String(val));
        if (cell.style) c.setAttribute("data-style", cell.style);
        if (cell.align) c.setAttribute("data-align", cell.align);
        c.setAttribute("data-field", cell.field);
        return c;
    }

    function buildRows(target: HTMLElement, row: Record<string, any>): void {
        for (const rowDef of rows) {
            const r = el("div", "row");
            r.setAttribute("data-cells", String(rowDef.length));
            for (const cell of rowDef) {
                const c = buildCell(cell, row);
                if (c) r.appendChild(c);
            }
            target.appendChild(r);
        }
    }

    function renderResults() {
        results.replaceChildren();
        const filtered = getFiltered();
        const emptyMsg = search
            ? ((metadata.noMatchMessage as string) ?? "No matches.")
            : ((metadata.emptyMessage as string) ?? "No results");

        filtered.forEach((row, i) => {
            if (isCardGrid) {
                const card = el("div", "card");
                card.setAttribute("data-surface", "raised");
                card.setAttribute("data-radius", radius);
                card.onclick = () => ctx.fire("select", { row, index: i });
                buildRows(card, row);
                results.appendChild(card);
            } else {
                const li = el("li", "list-item");
                li.setAttribute("data-spacing", spacing);
                li.onclick = () => ctx.fire("select", { row, index: i });
                buildRows(li, row);
                results.appendChild(li);
            }
        });

        if (filtered.length === 0) {
            results.appendChild(el(isCardGrid ? "div" : "li", "empty", emptyMsg));
        }
    }
    renderResults();

    container.appendChild(root);
    return root;
}

export function initSafePickers(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-picker-config]").forEach((host) => {
        if (host.dataset.pickerMounted) return;
        host.dataset.pickerMounted = "1";
        const config = JSON.parse(host.dataset.pickerConfig!) as ConfigBase;
        createSafePicker(host, config);
    });
}