import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeFireContext } from "safecontracts";
import { buildPayloadViaCli } from "../../builders/payload-delegate";
import { createSafeButton } from "../../builders/button";

interface SafeButtonProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeButton({ config, onEvent }: SafeButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ctx = createSafeFireContext(config, onEvent, buildPayloadViaCli);
    const root = createSafeButton(container, config, ctx);
    return () => { root.remove(); };
  }, [config, onEvent]);

  return <div ref={containerRef} />;
}
