import { HyperFormula } from "hyperformula";
import { fireSheet } from "../../safecontracts/src/contracts-emit";
import { getDataSource } from "../../safecontracts/src/contracts";
import type { ConfigBase, OnSafeEvent } from "../../safecontracts/src/contracts";
import type { SheetColumn } from "../../safecontracts/src/components/sheet";
import { SHEET_DEFAULTS, SHEET_STATUS_ACCENTS } from "../../safecontracts/src/components/sheet";

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

function colLabel(idx: number): string {
    let s = "";
    let n = idx;
    while (n >= 0) {
        s = String.fromCharCode(65 + (n % 26)) + s;
        n = Math.floor(n / 26) - 1;
    }
    return s;
}

function formatValue(val: any, col?: SheetColumn): string {
    if (val == null || val === "") return "";
    const fmt = col?.format ?? "text";
    const dec = col?.decimals ?? 2;
    if (fmt === "currency" && typeof val === "number") return `$${val.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec })}`;
    if (fmt === "percent" && typeof val === "number") return `${(val * 100).toFixed(dec)}%`;
    if (fmt === "number" && typeof val === "number") return val.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
    return String(val);
}

function el(tag: string, role?: string, text?: string): HTMLElement {
    const e = document.createElement(tag);
    if (role) e.setAttribute("data-role", role);
    if (text != null) e.textContent = text;
    return e;
}

function statusAccent(val: any, overrides?: Record<string, string>): string {
    const key = String(val ?? "").toLowerCase();
    const map = { ...SHEET_STATUS_ACCENTS, ...(overrides ?? {}) };
    return map[key] ?? "neutral";
}

function columnTotals(rows: any[][], numCols: number): (number | null)[] {
    const totals: (number | null)[] = [];
    for (let c = 0; c < numCols; c++) {
        let sum = 0;
        let numeric = false;
        for (const row of rows) {
            if (typeof row[c] === "number") { sum += row[c]; numeric = true; }
        }
        totals.push(numeric ? sum : null);
    }
    return totals;
}

