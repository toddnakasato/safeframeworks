import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeFireContext } from "safecontracts";
import { buildPayloadViaCli } from "../../builders/payload-delegate";
import { createSafeCard } from "../../builders/card";

interface SafeCardProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeCard({ config, onEvent }: SafeCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ctx = createSafeFireContext(config, onEvent, buildPayloadViaCli);
    const root = createSafeCard(container, config, ctx);
    return () => { root.remove(); };
  }, [config, onEvent]);

  return <div ref={containerRef} />;
}
