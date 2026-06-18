import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { buildComponent } from "../../utils/render";

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
    const root = createSafeStoryFlow(container, config, onEvent, renderChild);
    return () => { root.remove(); };
  }, [config, onEvent, renderChild]);

  return <div ref={containerRef} />;
}
