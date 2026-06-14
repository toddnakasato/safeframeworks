import { useRef, useEffect, useCallback } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeScene } from "../../builders/scene";

interface SafeSceneProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
  renderChild?: (container: HTMLElement, child: ConfigBase, onEvent?: OnSafeEvent) => void;
}

export const SafeScene = ({ config, onEvent, renderChild }: SafeSceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const root = createSafeScene(container, config, onEvent, renderChild);
    return () => { root.remove(); };
  }, [config, onEvent, renderChild]);

  return <div ref={containerRef} />;
};
