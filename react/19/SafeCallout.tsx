import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeCallout } from "../../builders/callout";

interface SafeCalloutProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeCallout({ config }: SafeCalloutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const root = createSafeCallout(container, config);
    return () => { root.remove(); };
  }, [config]);

  return <div ref={containerRef} />;
}
