import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeChat } from "../../builders/chat";

interface SafeChatProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeChat({ config, onEvent }: SafeChatProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const root = createSafeChat(container, config, onEvent);
    return () => { root.remove(); };
  }, [config, onEvent]);

  return <div ref={containerRef} />;
}
