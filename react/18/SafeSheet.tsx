/**
 * SafeSheet — config-driven spreadsheet with HyperFormula calc engine.
 *
 * Renders via data-attributes. Zero Tailwind.
 * Cell data is a 2D array from the datasource.
 * Formulas (strings starting with =) are evaluated by HyperFormula.
 */
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { HyperFormula } from "hyperformula";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeEvent } from "safecontracts";
import type { SheetColumn } from "safecontracts/components/sheet";

export interface SafeSheetProps {
  config: ConfigBase;
  data: any[][];
  onEvent?: OnSafeEvent;
}

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

export function SafeSheet({ config, data, onEvent }: SafeSheetProps) {
  const { metadata } = config;
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

  // Build HyperFormula instance
  const hf = useMemo(() => {
    const instance = HyperFormula.buildFromArray(data, { licenseKey: "gpl-v3" });
    return instance;
  }, [data]);

  // Evaluated values
  const evaluated = useMemo(() => {
    const rows = hf.getSheetDimensions(0);
    const result: any[][] = [];
    for (let r = 0; r < rows.height; r++) {
      const row: any[] = [];
      for (let c = 0; c < rows.width; c++) {
        row.push(hf.getCellValue({ sheet: 0, row: r, col: c }));
      }
      result.push(row);
    }
    return result;
  }, [hf]);

  const numCols = evaluated[0]?.length ?? 0;
  const numRows = evaluated.length;

  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [editingCell, setEditingCell] = useState<[number, number] | null>(null);
  const [editValue, setEditValue] = useState("");
  const [cellOverrides, setCellOverrides] = useState<Record<string, any>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCell && inputRef.current) inputRef.current.focus();
  }, [editingCell]);

  const getCellValue = useCallback((r: number, c: number) => {
    const key = `${r}:${c}`;
    if (key in cellOverrides) return cellOverrides[key];
    return evaluated[r]?.[c];
  }, [evaluated, cellOverrides]);

  const getRawValue = useCallback((r: number, c: number) => {
    return data[r]?.[c];
  }, [data]);

  const handleCellClick = useCallback((r: number, c: number) => {
    setSelectedCell([r, c]);
    onEvent?.(createSafeEvent("sheet", "select", { row: r, col: c, value: getCellValue(r, c) }));
  }, [getCellValue, onEvent]);

  const handleCellDoubleClick = useCallback((r: number, c: number) => {
    if (!editable) return;
    setEditingCell([r, c]);
    const raw = getRawValue(r, c);
    setEditValue(raw != null ? String(raw) : "");
  }, [editable, getRawValue]);

  const commitEdit = useCallback(() => {
    if (!editingCell) return;
    const [r, c] = editingCell;
    const val = editValue.startsWith("=") ? editValue : (isNaN(Number(editValue)) ? editValue : Number(editValue));
    try {
      hf.setCellContents({ sheet: 0, row: r, col: c }, val);
      // Re-evaluate all
      const rows = hf.getSheetDimensions(0);
      const newOverrides: Record<string, any> = {};
      for (let ri = 0; ri < rows.height; ri++) {
        for (let ci = 0; ci < rows.width; ci++) {
          const v = hf.getCellValue({ sheet: 0, row: ri, col: ci });
          if (v !== evaluated[ri]?.[ci]) newOverrides[`${ri}:${ci}`] = v;
        }
      }
      setCellOverrides(newOverrides);
    } catch {}
    setEditingCell(null);
    onEvent?.(createSafeEvent("sheet", "edit", { row: r, col: c, value: val }));
  }, [editingCell, editValue, hf, evaluated, onEvent]);

  const cancelEdit = useCallback(() => {
    setEditingCell(null);
  }, []);

  const selectedRaw = selectedCell ? getRawValue(selectedCell[0], selectedCell[1]) : null;

  return (
    <div data-component="sheet" data-variant={variant} data-surface={surface} data-spacing={spacing}>
      {/* Formula bar */}
      {formulaBar && (
        <div data-role="formula-bar">
          <span data-role="cell-ref">
            {selectedCell ? `${colLabel(selectedCell[1])}${selectedCell[0] + 1}` : ""}
          </span>
          <span data-role="formula-text">
            {selectedRaw != null ? String(selectedRaw) : ""}
          </span>
        </div>
      )}
      {/* Grid */}
      <div data-role="scroll" style={{ overflow: "auto" }}>
        <table data-role="grid">
          {/* Column headers */}
          {columnHeaders && (
            <thead>
              <tr data-role="header-row">
                {rowNumbers && <th data-role="corner" />}
                {Array.from({ length: numCols }, (_, c) => (
                  <th
                    key={c}
                    data-role="col-header"
                    data-frozen={c < frozenCols || undefined}
                    style={columns[c]?.width ? { width: columns[c].width } : undefined}
                  >
                    {columns[c]?.label ?? colLabel(c)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {Array.from({ length: numRows }, (_, r) => (
              <tr key={r} data-role="row" data-frozen={r < frozenRows || undefined}>
                {rowNumbers && <td data-role="row-number">{r + 1}</td>}
                {Array.from({ length: numCols }, (_, c) => {
                  const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
                  const isEditing = editingCell?.[0] === r && editingCell?.[1] === c;
                  const hl = highlights.find(h => h.row === r && h.col === c);
                  const val = getCellValue(r, c);
                  const col = columns[c];
                  const align = col?.align ?? (typeof val === "number" ? "right" : "left");

                  return (
                    <td
                      key={c}
                      data-role="cell"
                      data-selected={isSelected || undefined}
                      data-frozen={c < frozenCols || undefined}
                      data-align={align}
                      data-format={col?.format}
                      data-highlight={hl ? true : undefined}
                      data-highlight-accent={hl?.accent || undefined}
                      onClick={() => handleCellClick(r, c)}
                      onDoubleClick={() => handleCellDoubleClick(r, c)}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          data-role="cell-input"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitEdit();
                            if (e.key === "Escape") cancelEdit();
                            if (e.key === "Tab") { e.preventDefault(); commitEdit(); }
                          }}
                          onBlur={commitEdit}
                        />
                      ) : (
                        formatValue(val, col)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}