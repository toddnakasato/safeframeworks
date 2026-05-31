import { useState, useMemo, useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecomponents";
import { createSafeEvent } from "safecomponents";
import type { RowCell, RowDef } from "safecomponents";
import { useRenderLog, type RenderLogFn } from "./hooks/useRenderLog";

export interface SafePickerProps {
  config: ConfigBase;
  data: Record<string, any>[];
  loading?: boolean;
  error?: string | null;
  onEvent?: OnSafeEvent;
  onRenderLog?: RenderLogFn;
}

export function SafePicker({ config, data, loading, error, onEvent, onRenderLog }: SafePickerProps) {
  const { metadata } = config;
  const [search, setSearch] = useState("");
  const isCardGrid = metadata.variant === "card-grid";

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const firstRowRef = useRef<HTMLLIElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLSelectElement>(null);
  const [filteredCount, setFilteredCount] = useState(data.length);

  const renderRef = useRenderLog(onRenderLog, {
    component: "picker",
    variant: metadata.variant ?? "default",
    data_count: filteredCount,
    subRefs: isCardGrid
      ? { "filter-dropdown": filterRef as any, "search-input": inputRef as any, "grid": gridRef as any, "card-sample": firstCardRef as any }
      : { "filter-dropdown": filterRef as any, "search-input": inputRef as any, "list": listRef as any, "row-sample": firstRowRef as any },
  });

  const accent = (metadata.accent as string) ?? "brand";
  const spacing = (metadata.spacing as string) ?? "normal";
  const surface = (metadata.surface as string) ?? "base";
  const radius = (metadata.radius as string) ?? "md";
  const searchFields = metadata.searchFields ?? [metadata.labelField, metadata.subtitleField].filter(Boolean) as string[];

  const filterField = metadata.filterField as string | undefined;
  const filterValue = (metadata.filterValue as string) ?? "";
  const filterOptions = useMemo(() => {
    if (!filterField) return [];
    const vals = new Set<string>();
    for (const row of data) {
      const v = row[filterField];
      if (v != null && String(v).trim()) vals.add(String(v));
    }
    return Array.from(vals).sort();
  }, [data, filterField]);

  const filtered = useMemo(() => {
    let result = data;
    if (filterField && filterValue) {
      result = result.filter((row) => String(row[filterField] ?? "") === filterValue);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        searchFields.some((f: string) => {
          const v = row[f];
          return v != null && String(v).toLowerCase().includes(q);
        }),
      );
    }
    return result;
  }, [data, search, searchFields, filterField, filterValue]);

  useEffect(() => { setFilteredCount(filtered.length); }, [filtered.length]);

  const renderCell = (cell: RowCell, row: Record<string, any>, ci: number) => {
    if (cell.text) {
      return <div key={ci} data-style={cell.style} data-align={cell.align}>{cell.text}</div>;
    }
    const val = row[cell.field];
    if (val == null || String(val).trim() === "") return null;
    return <div key={ci} data-style={cell.style} data-align={cell.align} data-field={cell.field}>{String(val)}</div>;
  };

  const rows: RowDef[] = (metadata.rows as RowDef[]) ?? [];
  if (rows.length === 0) {
    const schema = config.data?.[0]?.schema;
    if (schema?.fields) {
      const f = schema.fields.filter(f => f.visible !== false);
      if (f.length >= 2) rows.push([{ field: f[0].name, style: "label" }, { field: f[1].name, align: "end", style: "badge" }]);
      else if (f.length === 1) rows.push([{ field: f[0].name, style: "label" }]);
      if (f.length >= 3) rows.push([{ field: f[2].name, style: "subtitle" }]);
    }
  }
  const maxWidth = metadata.maxWidth ?? undefined;

  const filterDropdown = filterField && filterOptions.length > 0 ? (
    <select
      ref={filterRef}
      data-role="filter"
      data-accent={accent}
      data-radius={radius}
      value={filterValue}
      onChange={(e) => onEvent?.(createSafeEvent("picker", "filter", { field: filterField, value: e.target.value }))}
    >
      <option value="">{metadata.filterLabel ?? "All"}</option>
      {filterOptions.map((v) => <option key={v} value={v}>{v}</option>)}
    </select>
  ) : null;

  const showSearch = metadata.showSearch !== false;
  const searchInput = showSearch ? (
    <form data-role="search-form" onSubmit={(e) => e.preventDefault()}>
      {filterDropdown}
      <input
        ref={inputRef}
        data-role="search-input"
        data-surface={surface}
        data-accent={accent}
        data-radius={radius}
        data-spacing={spacing}
        placeholder={metadata.placeholder ?? "Search…"}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />
    </form>
  ) : null;

  const emptyMsg = search ? (metadata.noMatchMessage ?? "No matches.") : (metadata.emptyMessage ?? "No results");

  if (isCardGrid) {
    const cardMin = metadata.cardMinWidth ?? "220px";
    return (
      <div ref={renderRef} data-component="picker" data-variant="card-grid" data-surface={surface} data-accent={accent} data-spacing={spacing} data-radius={radius} style={maxWidth ? { maxWidth } : undefined}>
        {metadata.title && <div data-role="title">{metadata.title}</div>}
        {searchInput}
        <div ref={gridRef} data-role="grid" style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${cardMin}, 1fr))`, gap: "10px", alignContent: "start" }}>
          {filtered.map((row, i) => {
            const id = row.Id ?? row.id ?? String(i);
            return (
              <div key={id} ref={i === 0 ? firstCardRef : undefined} data-role="card" data-surface="raised" data-radius={radius} onClick={() => onEvent?.(createSafeEvent("picker", "select", { row, index: i }))}>
                {rows.map((rowDef: RowDef, ri: number) => (
                  <div key={ri} data-role="row" data-cells={rowDef.length}>
                    {rowDef.map((cell: RowCell, ci: number) => renderCell(cell, row, ci))}
                  </div>
                ))}
              </div>
            );
          })}
          {filtered.length === 0 && <div data-role="empty">{emptyMsg}</div>}
        </div>
        {loading && <div data-role="loading">Opening…</div>}
        {error && <div data-role="error">{error}</div>}
      </div>
    );
  }

  return (
    <div ref={renderRef} data-component="picker" data-variant={metadata.variant ?? "default"} data-surface={surface} data-accent={accent} data-spacing={spacing} data-radius={radius} style={maxWidth ? { maxWidth } : undefined}>
      {metadata.title && <div data-role="title">{metadata.title}</div>}
      {searchInput}
      <ul ref={listRef} data-role="list" data-surface={surface} data-radius={radius}>
        {filtered.map((row, i) => {
          const id = row.Id ?? row.id ?? String(i);
          return (
            <li key={id} ref={i === 0 ? firstRowRef : undefined} data-role="list-item" data-spacing={spacing} onClick={() => onEvent?.(createSafeEvent("picker", "select", { row, index: i }))}>
              {rows.map((rowDef: RowDef, ri: number) => (
                <div key={ri} data-role="row" data-cells={rowDef.length}>
                  {rowDef.map((cell: RowCell, ci: number) => renderCell(cell, row, ci))}
                </div>
              ))}
            </li>
          );
        })}
        {filtered.length === 0 && <li data-role="empty">{emptyMsg}</li>}
      </ul>
      {loading && <div data-role="loading">Opening…</div>}
      {error && <div data-role="error">{error}</div>}
    </div>
  );
}