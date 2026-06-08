/**
 * SafeScene — generic config-driven scene renderer.
 *
 * One config tree in. Full scene out. Handles:
 * - Layout rendering from config.metadata.component + config.children
 * - Dispatcher mounting from config.eventHandlers
 * - State management (data binding from serverCall results)
 * - Scene transitions (picker → detail via "select", detail → picker via "back")
 * - Render logging
 *
 * The host passes: config, serverCall function, data loader. Nothing else.
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeEvent } from "safecontracts";
import type { EventShapeMap } from "safecontracts";
import type { HandlerContext } from "safecontracts";
import { createDispatcher } from "safecontracts";
import { SafeLayout } from "./SafeLayout";
import { SafePicker } from "./SafePicker";
import { SafeCard } from "./SafeCard";
import { SafeTable } from "./SafeTable";
import { renderConfigBase } from "./SafeRenderer";
import type { RenderLogFn } from "./hooks/useRenderLog";
import type { ReactNode } from "react";

export interface SafeSceneProps {
  /** The scene config tree. */
  config: ConfigBase;
  /** The detail scene config tree (shown after select). */
  detailConfig?: ConfigBase;
  /** Initial list data (from SQLite cache). */
  data?: Record<string, any>[];
  /** Event shapes for the dispatcher. */
  shapes?: EventShapeMap;
  /** Server call function — provided by the host. */
  serverCall?: (domain: string, action: string, args?: Record<string, any>) => Promise<any>;
  /** Called on state changes (fire, bind, render). */
  onLog?: (phase: string, event: string, payload?: any) => void;
  /** Transform raw record into flat display record. */
  flattenRecord?: (record: Record<string, any>) => Record<string, any>;
}

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

/** Render a config node into a React element. Recurses into children. */
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
    if (fieldLabels && (config.data?.[0]?.schema?.fields.length ?? 0) > 0) {
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

  const dispatcherRef = useRef(createDispatcher());

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

  // Mount dispatcher
  useEffect(() => {
    if (!serverCall || !shapes) return;
    const ctx: HandlerContext = { serverCall, writeState };
    return dispatcherRef.current.mount(config, shapes, ctx);
  }, [config, shapes, serverCall, writeState]);

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
          await dispatcherRef.current.emit("select", { row, id: row.Id });
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
      await handleEvent(createSafeEvent("SafeScene", event, payload));
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