import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { buildComponent } from "../../utils/render";
interface SafeDispatchProps { config: ConfigBase; onEvent?: OnSafeEvent; }
export function SafeDispatch({ config, onEvent }: SafeDispatchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const c = containerRef.current; if (!c) return; c.innerHTML = ""; const r = buildComponent(config, onEvent); c.appendChild(r); return () => { r.remove(); }; }, [config, onEvent]);
  return <div ref={containerRef} />;
}