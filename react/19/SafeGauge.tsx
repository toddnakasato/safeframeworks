import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeFireContext } from "safecontracts";
import { buildPayloadViaCli } from "../../builders/payload-delegate";
import { createSafeGauge } from "../../builders/gauge";

interface SafeGaugeProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeGauge({ config, onEvent }: SafeGaugeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ctx = createSafeFireContext(config, onEvent, buildPayloadViaCli);
    const root = createSafeGauge(container, config, ctx);
    return () => { root.remove(); };
  }, [config, onEvent]);

  return <div ref={containerRef} />;
}
