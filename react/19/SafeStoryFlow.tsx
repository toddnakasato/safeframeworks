import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeStoryFlow } from "../../builders/storyflow";

interface SafeStoryFlowProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
  renderChild?: (container: HTMLElement, child: ConfigBase, onEvent?: OnSafeEvent) => void;
}

export function SafeStoryFlow({ config, onEvent, renderChild }: SafeStoryFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const _ctx = createSafeFireContext(config, onEvent, buildPayloadViaCli);
    const root = createSafeStoryFlow(container, config, _ctx, renderChild);
    return () => { root.remove(); };
  }, [config, onEvent, renderChild]);

  return <div ref={containerRef} />;
}
