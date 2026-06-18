import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { buildComponent } from "../../utils/render";
interface SafeSkillUpProps { config: ConfigBase; onEvent?: OnSafeEvent; }
export function SafeSkillUp({ config, onEvent }: SafeSkillUpProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const c = containerRef.current; if (!c) return; c.innerHTML = ""; const r = buildComponent(config, onEvent); c.appendChild(r); return () => { r.remove(); }; }, [config, onEvent]);
  return <div ref={containerRef} />;
}