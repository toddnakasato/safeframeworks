/**
 * SafeList — flexible collection of items, horizontal or vertical.
 * From figma "Atom List Specs" (finAtomList). Data-attributes for host CSS.
 *
 * Variants: simple, icon, selection, columns, files, actions, hierarchy,
 * property-grid, gantt.
 * Events: select, toggle (selection), expand (hierarchy/property groups),
 * action (action buttons), page (pagination), change (property edits),
 * navigate (gantt date window).
 */
import { useState } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeEvent } from "safecontracts";
import * as Icons from "lucide-react";

export interface SafeListProps {
  config: ConfigBase;
  data?: any[];
  onEvent?: OnSafeEvent;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function IconGlyph({ name, size = 16 }: { name?: string; size?: number }) {
  if (!name) return null;
  const pascal = name.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
  const Cmp = (Icons as unknown as Record<string, React.ComponentType<{ size?: number }>>)[pascal];
  if (Cmp) return <Cmp size={size} />;
  return <>{name}</>;
}

function fieldOf(meta: Record<string, unknown>, key: string, fallback: string): string {
  return (meta[key] as string) ?? fallback;
}

/** Intent tokens from metadata -> data-* attributes. Paint lives in safestyles. */
function intentAttrs(meta: Record<string, unknown>): Record<string, string | undefined> {
  return {
    "data-accent": meta.accent as string | undefined,
    "data-surface": meta.surface as string | undefined,
    "data-spacing": meta.spacing as string | undefined,
    "data-density": meta.density as string | undefined,
    "data-radius": meta.radius as string | undefined,
  };
}

/* ------------------------------------------------------------------ */
/*  Pagination bar (figma: numbered links + prev/next)                 */
/* ------------------------------------------------------------------ */

function Pager({
  page, totalPages, numbers, onPage,
}: { page: number; totalPages: number; numbers: boolean; onPage: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div data-role="list-pager">
      <button data-role="pager-btn" data-dir="prev" disabled={page <= 1} data-disabled={page <= 1 || undefined}
        onClick={() => onPage(page - 1)}>‹ Previous</button>
      {numbers
        ? Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} data-role="pager-num" data-active={p === page || undefined} onClick={() => onPage(p)}>
              {p}
            </button>
          ))
        : <span data-role="pager-info">{page} / {totalPages}</span>}
      <button data-role="pager-btn" data-dir="next" disabled={page >= totalPages} data-disabled={page >= totalPages || undefined}
        onClick={() => onPage(page + 1)}>Next ›</button>
    </div>
  );
}

function usePager(count: number, pageSize: number, onEvent?: OnSafeEvent) {
  const [page, setPage] = useState(1);
  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(count / pageSize)) : 1;
  const clamped = Math.min(page, totalPages);
  const slice = <T,>(items: T[]): T[] =>
    pageSize > 0 ? items.slice((clamped - 1) * pageSize, clamped * pageSize) : items;
  const go = (p: number) => {
    const next = Math.max(1, Math.min(totalPages, p));
    setPage(next);
    onEvent?.(createSafeEvent("list", "page", { page: next, totalPages }));
  };
  return { page: clamped, totalPages, slice, go };
}

/* ------------------------------------------------------------------ */
/*  Variants                                                           */
/* ------------------------------------------------------------------ */

