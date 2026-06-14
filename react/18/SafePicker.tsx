import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafePicker } from "../../builders/picker";

interface SafePickerProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafePicker({ config, onEvent }: SafePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const root = createSafePicker(container, config, onEvent);
    return () => { root.remove(); };
  }, [config, onEvent]);

  return <div ref={containerRef} />;
}
