import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeFireContext } from "safecontracts";
import { buildPayloadViaCli } from "../../builders/payload-delegate";
import { createSafeInput } from "../../builders/input";

interface SafeInputProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeInput({ config, onEvent }: SafeInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ctx = createSafeFireContext(config, onEvent, buildPayloadViaCli);
    const root = createSafeInput(container, config, ctx);
    return () => { root.remove(); };
  }, [config, onEvent]);

  return <div ref={containerRef} />;
}
