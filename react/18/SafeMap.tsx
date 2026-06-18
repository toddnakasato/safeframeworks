import { useRef, useEffect } from "react";
import type L from "leaflet";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { buildComponent } from "../../utils/render";

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
    mapRef.current = createSafeMap(containerRef.current, config, data, onEvent);
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
