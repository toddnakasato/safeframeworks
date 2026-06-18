import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { buildComponent } from "../../utils/render";

interface SafeCalloutProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeCallout({ config, onEvent }: SafeCalloutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";
    const root = buildComponent(config, onEvent);
    container.appendChild(root);
    return () => { root.remove(); };
  }, [config, onEvent]);

  return <div ref={containerRef} />;
}
