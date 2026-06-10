/**
 * Sheet builder for this renderer's SafeSheet — spreadsheet with
 * HyperFormula calc engine.
 *
 * Framework-agnostic DOM port of the react SafeSheet implementation:
 * cell selection, double-click editing, formula bar, frozen rows/cols,
 * highlights. Formulas (strings starting with =) are evaluated by
 * HyperFormula.
 *
 * Structure + data-* attributes ONLY — paint lives in safestyles.
 * Same data-role markup as the react JSX implementation, so one stylesheet
 * covers both. Events: "select" (cell click), "edit" (commit edit).
 */
import { HyperFormula } from "hyperformula";
import type { ConfigBase, OnSafeEvent } from "../../../safecontracts/src/contracts";
import { createSafeEvent } from "../../../safecontracts/src/contracts";
import type { SheetColumn } from "../../../safecontracts/src/components/sheet";

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

/** Build the sheet into a container. Returns the root for removal. */
export function createSafeSheet(container: HTMLElement, config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
    const metadata = config.metadata;
    const variant = (metadata.variant as string) ?? "default";
    const surface = (metadata.surface as string) ?? "base";
    const spacing = (metadata.spacing as string) ?? "normal";
    const columns = (metadata.columns as SheetColumn[]) ?? [];
    const frozenRows = (metadata.frozenRows as number) ?? 0;
    const frozenCols = (metadata.frozenCols as number) ?? 0;
    const rowNumbers = metadata.rowNumbers !== false;
    const columnHeaders = metadata.columnHeaders !== false;
    const editable = metadata.editable !== false;
    const formulaBar = !!metadata.formulaBar;
    const highlights = (metadata.highlights as { row: number; col: number; accent: string }[]) ?? [];

    // Self-extract 2D cell data from the first datasource
    const ds = Object.values(config.data ?? {})[0];
    const raw = ds?.inline;
    const data: any[][] = Array.isArray(raw) ? (raw as any[][]) : [];

    // Build HyperFormula instance
    const hf = HyperFormula.buildFromArray(data, { licenseKey: "gpl-v3" });

    // Initial evaluation snapshot
    const dims = hf.getSheetDimensions(0);
    const evaluated: any[][] = [];
    for (let r = 0; r < dims.height; r++) {
        const row: any[] = [];
        for (let c = 0; c < dims.width; c++) {
            row.push(hf.getCellValue({ sheet: 0, row: r, col: c }));
        }
        evaluated.push(row);
    }

    const numCols = evaluated[0]?.length ?? 0;
    const numRows = evaluated.length;

    // Internal state (react useState equivalents)
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
        onEvent?.(createSafeEvent("sheet", "select", { row: r, col: c, value: getCellValue(r, c) }));
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
            // Re-evaluate all
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
        onEvent?.(createSafeEvent("sheet", "edit", { row: r, col: c, value: val }));
        render();
    };

    const cancelEdit = () => {
        editingCell = null;
        render();
    };

    function render() {
        root.replaceChildren();

        // Formula bar
        if (formulaBar) {
            const bar = el("div", "formula-bar");
            const ref = el("span", "cell-ref",
                selectedCell ? `${colLabel(selectedCell[1])}${selectedCell[0] + 1}` : "");
            const selectedRaw = selectedCell ? getRawValue(selectedCell[0], selectedCell[1]) : null;
            const formula = el("span", "formula-text", selectedRaw != null ? String(selectedRaw) : "");
            bar.append(ref, formula);
            root.appendChild(bar);
        }

        // Grid
        const scroll = el("div", "scroll");
        scroll.style.overflow = "auto";
        const table = el("table", "grid");

        if (columnHeaders) {
            const thead = document.createElement("thead");
            const headerRow = el("tr", "header-row");
            if (rowNumbers) headerRow.appendChild(el("th", "corner"));
            for (let c = 0; c < numCols; c++) {
                const th = el("th", "col-header", columns[c]?.label ?? colLabel(c));
                if (c < frozenCols) th.setAttribute("data-frozen", "true");
                if (columns[c]?.width) th.style.width = `${columns[c].width}px`;
                headerRow.appendChild(th);
            }
            thead.appendChild(headerRow);
            table.appendChild(thead);
        }

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
                    td.textContent = formatValue(val, col);
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        scroll.appendChild(table);
        root.appendChild(scroll);
    }
    render();

    container.appendChild(root);
    return root;
}

/**
 * Scan-and-mount for server-rendered hosts (Astro): build a sheet in every
 * div[data-sheet-config] not yet mounted.
 */
export function initSafeSheets(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-sheet-config]").forEach((host) => {
        if (host.dataset.sheetMounted) return;
        host.dataset.sheetMounted = "1";
        const config = JSON.parse(host.dataset.sheetConfig!) as ConfigBase;
        createSafeSheet(host, config);
    });
}
