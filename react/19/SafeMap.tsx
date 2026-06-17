import { useRef, useEffect } from "react";
import type L from "leaflet";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeMap } from "../../builders/map";
import { createSafeFireContext } from "safecontracts";
import { buildPayloadViaCli } from "../../builders/payload-delegate";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface SafeMapProps {
  config: ConfigBase;
  data: Record<string, any>[];
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

export function SafeMap({ config, data, onEvent }: SafeMapProps) {
  const { metadata } = config;
  const variant = (metadata.variant as string) ?? "default";
  const height = metadata.height as number | undefined;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const _ctx = createSafeFireContext(config, onEvent, buildPayloadViaCli);
    mapRef.current = createSafeMap(containerRef.current, config, data, _ctx);
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [config, data, onEvent]);

  return (
    <div data-component="map" data-variant={variant}>
      <div
        ref={containerRef}
        data-map-container
        style={height ? ({ "--map-height": `${height}px` } as React.CSSProperties) : undefined}
      />
    </div>
  );
}
