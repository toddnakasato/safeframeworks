import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { getDataSource } from "safecontracts";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { fireScene } from "safecontracts";
import type { SceneEvent } from "safecontracts";
import type { EventShapeMap, EventHandler } from "safecontracts";
import type { HandlerContext } from "safecontracts";
import { findHandlers, runHandler } from "safecontracts";
import { SafeLayout } from "./SafeLayout";
import { SafePicker } from "./SafePicker";
import { SafeCard } from "./SafeCard";
import { SafeTable } from "./SafeTable";
import { renderConfigBase } from "./SafeRenderer";
import type { RenderLogFn } from "./hooks/useRenderLog";
import type { ReactNode } from "react";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface SafeSceneProps {
  config: ConfigBase;
  detailConfig?: ConfigBase;
  data?: Record<string, any>[];
  shapes?: EventShapeMap;
  serverCall?: (domain: string, action: string, args?: Record<string, any>) => Promise<any>;
  onLog?: (phase: string, event: string, payload?: any) => void;
  flattenRecord?: (record: Record<string, any>) => Record<string, any>;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

function defaultFlatten(record: Record<string, any>): Record<string, any> {
  const flat: Record<string, any> = {};
  for (const [k, v] of Object.entries(record)) {
    if (v && typeof v === "object" && !Array.isArray(v) && k !== "attributes") {
      for (const [ck, cv] of Object.entries(v as Record<string, any>)) {
        flat[`${k}.${ck}`] = cv;
      }
    } else {
      flat[k] = v;
    }
  }
  return flat;
}

function renderConfig(
  config: ConfigBase,
  data: Record<string, any> | Record<string, any>[],
  onEvent?: OnSafeEvent,
  loading?: boolean,
  error?: string | null,
  fieldLabels?: Record<string, string>,
  onRenderLog?: RenderLogFn,
  boundState?: Record<string, any>,
): ReactNode {
  const component = config.component ?? config.metadata.component;

  // Recursively render children into regions
  const regions: Record<string, ReactNode> = {};
  if (config.children) {
    for (const [key, child] of Object.entries(config.children)) {
      const childData = boundState?.[key] != null ? boundState[key] : data;
      regions[key] = renderConfig(child, childData, onEvent, loading, error, fieldLabels, onRenderLog, boundState);
    }
  }

  // Scene-specific overrides (loading, error, fieldLabels, onRenderLog)
  if (component === "layout") {
    return <SafeLayout config={config} regions={regions} onEvent={onEvent} onRenderLog={onRenderLog} />;
  }

  if (component === "picker") {
    const rows = Array.isArray(data) ? data : [];
    return <SafePicker config={config} data={rows} loading={loading} error={error} onEvent={onEvent} onRenderLog={onRenderLog} />;
  }

  if (component === "table") {
    const rows = Array.isArray(data) ? data : [];
    return <SafeTable config={config} data={rows} onEvent={onEvent} />;
  }

  if (component === "card") {
    if (fieldLabels && (getDataSource(config)?.schema?.fields.length ?? 0) > 0) {
      const resolved = {
        ...config,
        schema: {
          ...config.data![0].schema,
          fields: config.data![0].schema.fields.map((f) => ({
            ...f,
            label: fieldLabels[f.name] ?? f.label,
          })),
        },
      };
      return <SafeCard config={resolved} data={Array.isArray(data) ? {} : data} onEvent={onEvent} onRenderLog={onRenderLog} />;
    }
    return <SafeCard config={config} data={Array.isArray(data) ? {} : data} onEvent={onEvent} onRenderLog={onRenderLog} />;
  }

  // All other components — delegate to SafeRenderer
  return renderConfigBase(config, onEvent) ?? <>{Object.values(regions)}</>;
}

export interface SafeSceneHandle {
  emit: (event: string, payload: any) => Promise<void>;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export const SafeScene = forwardRef<SafeSceneHandle, SafeSceneProps>(function SafeScene({
  config,
  detailConfig,
  data: initialData,
  shapes,
  serverCall,
  onLog,
  flattenRecord: flattenFn,
}, ref) {
  const [rows, setRows] = useState<Record<string, any>[]>(initialData ?? []);
  const [record, setRecord] = useState<Record<string, any> | null>(null);
  const [fieldLabels, setFieldLabels] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const flatten = flattenFn ?? defaultFlatten;

  // Update rows when initialData changes
  useEffect(() => {
    if (initialData) setRows(initialData);
  }, [initialData]);

  // Bound state — keyed by bind name (e.g. "junctions")
  const [boundState, setBoundState] = useState<Record<string, any>>({});

  // writeState — dispatcher binds results here
  const writeState = useCallback((key: string, value: any) => {
    onLog?.("bind", key);
    if (key === "fieldMeta" && value?.ok) {
      const labels: Record<string, string> = {};
      for (const f of value.fields) labels[f.name] = f.label;
      setFieldLabels(labels);
    } else if (key === "detail" && value?.ok) {
      setRecord(flatten(value.record));
    } else if (key === "detail" && value && !value.ok) {
      setError(value.error || "Unknown error");
    } else {
      // Generic bind — store by key for children to read
      setBoundState((prev) => ({ ...prev, [key]: value }));
    }
  }, [onLog, flatten]);

  // Run config handlers per their shape: once at mount, interval timers,
  // and on-demand emit — using the contract primitives directly.
  const handlersRef = useRef<EventHandler[]>([]);
  const ctxRef = useRef<HandlerContext | null>(null);

  useEffect(() => {
    if (!serverCall || !shapes) return;
    const ctx: HandlerContext = { serverCall, writeState };
    const handlers: EventHandler[] = Array.isArray((config as any)?.eventHandlers) ? (config as any).eventHandlers : [];
    handlersRef.current = handlers;
    ctxRef.current = ctx;
    const timers: any[] = [];
    for (const [name, shape] of Object.entries(shapes)) {
      const matches = findHandlers(handlers, name);
      if (shape.fires === "once") {
        for (const h of matches) { runHandler(h, null, ctx).catch(() => {}); }
      } else if (shape.fires === "interval") {
        for (const h of matches) {
          const ms = (h as any).interval ?? shape.defaultInterval ?? 3000;
          timers.push(setInterval(() => { runHandler(h, null, ctx).catch(() => {}); }, ms));
        }
      }
    }
    return () => { for (const t of timers) clearInterval(t); handlersRef.current = []; ctxRef.current = null; };
  }, [config, shapes, serverCall, writeState]);

  const emitLocal = useCallback(async (name: string, payload: any) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    for (const h of findHandlers(handlersRef.current, name)) {
      await runHandler(h, payload, ctx);
    }
  }, []);

  // Handle events
  const handleEvent: OnSafeEvent = useCallback(
    async (event) => {
      const eventName = event.name;
      const payload = (event.data ?? {}) as Record<string, any>;
      if (eventName === "select") {
        const row = payload.row;
        if (!row?.Id) return;
        onLog?.("fire", "select", row.Id);
        setLoading(true);
        setError(null);
        try {
          await emitLocal("select", { row, id: row.Id });
        } catch (e) {
          setError(String(e));
        } finally {
          setLoading(false);
        }
      } else if (eventName === "back") {
        onLog?.("fire", "back");
        setRecord(null);
        setError(null);
      } else if (eventName === "filter") {
        onLog?.("fire", "filter", payload);
      }
    },
    [onLog],
  );

  // Expose emit to parent via ref (for CLI-driven transitions)
  useImperativeHandle(ref, () => ({
    emit: async (event: string, payload: any) => {
      await Promise.resolve(fireScene(handleEvent, event as SceneEvent, payload));
    },
  }), [handleEvent]);

  // Render log callback — emits render phase to machine log
  const handleRenderLog: RenderLogFn = useCallback((ctx) => {
    onLog?.("render", ctx.component ?? "", ctx);
  }, [onLog]);

  // Scene 1: Picker (no record selected)
  if (!record) {
    return <>{renderConfig(config, rows, handleEvent, loading, error, fieldLabels, handleRenderLog, boundState)}</>;
  }

  // Scene 2: Detail (record selected)
  if (detailConfig) {
    return <>{renderConfig(detailConfig, record, handleEvent, false, error, fieldLabels, handleRenderLog, boundState)}</>;
  }

  // No detail config — stay on picker
  return <>{renderConfig(config, rows, handleEvent, loading, error, fieldLabels, handleRenderLog, boundState)}</>;
});