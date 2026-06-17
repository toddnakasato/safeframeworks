import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeFireContext } from "safecontracts";
import { buildPayloadViaCli } from "../../builders/payload-delegate";
import { createSafeWeek } from "../../builders/week";

interface SafeWeekProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeWeek({ config, onEvent }: SafeWeekProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ctx = createSafeFireContext(config, onEvent, buildPayloadViaCli);
    const root = createSafeWeek(container, config, ctx);
    return () => { root.remove(); };
  }, [config, onEvent]);

  return <div ref={containerRef} />;
}
