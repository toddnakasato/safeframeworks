import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeFireContext } from "safecontracts";
import { buildPayloadViaCli } from "../../utils/payload-delegate";
import { createSafeTable } from "../../builders/table";

interface SafeTableProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

export function SafeTable({ config, onEvent }: SafeTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Wrap onEvent to apply paint directly to DOM (no re-render)
    const paintOnEvent: OnSafeEvent | undefined = onEvent ? (event) => {
      const table = container.querySelector("[data-component='table']");
      if (table) {
        if (event.name === "row:hover") {
          table.querySelectorAll("tr[data-row-hover]").forEach(r => r.removeAttribute("data-row-hover"));
          const row = table.querySelector(`tr[data-index="${event.data?.index}"]`);
          if (row) row.setAttribute("data-row-hover", "true");
        }
        if (event.name === "row:leave") {
          table.querySelectorAll("tr[data-row-hover]").forEach(r => r.removeAttribute("data-row-hover"));
        }
        if (event.name === "row:click" || event.name === "select") {
          table.querySelectorAll("tr[data-row-selected]").forEach(r => r.removeAttribute("data-row-selected"));
          const row = table.querySelector(`tr[data-index="${event.data?.index}"]`);
          if (row) row.setAttribute("data-row-selected", "true");
        }
      }
      onEvent(event);
    } : undefined;

    const ctx = createSafeFireContext(config, paintOnEvent, buildPayloadViaCli);
    const root = createSafeTable(container, config, ctx);
    return () => { root.remove(); };
  }, [config]);

  return <div ref={containerRef} />;
}
