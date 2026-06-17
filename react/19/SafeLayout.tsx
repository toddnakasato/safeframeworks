import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeLayout } from "../../builders/layout";
import type { RenderChild } from "../../builders/layout";
import { createSafeFireContext } from "safecontracts";
import { buildPayloadViaCli } from "../../builders/payload-delegate";

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
    const _ctx = createSafeFireContext(config, onEvent, buildPayloadViaCli);
    const root = createSafeLayout(container, config, _ctx, renderChild);
    return () => { root.remove(); };
  }, [config, onEvent, renderChild]);

  return <div ref={containerRef} />;
}
