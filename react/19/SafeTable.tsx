import { useState, useEffect, useMemo, useCallback } from "react";
import { fireTable } from "../../builders/emit";
import type { TableEvent } from "../../builders/emit";
import { getDataSource } from "safecontracts";
import type { ConfigBase, OnSafeEvent, Field } from "safecontracts";
import { findHandlers } from "safecontracts";
import { fmtDate, fmtCurrency, fmtInt, fmtPercent, fmtStr } from "safecontracts";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface SafeTableProps {
  config: ConfigBase;
  data: Record<string, any>[];
  onEvent?: OnSafeEvent;
}

type SortDir = "asc" | "desc";

interface SortState {
  field: string;
  dir: SortDir;
}

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

export function SafeTable({ config, data, onEvent }: SafeTableProps) {
  const { metadata } = config;
  const schema = getDataSource(config)?.schema;
  const fields = (schema?.fields ?? []).filter((f) => f.visible !== false);

  const [sort, setSort] = useState<SortState>(() => ({
    field: metadata.defaultSort ?? "",
    dir: metadata.defaultSortDir ?? "asc",
  }));

  const pageSize = metadata.pageSize ?? 0;
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());

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
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [localOrder, setLocalOrder] = useState<Record<string, any>[] | null>(null);

  const dataKey = useMemo(() => JSON.stringify(data.map(r => r.Id ?? r.id)), [data]);
  useEffect(() => { setLocalOrder(null); }, [dataKey]);

  const fire = useCallback(
    (eventName: string, payload: any) => {
      if (onEvent) fireTable(onEvent, eventName as TableEvent, payload);
    },
    [onEvent],
  );

  const handleSort = useCallback(
    (field: Field) => {
      if (!field.sortable) return;
      const dir: SortDir =
        sort.field === field.name && sort.dir === "asc" ? "desc" : "asc";
      setSort({ field: field.name, dir });
      setPage(0);
      fire("sort", { field: field.name, dir });
    },
    [sort, fire],
  );

  const sorted = useMemo(() => {
    const source = localOrder ?? data;
    if (!sort.field) return source;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...source].sort((a, b) => {
      const av = a[sort.field];
      const bv = b[sort.field];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number")
        return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [data, sort]);

  const paged = useMemo(() => {
    if (!pageSize) return sorted;
    const start = page * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const totalPages = pageSize ? Math.ceil(sorted.length / pageSize) : 1;

  const handleRowClick = useCallback(
    (row: Record<string, any>, index: number) => {
      fire("row:click", { row, index });
    },
    [fire],
  );

  const handleRowSelect = useCallback(
    (id: string) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        fire("row:select", { selected: [...next] });
        return next;
      });
    },
    [fire],
  );

  const handleSelectAll = useCallback(() => {
    if (selected.size === paged.length) {
      setSelected(new Set());
      fire("row:select", { selected: [] });
    } else {
      const all = new Set(paged.map((r) => r.Id ?? r.id ?? String(r)));
      setSelected(all);
      fire("row:select", { selected: [...all] });
    }
  }, [paged, selected, fire]);

  const summaryRow = useMemo(() => {
    if (!footerSummary) return null;
    const row: Record<string, any> = {};
    for (const field of fields) {
      if (field.type === "currency" || field.type === "number") {
        row[field.name] = sorted.reduce((acc, r) => acc + (Number(r[field.name]) || 0), 0);
      } else if (field.type === "percent") {
        row[field.name] = Math.round(sorted.reduce((acc, r) => acc + (Number(r[field.name]) || 0), 0) / (sorted.length || 1) * 10) / 10;
      } else {
        row[field.name] = "";
      }
    }
    return row;
  }, [footerSummary, sorted, fields]);

  if (data.length === 0) {
    return (
      <div data-component="table" data-role="empty">
        {metadata.emptyMessage ?? "No results"}
      </div>
    );
  }

  return (
    <div
      data-component="table"
      data-variant={variant}
      data-spacing={spacing}
      data-header-style={headerStyle}
      data-row-divider={rowDivider}
      data-header-divider={headerDivider}
      data-hover={hoverStyle}
      data-zebra={zebra}
      data-sticky={stickyHeader || undefined}
      data-row-numbers={rowNumbers || undefined}
      data-truncate={truncate || undefined}
      data-column-lines={columnLines || undefined}
      data-selectable={selectable || undefined}
      data-footer={footerSummary || undefined}
    >
      <div data-role="scroll">
        <table data-role="table">
          <thead data-role="thead">
            <tr data-role="header-row">
              {reorderable && <th data-role="drag-handle-header" style={{ width: 28 }}></th>}
              {rowNumbers && (
                <th data-role="row-number-header">#</th>
              )}
              {selectable && (
                <th data-role="select-header">
                  <input
                    type="checkbox"
                    checked={selected.size === paged.length && paged.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {fields.map((field) => (
                <th
                  key={field.name}
                  data-role="column-header"
                  data-sortable={field.sortable || undefined}
                  data-sorted={sort.field === field.name ? sort.dir : undefined}
                  data-align={numericType(field.type) ? "right" : undefined}
                  style={field.width ? { width: field.width } : undefined}
                  onClick={() => handleSort(field)}
                >
                  {field.label}
                  {sort.field === field.name && (
                    <span data-role="sort-indicator">
                      {sort.dir === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody data-role="tbody">
            {paged.map((row, rowIndex) => {
              const rowId = row.Id ?? row.id ?? String(rowIndex);
              const hasClickHandler = true;
              const globalIndex = pageSize ? page * pageSize + rowIndex : rowIndex;
              return (
                <tr
                  key={rowId}
                  data-role="row"
                  data-selected={selected.has(rowId) || undefined}
                  data-clickable={hasClickHandler || undefined}
                  data-index={globalIndex}
                  data-dragging={reorderable && dragIdx === rowIndex || undefined}
                  data-drag-over={reorderable && dragOverIdx === rowIndex || undefined}
                  draggable={reorderable}
                  onDragStart={reorderable ? (e) => {
                    setDragIdx(rowIndex);
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", String(rowIndex));
                  } : undefined}
                  onDragOver={reorderable ? (e) => {
                    e.preventDefault();
                    setDragOverIdx(rowIndex);
                  } : undefined}
                  onDragLeave={reorderable ? () => setDragOverIdx(null) : undefined}
                  onDrop={reorderable ? (e) => {
                    e.preventDefault();
                    if (dragIdx !== null && dragIdx !== rowIndex) {
                      const newOrder = [...paged];
                      const [moved] = newOrder.splice(dragIdx, 1);
                      newOrder.splice(rowIndex, 0, moved);
                      setLocalOrder(newOrder);
                      fire("reorder", { order: newOrder.map((r, i) => ({ id: r.Id ?? r.id, index: i })) });
                    }
                    setDragIdx(null);
                    setDragOverIdx(null);
                  } : undefined}
                  onDragEnd={reorderable ? () => { setDragIdx(null); setDragOverIdx(null); } : undefined}
                  onClick={(e) => { if (reorderable && dragIdx !== null) { e.stopPropagation(); return; } handleRowClick(row, globalIndex); }}
                >
                  {reorderable && (
                    <td data-role="drag-handle" style={{ cursor: "grab", textAlign: "center", color: "var(--sd-text-dim, #999)", userSelect: "none" }}>⠿</td>
                  )}
                  {rowNumbers && (
                    <td data-role="row-number">{globalIndex + 1}</td>
                  )}
                  {selectable && (
                    <td
                      data-role="select-cell"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowSelect(rowId);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(rowId)}
                        onChange={() => handleRowSelect(rowId)}
                      />
                    </td>
                  )}
                  {fields.map((field) => (
                    <td
                      key={field.name}
                      data-role="cell"
                      data-type={field.type}
                      data-align={numericType(field.type) ? "right" : undefined}
                    >
                      {formatValue(row[field.name], field)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          {summaryRow && (
            <tfoot data-role="tfoot">
              <tr data-role="summary-row">
                {rowNumbers && <td data-role="row-number">Σ</td>}
                {selectable && <td data-role="select-cell" />}
                {fields.map((field, fi) => (
                  <td
                    key={field.name}
                    data-role="summary-cell"
                    data-type={field.type}
                    data-align={numericType(field.type) ? "right" : undefined}
                  >
                    {fi === 0 && !numericType(field.type)
                      ? `${sorted.length} rows`
                      : summaryRow[field.name] !== ""
                        ? formatValue(summaryRow[field.name], field)
                        : ""}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {pageSize > 0 && totalPages > 1 && (
        <div data-role="pagination">
          <span data-role="page-info">
            {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} of{" "}
            {sorted.length}
          </span>
          <div data-role="page-controls">
            <button
              data-role="page-prev"
              data-disabled={page === 0 || undefined}
              disabled={page === 0}
              onClick={() => {
                setPage((p) => p - 1);
                fire("page", { page: page - 1 });
              }}
            >
              ← Prev
            </button>
            <button
              data-role="page-next"
              data-disabled={page >= totalPages - 1 || undefined}
              disabled={page >= totalPages - 1}
              onClick={() => {
                setPage((p) => p + 1);
                fire("page", { page: page + 1 });
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}