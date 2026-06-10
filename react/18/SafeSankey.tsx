/**
 * SafeSankey — D3 sankey flow diagram.
 * Renders via shared-mapping sankey builder (./sankey) — identical across frameworks.
 * Data: { nodes: [{name}], links: [{source, target, value}] }
 * Data-attributes for host CSS. Zero Tailwind.
 */
import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { renderSafeSankey, type SankeyData } from "./sankey";

export interface SafeSankeyProps {
  config: ConfigBase;
  data: SankeyData;
  onEvent?: OnSafeEvent;
}

export function SafeSankey({ config, data, onEvent }: SafeSankeyProps) {
  const { metadata } = config;
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    renderSafeSankey(svgRef.current, config, data, onEvent);
  }, [config, data, onEvent]);

  return (
    <div data-component="sankey" data-variant={(metadata.variant as string) ?? "default"}>
      {metadata.title && <div data-role="title">{metadata.title as string}</div>}
      <svg ref={svgRef} data-sankey-svg />
    </div>
  );
}