function fillCell(td: HTMLElement, val: any, col: SheetColumn | undefined, rows: any[][], colIdx: number, statusOverrides?: Record<string, string>) {
    if (col?.status) {
        const badge = el("span", "status-badge", formatValue(val, col));
        badge.setAttribute("data-accent", statusAccent(val, statusOverrides));
        td.appendChild(badge);
        return;
    }
    if (col?.bar && typeof val === "number") {
        const max = Math.max(...rows.map((r) => (typeof r[colIdx] === "number" ? r[colIdx] : 0)), 0);
        const wrap = el("span", "bar-cell");
        const bar = el("span", "bar");
        bar.style.width = max > 0 ? `${Math.round((val / max) * 100)}%` : "0%";
        const label = el("span", "bar-label", formatValue(val, col));
        wrap.append(bar, label);
        td.appendChild(wrap);
        return;
    }
    td.textContent = formatValue(val, col);
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeSheet(container: HTMLElement, config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
    const metadata = config.metadata;
    const variant = (metadata.variant as string) ?? SHEET_DEFAULTS.variant;
    const surface = (metadata.surface as string) ?? "base";
    const spacing = (metadata.spacing as string) ?? "normal";
    const columns = (metadata.columns as SheetColumn[]) ?? [];
    const frozenRows = (metadata.frozenRows as number) ?? SHEET_DEFAULTS.frozenRows;
    const frozenCols = (metadata.frozenCols as number) ?? SHEET_DEFAULTS.frozenCols;
    const chromeless = SHEET_DEFAULTS.chromelessVariants.includes(variant);
    const rowNumbers = metadata.rowNumbers ?? (chromeless ? false : SHEET_DEFAULTS.rowNumbers);
    const columnHeaders = metadata.columnHeaders ?? SHEET_DEFAULTS.columnHeaders;
    const readonly = SHEET_DEFAULTS.readonlyVariants.includes(variant);
    const editable = !readonly && (metadata.editable ?? (chromeless ? false : SHEET_DEFAULTS.editable));
    const formulaBar = (metadata.formulaBar as boolean) ?? SHEET_DEFAULTS.formulaBar;
    const highlights = (metadata.highlights as { row: number; col: number; accent: string }[]) ?? [];
    const groupCol = metadata.groupCol as number | undefined;
    const totalsRow = (metadata.totalsRow as boolean) ?? SHEET_DEFAULTS.totalsRow;
    const totalsCol = (metadata.totalsCol as boolean) ?? SHEET_DEFAULTS.totalsCol;
    const statusOverrides = metadata.statusAccents as Record<string, string> | undefined;
    const skeletonRows = (metadata.skeletonRows as number) ?? SHEET_DEFAULTS.skeletonRows;
    const skeletonCols = (metadata.skeletonCols as number) ?? (columns.length || SHEET_DEFAULTS.skeletonCols);
    const emptyMessage = (metadata.emptyMessage as string) ?? SHEET_DEFAULTS.emptyMessage;

    const ds = getDataSource(config);
    const raw = ds?.inline;
    const data: any[][] = Array.isArray(raw) ? (raw as any[][]) : [];

    const hf = HyperFormula.buildFromArray(data, { licenseKey: "gpl-v3" });

    const dims = hf.getSheetDimensions(0);
    const evaluated: any[][] = [];
    for (let r = 0; r < dims.height; r++) {
        const row: any[] = [];
        for (let c = 0; c < dims.width; c++) {
            row.push(hf.getCellValue({ sheet: 0, row: r, col: c }));
        }
        evaluated.push(row);
    }

    const numCols = evaluated[0]?.length ?? columns.length;
    const numRows = evaluated.length;

    let selectedCell: [number, number] | null = null;
    let editingCell: [number, number] | null = null;
    let editValue = "";
    const cellOverrides: Record<string, any> = {};
    const rawOverrides: Record<string, any> = {};

    const root = el("div");
    root.setAttribute("data-component", "sheet");
    root.setAttribute("data-variant", variant);
    root.setAttribute("data-surface", surface);
    root.setAttribute("data-spacing", spacing);
    for (const token of ["accent", "density", "radius"]) {
        if (metadata[token] != null) root.setAttribute(`data-${token}`, String(metadata[token]));
    }

    const getCellValue = (r: number, c: number): any => {
        const key = `${r}:${c}`;
        if (key in cellOverrides) return cellOverrides[key];
        return evaluated[r]?.[c];
    };

    const getRawValue = (r: number, c: number): any => {
        const key = `${r}:${c}`;
        if (key in rawOverrides) return rawOverrides[key];
        return data[r]?.[c];
    };

    const handleCellClick = (r: number, c: number) => {
        selectedCell = [r, c];
        fireSheet(onEvent, "select", { row: r, col: c, value: getCellValue(r, c) });
        render();
    };

    const handleCellDoubleClick = (r: number, c: number) => {
        if (!editable) return;
        editingCell = [r, c];
        const rawVal = getRawValue(r, c);
        editValue = rawVal != null ? String(rawVal) : "";
        render();
    };

    const commitEdit = () => {
        if (!editingCell) return;
        const [r, c] = editingCell;
        const val = editValue.startsWith("=") ? editValue : (isNaN(Number(editValue)) ? editValue : Number(editValue));
        try {
            hf.setCellContents({ sheet: 0, row: r, col: c }, val);
            rawOverrides[`${r}:${c}`] = val;
            const d = hf.getSheetDimensions(0);
            for (const k of Object.keys(cellOverrides)) delete cellOverrides[k];
            for (let ri = 0; ri < d.height; ri++) {
                for (let ci = 0; ci < d.width; ci++) {
                    const v = hf.getCellValue({ sheet: 0, row: ri, col: ci });
                    if (v !== evaluated[ri]?.[ci]) cellOverrides[`${ri}:${ci}`] = v;
                }
            }
        } catch {}
        editingCell = null;
        fireSheet(onEvent, "edit", { row: r, col: c, value: val });
        render();
    };

    const cancelEdit = () => {
        editingCell = null;
        render();
    };

    function renderHeaderRow(table: HTMLElement, cols: number, extraLeading = 0, extraTrailingLabel?: string) {
        const thead = document.createElement("thead");
        const headerRow = el("tr", "header-row");
        if (rowNumbers) headerRow.appendChild(el("th", "corner"));
        for (let i = 0; i < extraLeading; i++) headerRow.appendChild(el("th", "corner"));
        for (let c = 0; c < cols; c++) {
            const th = el("th", "col-header", columns[c]?.label ?? colLabel(c));
            if (c < frozenCols) th.setAttribute("data-frozen", "true");
            if (columns[c]?.width) th.style.width = `${columns[c].width}px`;
            if (columns[c]?.align) th.setAttribute("data-align", columns[c].align!);
            headerRow.appendChild(th);
        }
        if (extraTrailingLabel != null) {
            const th = el("th", "col-header", extraTrailingLabel);
            th.setAttribute("data-total", "true");
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);
    }

    function renderSkeleton() {
        const table = el("table", "grid");
        if (columnHeaders && columns.length) renderHeaderRow(table, skeletonCols);
        const tbody = document.createElement("tbody");
        for (let r = 0; r < skeletonRows; r++) {
            const tr = el("tr", "row");
            if (rowNumbers) tr.appendChild(el("td", "row-number", String(r + 1)));
            for (let c = 0; c < skeletonCols; c++) {
                const td = el("td", "cell");
                td.appendChild(el("span", "skeleton-cell"));
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        return table;
    }

    function renderEmpty() {
        const table = el("table", "grid");
        renderHeaderRow(table, columns.length || numCols);
        const tbody = document.createElement("tbody");
        const tr = el("tr", "row");
        const td = el("td", "empty-message", emptyMessage);
        td.setAttribute("colspan", String((columns.length || numCols) + (rowNumbers ? 1 : 0)));
        tr.appendChild(td);
        tbody.appendChild(tr);
        table.appendChild(tbody);
        return table;
    }

    function renderKeyValue() {
        const table = el("table", "grid");
        const tbody = document.createElement("tbody");
        for (let r = 0; r < numRows; r++) {
            const tr = el("tr", "row");
            const label = el("td", "kv-label", formatValue(evaluated[r]?.[0], columns[0]));
            const value = el("td", "kv-value");
            fillCell(value, evaluated[r]?.[1], columns[1], evaluated, 1, statusOverrides);
            tr.append(label, value);
            tr.onclick = () => handleCellClick(r, 1);
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        return table;
    }

    function renderGrouped() {
        const gc = groupCol ?? 0;
        const table = el("table", "grid");
        const dataCols = columns.length ? columns.map((_, i) => i).filter((i) => i !== gc) : evaluated[0]?.map((_, i) => i).filter((i) => i !== gc) ?? [];
        if (columnHeaders && columns.length) {
            const thead = document.createElement("thead");
            const headerRow = el("tr", "header-row");
            for (const c of dataCols) {
                const th = el("th", "col-header", columns[c]?.label ?? colLabel(c));
                if (columns[c]?.align) th.setAttribute("data-align", columns[c].align!);
                headerRow.appendChild(th);
            }
            thead.appendChild(headerRow);
            table.appendChild(thead);
        }
        const tbody = document.createElement("tbody");
        let currentGroup: any = Symbol("none");
        for (let r = 0; r < numRows; r++) {
            const groupVal = evaluated[r]?.[gc];
            if (groupVal !== currentGroup) {
                currentGroup = groupVal;
                const gtr = el("tr", "group-row");
                const gtd = el("td", "group-header", String(groupVal ?? ""));
                gtd.setAttribute("colspan", String(dataCols.length));
                gtd.setAttribute("data-accent", statusAccent(groupVal, statusOverrides));
                gtr.appendChild(gtd);
                tbody.appendChild(gtr);
            }
            const tr = el("tr", "row");
            for (const c of dataCols) {
                const td = el("td", "cell");
                const align = columns[c]?.align ?? (typeof evaluated[r]?.[c] === "number" ? "right" : "left");
                td.setAttribute("data-align", align);
                fillCell(td, evaluated[r]?.[c], columns[c], evaluated, c, statusOverrides);
                td.onclick = () => handleCellClick(r, c);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        return table;
    }

    function renderPivot() {
        const table = el("table", "grid");
        renderHeaderRow(table, numCols, 0, totalsCol ? SHEET_DEFAULTS.totalsLabel : undefined);
        const tbody = document.createElement("tbody");
        for (let r = 0; r < numRows; r++) {
            const tr = el("tr", "row");
            for (let c = 0; c < numCols; c++) {
                const isLabel = c === 0;
                const td = el("td", isLabel ? "pivot-label" : "cell");
                if (!isLabel) td.setAttribute("data-align", columns[c]?.align ?? "right");
                fillCell(td, evaluated[r]?.[c], columns[c], evaluated, c, statusOverrides);
                tr.appendChild(td);
            }
            if (totalsCol) {
                let sum = 0;
                for (let c = 1; c < numCols; c++) if (typeof evaluated[r]?.[c] === "number") sum += evaluated[r][c];
                const td = el("td", "total-cell", formatValue(sum, columns[1]));
                td.setAttribute("data-align", "right");
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        if (totalsRow) {
            const tfoot = document.createElement("tfoot");
            const tr = el("tr", "totals-row");
            const totals = columnTotals(evaluated, numCols);
            for (let c = 0; c < numCols; c++) {
                const td = el("td", "total-cell", c === 0 ? SHEET_DEFAULTS.totalsLabel : (totals[c] != null ? formatValue(totals[c], columns[c]) : ""));
                if (c > 0) td.setAttribute("data-align", "right");
                tr.appendChild(td);
            }
            if (totalsCol) {
                const grand = totals.slice(1).reduce<number>((a, t) => a + (t ?? 0), 0);
                const td = el("td", "total-cell", formatValue(grand, columns[1]));
                td.setAttribute("data-align", "right");
                tr.appendChild(td);
            }
            tfoot.appendChild(tr);
            table.appendChild(tfoot);
        }
        return table;
    }

    function renderRows(table: HTMLElement) {
        const tbody = document.createElement("tbody");
        for (let r = 0; r < numRows; r++) {
            const tr = el("tr", "row");
            if (r < frozenRows) tr.setAttribute("data-frozen", "true");
            if (rowNumbers) tr.appendChild(el("td", "row-number", String(r + 1)));
            for (let c = 0; c < numCols; c++) {
                const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
                const isEditing = editingCell?.[0] === r && editingCell?.[1] === c;
                const hl = highlights.find((h) => h.row === r && h.col === c);
                const val = getCellValue(r, c);
                const col = columns[c];
                const align = col?.align ?? (typeof val === "number" ? "right" : "left");

                const td = el("td", "cell");
                if (isSelected) td.setAttribute("data-selected", "true");
                if (c < frozenCols) td.setAttribute("data-frozen", "true");
                td.setAttribute("data-align", align);
                if (col?.format) td.setAttribute("data-format", col.format);
                if (hl) {
                    td.setAttribute("data-highlight", "true");
                    if (hl.accent) td.setAttribute("data-highlight-accent", hl.accent);
                }
                td.onclick = () => handleCellClick(r, c);
                td.ondblclick = () => handleCellDoubleClick(r, c);

                if (isEditing) {
                    const input = document.createElement("input");
                    input.setAttribute("data-role", "cell-input");
                    input.value = editValue;
                    input.oninput = () => { editValue = input.value; };
                    input.onkeydown = (e) => {
                        if (e.key === "Enter") commitEdit();
                        if (e.key === "Escape") cancelEdit();
                        if (e.key === "Tab") { e.preventDefault(); commitEdit(); }
                    };
                    input.onblur = () => commitEdit();
                    td.appendChild(input);
                    queueMicrotask(() => input.focus());
                } else {
                    fillCell(td, val, col, evaluated, c, statusOverrides);
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        if (totalsRow) {
            const tfoot = document.createElement("tfoot");
            const tr = el("tr", "totals-row");
            if (rowNumbers) tr.appendChild(el("td", "row-number"));
            const totals = columnTotals(evaluated, numCols);
            for (let c = 0; c < numCols; c++) {
                const td = el("td", "total-cell", c === 0 && totals[c] == null ? SHEET_DEFAULTS.totalsLabel : (totals[c] != null ? formatValue(totals[c], columns[c]) : (c === 0 ? SHEET_DEFAULTS.totalsLabel : "")));
                td.setAttribute("data-align", columns[c]?.align ?? (totals[c] != null ? "right" : "left"));
                tr.appendChild(td);
            }
            tfoot.appendChild(tr);
            table.appendChild(tfoot);
        }
    }

    function render() {
        root.replaceChildren();

        if (formulaBar) {
            const bar = el("div", "formula-bar");
            const ref = el("span", "cell-ref",
                selectedCell ? `${colLabel(selectedCell[1])}${selectedCell[0] + 1}` : "");
            const selectedRaw = selectedCell ? getRawValue(selectedCell[0], selectedCell[1]) : null;
            const formula = el("span", "formula-text", selectedRaw != null ? String(selectedRaw) : "");
            bar.append(ref, formula);
            root.appendChild(bar);
        }

        const scroll = el("div", "scroll");
        scroll.style.overflow = "auto";

        let table: HTMLElement;
        if (variant === "skeleton") table = renderSkeleton();
        else if (variant === "empty") table = renderEmpty();
        else if (variant === "key-value") table = renderKeyValue();
        else if (variant === "grouped") table = renderGrouped();
        else if (variant === "pivot") table = renderPivot();
        else {
            table = el("table", "grid");
            if (columnHeaders) renderHeaderRow(table, numCols);
            renderRows(table);
        }

        scroll.appendChild(table);
        root.appendChild(scroll);
    }
    render();

    container.appendChild(root);
    return root;
}

export function initSafeSheets(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-sheet-config]").forEach((host) => {
        if (host.dataset.sheetMounted) return;
        host.dataset.sheetMounted = "1";
        const config = JSON.parse(host.dataset.sheetConfig!) as ConfigBase;
        createSafeSheet(host, config);
    });
}
