import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { buildComponent } from "../../utils/render";

interface SafeListProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeList({ config, onEvent }: SafeListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const root = buildComponent(config, onEvent);
    container.appendChild(root);
    return () => { root.remove(); };
  }, [config, onEvent]);

  return <div ref={containerRef} />;
}
