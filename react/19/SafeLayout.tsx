import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeLayout } from "../../builders/layout";

interface SafeLayoutProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeLayout({ config, onEvent }: SafeLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const root = createSafeLayout(container, config, onEvent);
    return () => { root.remove(); };
  }, [config, onEvent]);

  return <div ref={containerRef} />;
}
