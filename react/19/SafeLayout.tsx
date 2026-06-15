import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeLayout } from "../../builders/layout";
import type { RenderChild } from "../../builders/layout";

interface SafeLayoutProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
  renderChild?: RenderChild;
}

export function SafeLayout({ config, onEvent, renderChild }: SafeLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const root = createSafeLayout(container, config, onEvent, renderChild);
    return () => { root.remove(); };
  }, [config, onEvent, renderChild]);

  return <div ref={containerRef} />;
}
