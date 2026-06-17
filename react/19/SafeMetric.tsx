import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeFireContext } from "safecontracts";
import { buildPayloadViaCli } from "../../builders/payload-delegate";
import { createSafeMetric } from "../../builders/metric";

interface SafeMetricProps {
  config: ConfigBase;
  data: Record<string, any>;
  onEvent?: OnSafeEvent;
}

export function SafeMetric({ config, data, onEvent }: SafeMetricProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resolved: ConfigBase = data
      ? { ...config, data: { record: { name: "record", type: "record" as const, source: "inline" as const, schema: { fields: [] }, inline: data } } }
      : config;
    const ctx = createSafeFireContext(resolved, onEvent, buildPayloadViaCli);
    const root = createSafeMetric(container, resolved, ctx);
    return () => { root.remove(); };
  }, [config, data, onEvent]);

  return <div ref={containerRef} />;
}
