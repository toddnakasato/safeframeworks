import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeTabs } from "../../builders/tabs";

interface SafeTabsProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeTabs({ config, onEvent }: SafeTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const root = createSafeTabs(container, config, onEvent);
    return () => { root.remove(); };
  }, [config, onEvent]);

  return <div ref={containerRef} />;
}
