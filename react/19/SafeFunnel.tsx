import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeFireContext } from "safecontracts";
import { buildPayloadViaCli } from "../../builders/payload-delegate";
import { createSafeFunnel } from "../../builders/funnel";

interface SafeFunnelProps {
  config: ConfigBase;
  data: Record<string, any>[];
  onEvent?: OnSafeEvent;
}

export function SafeFunnel({ config, data, onEvent }: SafeFunnelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resolved: ConfigBase = data?.length
      ? { ...config, data: { [Object.keys(config.data ?? {})[0] ?? "items"]: { name: "items", type: "list" as const, source: "inline" as const, schema: { fields: [] }, inline: data } } }
      : config;
    const ctx = createSafeFireContext(resolved, onEvent, buildPayloadViaCli);
    const root = createSafeFunnel(container, resolved, ctx);
    return () => { root.remove(); };
  }, [config, data, onEvent]);

  return <div ref={containerRef} />;
}