function SimpleList({ config, data, onEvent }: { config: ConfigBase; data: any[]; onEvent?: OnSafeEvent }) {
  const meta = config.metadata;
  const direction = (meta.direction as string) ?? "vertical";
  const labelField = fieldOf(meta, "labelField", "label");
  const iconField = fieldOf(meta, "iconField", "icon");
  const descriptionField = fieldOf(meta, "descriptionField", "description");
  const withIcons = (meta.variant as string) === "icon";
  const pageSize = (meta.pageSize as number) ?? 0;
  const numbers = meta.pageNumbers !== false;
  const { page, totalPages, slice, go } = usePager(data.length, pageSize, onEvent);

  return (
    <div data-component="list" data-variant={withIcons ? "icon" : "simple"} data-direction={direction} {...intentAttrs(meta)}>
      <div data-role="list-items">
        {slice(data).map((item, i) => {
          const label = typeof item === "string" ? item : item[labelField];
          const description = typeof item === "object" ? item[descriptionField] : undefined;
          const icon = typeof item === "object" ? item[iconField] : undefined;
          return (
            <div key={i} data-role="list-item" tabIndex={0} role="listitem"
              onClick={() => onEvent?.(createSafeEvent("list", "select", { index: i, label, item }))}>
              {withIcons && icon && <span data-role="item-icon"><IconGlyph name={icon} /></span>}
              <span data-role="item-body">
                <span data-role="item-label">{label}</span>
                {description && <span data-role="item-description">{description}</span>}
              </span>
            </div>
          );
        })}
      </div>
      <Pager page={page} totalPages={totalPages} numbers={numbers} onPage={go} />
    </div>
  );
}

