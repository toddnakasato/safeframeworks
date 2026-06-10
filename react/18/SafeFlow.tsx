import { useRef, useEffect } from "react";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { renderSafeFlow, flowData } from "../../builders/flow";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

interface SafeFlowProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function SafeFlow({ config, onEvent }: SafeFlowProps) {
  const { metadata } = config;
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    renderSafeFlow(svgRef.current, config, flowData(config), onEvent);
  }, [config, onEvent]);

  return (
    <div>
      {metadata.title != null && <div data-role="title">{metadata.title as string}</div>}
      <svg ref={svgRef} data-flow-svg />
    </div>
  );
}
