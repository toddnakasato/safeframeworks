import { useRef, useEffect, useState, useCallback } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeFireContext } from "safecontracts";
import { buildPayloadViaCli } from "../../utils/payload-delegate";
import { createSafeTable } from "../../builders/table";

interface SafeTableProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeTable({ config, onEvent }: SafeTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const wrappedOnEvent: OnSafeEvent | undefined = useCallback((event: any) => {
    // Short-circuit paint: update local state for hover/select
    if (event.name === "row:hover") setHoverRow(event.data?.index ?? null);
    if (event.name === "row:leave") setHoverRow(null);
    if (event.name === "row:click" || event.name === "select") setSelectedRow(event.data?.index ?? null);
    onEvent?.(event);
  }, [onEvent]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Merge paint state into config metadata
    const paintedConfig = {
      ...config,
      metadata: { ...config.metadata, hoverRow, selectedRow },
    };
    const ctx = createSafeFireContext(paintedConfig, wrappedOnEvent, buildPayloadViaCli);
    const root = createSafeTable(container, paintedConfig, ctx);
    return () => { root.remove(); };
  }, [config, wrappedOnEvent, hoverRow, selectedRow]);

  return <div ref={containerRef} />;
}
