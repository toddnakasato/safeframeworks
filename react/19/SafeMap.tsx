/**
 * SafeMap — Leaflet + OpenStreetMap map component.
 * Renders via shared-mapping map builder (./map) — identical across frameworks.
 * Config-driven markers, circles, polylines from datasource.
 * Data-attributes for host CSS. Zero Tailwind.
 */
import { useRef, useEffect } from "react";
import type L from "leaflet";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { createSafeMap } from "./map";

export interface SafeMapProps {
  config: ConfigBase;
  data: Record<string, any>[];
  onEvent?: OnSafeEvent;
}

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

  const useAbsolute = !height;

  return (
    <div data-component="map" data-variant={variant} style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={containerRef} style={useAbsolute
        ? { position: "absolute", inset: 0, borderRadius: "var(--sd-radius-md)", overflow: "hidden" }
        : { width: "100%", height, minHeight: 300, borderRadius: "var(--sd-radius-md)", overflow: "hidden" }
      } />
    </div>
  );
}
