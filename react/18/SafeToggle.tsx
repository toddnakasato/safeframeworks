import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeToggle } from "../../builders/toggle";

interface SafeToggleProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeToggle({ config, onEvent }: SafeToggleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const root = createSafeToggle(container, config, onEvent);
    return () => { root.remove(); };
  }, [config, onEvent]);

  return <div ref={containerRef} />;
}