function SelectionList({ config, data, onEvent }: { config: ConfigBase; data: any[]; onEvent?: OnSafeEvent }) {
  const meta = config.metadata;
  const mode = (meta.selectionMode as string) ?? "single";
  const labelField = fieldOf(meta, "labelField", "label");
  const descriptionField = fieldOf(meta, "descriptionField", "description");
  const [single, setSingle] = useState<number | null>(null);
  const [multi, setMulti] = useState<Set<number>>(new Set());

  const toggle = (i: number, item: any) => {
    if (mode === "single") {
      setSingle(i);
      onEvent?.(createSafeEvent("list", "select", { index: i, item }));
    } else {
      setMulti((prev) => {
        const next = new Set(prev);
        if (next.has(i)) next.delete(i); else next.add(i);
        onEvent?.(createSafeEvent("list", "toggle", { index: i, selected: next.has(i), item }));
        return next;
      });
    }
  };

  const isSelected = (i: number) => (mode === "single" ? single === i : multi.has(i));

  return (
    <div data-component="list" data-variant="selection" data-selection-mode={mode} {...intentAttrs(meta)}>
      <div data-role="list-items">
        {data.map((item, i) => (
          <div key={i} data-role="list-item" data-selected={isSelected(i) || undefined} tabIndex={0}
            role={mode === "single" ? "radio" : "checkbox"} aria-checked={isSelected(i)}
            onClick={() => toggle(i, item)}>
            <span data-role="item-control" data-checked={isSelected(i) || undefined}>
              {mode === "multiple" && isSelected(i) ? "✓" : undefined}
            </span>
            <span data-role="item-body">
              <span data-role="item-label">{item[labelField]}</span>
              {item[descriptionField] && <span data-role="item-description">{item[descriptionField]}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ColumnsList({ config, data, onEvent }: { config: ConfigBase; data: any[]; onEvent?: OnSafeEvent }) {
  const meta = config.metadata;
  const schema = Object.values(config.data ?? {})[0]?.schema;
  const fields = schema?.fields ?? [];
  const pageSize = (meta.pageSize as number) ?? 0;
  const numbers = meta.pageNumbers !== false;
  const { page, totalPages, slice, go } = usePager(data.length, pageSize, onEvent);

  return (
    <div data-component="list" data-variant="columns" {...intentAttrs(meta)}>
      <div data-role="list-header" style={{ gridTemplateColumns: `repeat(${fields.length}, 1fr)` }}>
        {fields.map((f: any) => (
          <span key={f.name} data-role="header-cell">{f.label ?? f.name}</span>
        ))}
      </div>
      <div data-role="list-items">
        {slice(data).map((item, i) => (
          <div key={i} data-role="list-item" style={{ gridTemplateColumns: `repeat(${fields.length}, 1fr)` }}
            tabIndex={0} role="listitem"
            onClick={() => onEvent?.(createSafeEvent("list", "select", { index: i, item }))}>
            {fields.map((f: any) => (
              <span key={f.name} data-role="item-cell">{String(item[f.name] ?? "")}</span>
            ))}
          </div>
        ))}
      </div>
      <Pager page={page} totalPages={totalPages} numbers={numbers} onPage={go} />
    </div>
  );
}

function FilesList({ config, data, onEvent }: { config: ConfigBase; data: any[]; onEvent?: OnSafeEvent }) {
  const meta = config.metadata;
  const labelField = fieldOf(meta, "labelField", "name");
  const iconField = fieldOf(meta, "iconField", "icon");
  const pageSize = (meta.pageSize as number) ?? 0;
  const numbers = meta.pageNumbers !== false;
  const { page, totalPages, slice, go } = usePager(data.length, pageSize, onEvent);

  return (
    <div data-component="list" data-variant="files" {...intentAttrs(meta)}>
      <div data-role="list-items">
        {slice(data).map((item, i) => (
          <div key={i} data-role="list-item" data-file-type={item.type} tabIndex={0} role="listitem"
            onClick={() => onEvent?.(createSafeEvent("list", "select", { index: i, item }))}>
            <span data-role="item-icon"><IconGlyph name={item[iconField]} size={18} /></span>
            <span data-role="item-body">
              <span data-role="item-label">{item[labelField]}</span>
              <span data-role="item-meta">{item.size}</span>
            </span>
            <span data-role="item-time">{item.modified}</span>
          </div>
        ))}
      </div>
      <Pager page={page} totalPages={totalPages} numbers={numbers} onPage={go} />
    </div>
  );
}

const STATUS_INTENT: Record<string, string> = {
  completed: "success", "in progress": "info", pending: "neutral",
  failed: "danger", scheduled: "warn",
};

function ActionsList({ config, data, onEvent }: { config: ConfigBase; data: any[]; onEvent?: OnSafeEvent }) {
  const meta = config.metadata;
  const labelField = fieldOf(meta, "labelField", "title");
  const iconField = fieldOf(meta, "iconField", "icon");
  const statusField = fieldOf(meta, "statusField", "status");
  const timeField = fieldOf(meta, "timeField", "time");
  const actionField = fieldOf(meta, "actionField", "action");

  return (
    <div data-component="list" data-variant="actions" {...intentAttrs(meta)}>
      <div data-role="list-items">
        {data.map((item, i) => {
          const status = item[statusField] as string | undefined;
          const intent = status ? STATUS_INTENT[status.toLowerCase()] ?? "neutral" : undefined;
          return (
            <div key={i} data-role="list-item" tabIndex={0} role="listitem">
              <span data-role="item-icon"><IconGlyph name={item[iconField]} size={18} /></span>
              <span data-role="item-body">
                <span data-role="item-label">{item[labelField]}</span>
                <span data-role="item-meta">{item[timeField]}</span>
              </span>
              {status && <span data-role="item-badge" data-accent={intent}>{status}</span>}
              {item[actionField] && (
                <button data-role="item-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEvent?.(createSafeEvent("list", "action", { index: i, action: item[actionField], item }));
                  }}>
                  {item[actionField]}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hierarchy (expandable tree, paginated flat view)                   */
/* ------------------------------------------------------------------ */

function flattenTree(nodes: any[], expanded: Set<string>, level = 0): any[] {
  const out: any[] = [];
  for (const node of nodes) {
    out.push({ ...node, level });
    if (node.children && expanded.has(String(node.id))) {
      out.push(...flattenTree(node.children, expanded, level + 1));
    }
  }
  return out;
}

function collectGroupIds(nodes: any[]): string[] {
  const out: string[] = [];
  for (const n of nodes) {
    if (n.children?.length) {
      out.push(String(n.id));
      out.push(...collectGroupIds(n.children));
    }
  }
  return out;
}

function HierarchyList({ config, data, onEvent }: { config: ConfigBase; data: any[]; onEvent?: OnSafeEvent }) {
  const meta = config.metadata;
  const labelField = fieldOf(meta, "labelField", "name");
  const iconField = fieldOf(meta, "iconField", "icon");
  const countField = fieldOf(meta, "countField", "count");
  const pageSize = (meta.pageSize as number) ?? 0;
  const numbers = meta.pageNumbers !== false;
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(collectGroupIds(data).slice(0, 3)),
  );

  const flat = flattenTree(data, expanded);
  const { page, totalPages, slice, go } = usePager(flat.length, pageSize, onEvent);

  const toggleNode = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      onEvent?.(createSafeEvent("list", "expand", { id, expanded: next.has(id) }));
      return next;
    });
  };

  return (
    <div data-component="list" data-variant="hierarchy" {...intentAttrs(meta)}>
      <div data-role="list-items">
        {slice(flat).map((node) => {
          const isGroup = !!node.children?.length;
          const isOpen = expanded.has(String(node.id));
          return (
            <div key={node.id} data-role="list-item" data-depth={node.level} data-group={isGroup || undefined}
              style={{ paddingLeft: `${node.level * 20 + 12}px` }} tabIndex={0}
              role={isGroup ? "button" : "listitem"} aria-expanded={isGroup ? isOpen : undefined}
              onClick={() => isGroup
                ? toggleNode(String(node.id))
                : onEvent?.(createSafeEvent("list", "select", { id: node.id, item: node }))}>
              {isGroup
                ? <span data-role="item-chevron" data-expanded={isOpen || undefined}><IconGlyph name="chevron-right" size={14} /></span>
                : <span data-role="item-chevron" data-leaf="true" />}
              <span data-role="item-icon"><IconGlyph name={node[iconField]} size={16} /></span>
              <span data-role="item-label">{node[labelField]}</span>
              {node[countField] && <span data-role="item-meta">{node[countField]}</span>}
            </div>
          );
        })}
      </div>
      <Pager page={page} totalPages={totalPages} numbers={numbers} onPage={go} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Property grid (grouped name/value rows, editable values)           */
/* ------------------------------------------------------------------ */

function PropertyGrid({ config, data, onEvent }: { config: ConfigBase; data: any[]; onEvent?: OnSafeEvent }) {
  const meta = config.metadata;
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(data.filter((g) => g.children?.length).map((g) => String(g.id))),
  );
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const init: Record<string, unknown> = {};
    const walk = (nodes: any[]) => {
      for (const n of nodes) {
        if (n.children) walk(n.children);
        else if (n.id != null) init[String(n.id)] = n.value ?? "";
      }
    };
    walk(data);
    return init;
  });

  const toggleGroup = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      onEvent?.(createSafeEvent("list", "expand", { id, expanded: next.has(id) }));
      return next;
    });
  };

  const commit = (id: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    onEvent?.(createSafeEvent("list", "change", { id, value }));
  };

  const renderNode = (node: any, level: number): React.ReactNode => {
    if (node.children?.length) {
      const isOpen = expanded.has(String(node.id));
      return (
        <div key={node.id} data-role="prop-group">
          <div data-role="prop-group-header" tabIndex={0} role="button" aria-expanded={isOpen}
            style={{ paddingLeft: `${level * 20 + 12}px` }}
            onClick={() => toggleGroup(String(node.id))}>
            <span data-role="item-chevron" data-expanded={isOpen || undefined}><IconGlyph name="chevron-right" size={14} /></span>
            <span data-role="item-label" data-level={level}>{node.name}</span>
          </div>
          {isOpen && node.children.map((c: any) => renderNode(c, level + 1))}
        </div>
      );
    }
    const id = String(node.id);
    const options = node.options as string[] | undefined;
    return (
      <div key={id} data-role="prop-row" style={{ paddingLeft: `${level * 20 + 12}px` }}>
        <span data-role="prop-name">{node.name}</span>
        {options ? (
          <select data-role="prop-value" value={String(values[id] ?? "")}
            onChange={(e) => commit(id, e.target.value)}>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input data-role="prop-value" type={typeof node.value === "number" ? "number" : "text"}
            value={String(values[id] ?? "")}
            onChange={(e) => commit(id, typeof node.value === "number" ? Number(e.target.value) : e.target.value)} />
        )}
      </div>
    );
  };

  return (
    <div data-component="list" data-variant="property-grid" {...intentAttrs(meta)}>
      <div data-role="list-items">{data.map((n) => renderNode(n, 0))}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Gantt (dark date header + activity rows)                           */
/* ------------------------------------------------------------------ */

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function GanttList({ config, data, onEvent }: { config: ConfigBase; data: any[]; onEvent?: OnSafeEvent }) {
  const meta = config.metadata;
  const title = (meta.title as string) ?? "Active Task List";
  const days = (meta.days as number) ?? 14;
  const labelField = fieldOf(meta, "labelField", "label");
  const baseStart = meta.startDate ? new Date(meta.startDate as string) : new Date();
  const [offset, setOffset] = useState(0);

  const start = new Date(baseStart);
  start.setDate(start.getDate() + offset * days);
  const dates: Date[] = Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  const today = new Date();
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const navigate = (dir: number) => {
    setOffset((o) => o + dir);
    onEvent?.(createSafeEvent("list", "navigate", { direction: dir }));
  };

  const inRange = (item: any, d: Date) => {
    if (!item.start || !item.end) return false;
    const s = new Date(item.start);
    const e = new Date(item.end);
    return d >= new Date(s.getFullYear(), s.getMonth(), s.getDate())
      && d <= new Date(e.getFullYear(), e.getMonth(), e.getDate());
  };

  return (
    <div data-component="list" data-variant="gantt" {...intentAttrs(meta)}>
      <div data-role="gantt-scroll">
        <div data-role="gantt-header">
          <span data-role="gantt-title">
            <button data-role="gantt-nav" data-dir="prev" onClick={() => navigate(-1)}>‹</button>
            <span>{title}</span>
            <button data-role="gantt-nav" data-dir="next" onClick={() => navigate(1)}>›</button>
          </span>
          <span data-role="gantt-dates" style={{ gridTemplateColumns: `repeat(${days}, 1fr)` }}>
            {dates.map((d, i) => (
              <span key={i} data-role="gantt-date"
                data-today={sameDay(d, today) || undefined}
                data-weekend={(d.getDay() === 0 || d.getDay() === 6) || undefined}>
                <span data-role="gantt-day-name">{DAY_NAMES[d.getDay()]}</span>
                <span data-role="gantt-day-num">{d.getDate()}</span>
              </span>
            ))}
          </span>
        </div>
        <div data-role="list-items">
          {data.map((item, i) => {
            const intent = (item.accent as string) ?? "brand";
            return (
              <div key={i} data-role="gantt-row"
                onClick={() => onEvent?.(createSafeEvent("list", "select", { index: i, item }))}>
                <span data-role="gantt-row-label">{item[labelField]}</span>
                <span data-role="gantt-cells" style={{ gridTemplateColumns: `repeat(${days}, 1fr)` }}>
                  {dates.map((d, di) => (
                    <span key={di} data-role="gantt-cell"
                      data-active={inRange(item, d) || undefined}
                      data-accent={inRange(item, d) ? intent : undefined}
                      data-weekend={(d.getDay() === 0 || d.getDay() === 6) || undefined} />
                  ))}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

export function SafeList({ config, data, onEvent }: SafeListProps) {
  const raw = data ?? (Object.values(config.data ?? {})[0]?.inline as any[] | undefined);
  const list = Array.isArray(raw) ? raw : [];
  const variant = (config.metadata.variant as string) ?? "simple";

  switch (variant) {
    case "simple":
    case "icon":
      return <SimpleList config={config} data={list} onEvent={onEvent} />;
    case "selection":
      return <SelectionList config={config} data={list} onEvent={onEvent} />;
    case "columns":
      return <ColumnsList config={config} data={list} onEvent={onEvent} />;
    case "files":
      return <FilesList config={config} data={list} onEvent={onEvent} />;
    case "actions":
      return <ActionsList config={config} data={list} onEvent={onEvent} />;
    case "hierarchy":
      return <HierarchyList config={config} data={list} onEvent={onEvent} />;
    case "property-grid":
      return <PropertyGrid config={config} data={list} onEvent={onEvent} />;
    case "gantt":
      return <GanttList config={config} data={list} onEvent={onEvent} />;
    default:
      return <div data-component="list">Unknown list variant: {variant}</div>;
  }
}
