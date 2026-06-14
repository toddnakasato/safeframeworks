import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeNav } from "../../builders/nav";

interface SafeNavProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeNav({ config, onEvent }: SafeNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const root = createSafeNav(container, config, onEvent);
    return () => { root.remove(); };
  }, [config, onEvent]);

  return <div ref={containerRef} />;
}
