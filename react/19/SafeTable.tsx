import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeTable } from "../../builders/table";

interface SafeTableProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeTable({ config, onEvent }: SafeTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const root = createSafeTable(container, config, onEvent);
    return () => { root.remove(); };
  }, [config, onEvent]);

  return <div ref={containerRef} />;
}
