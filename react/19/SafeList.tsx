import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeList } from "../../builders/list";

interface SafeListProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeList({ config, onEvent }: SafeListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const root = createSafeList(container, config, onEvent);
    return () => { root.remove(); };
  }, [config, onEvent]);

  return <div ref={containerRef} />;
}
