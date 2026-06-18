import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { buildComponent } from "../../utils/render";

interface SafeColumnsProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeColumns({ config }: SafeColumnsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const root = createSafeColumns(container, config);
    return () => { root.remove(); };
  }, [config]);

  return <div ref={containerRef} />;
}
