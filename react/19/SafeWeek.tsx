import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
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
    const root = createSafeWeek(container, config, onEvent);
    return () => { root.remove(); };
  }, [config, onEvent]);

  return <div ref={containerRef} />;
}
