/**
 * SafeMap — Leaflet + OpenStreetMap map component.
 * Config-driven markers, circles, polylines, polygons from datasource.
 * Data-attributes for host CSS. Zero Tailwind.
 */
import { useRef, useEffect } from "react";
import L from "leaflet";
import type { ConfigBase, OnSafeEvent } from "safecomponents";
import { createSafeEvent } from "safecomponents";

export interface SafeMapProps {
  config: ConfigBase;
  data: Record<string, any>[];
  onEvent?: OnSafeEvent;
}

const TILE_URLS: Record<string, string> = {
  default: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  dark: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  minimal: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
  satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
};

const MARKER_COLORS: Record<string, string> = {
  red: "var(--sd-danger)", blue: "var(--sd-accent)", green: "var(--sd-success)", yellow: "var(--sd-warning)",
  purple: "var(--sd-chart-3, #bc8cff)", orange: "var(--sd-chart-4, #f0883e)", cyan: "var(--sd-chart-6, #79c0ff)", pink: "var(--sd-chart-8, #d2a8ff)",
};

function resolveColor(c?: string): string {
  return MARKER_COLORS[c ?? ""] ?? c ?? "var(--sd-accent)";
}

function createIcon(color?: string, icon?: string): L.DivIcon {
  const bg = resolveColor(color);
  return L.divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
    html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:${bg};transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"><span style="transform:rotate(45deg);font-size:12px">${icon ?? "●"}</span></div>`,
  });
}

export function SafeMap({ config, data, onEvent }: SafeMapProps) {
  const { metadata } = config;
  const variant = (metadata.variant as string) ?? "default";
  const latField = (metadata.latField as string) ?? "lat";
  const lngField = (metadata.lngField as string) ?? "lng";
  const labelField = (metadata.labelField as string) ?? "label";
  const descriptionField = metadata.descriptionField as string | undefined;
  const iconField = metadata.iconField as string | undefined;
  const colorField = metadata.colorField as string | undefined;
  const radiusField = metadata.radiusField as string | undefined;
  const center = (metadata.center as [number, number]) ?? [40.7128, -74.006];
  const zoom = (metadata.zoom as number) ?? 12;
  const height = metadata.height as number | undefined;
  const zoomControl = metadata.zoomControl !== false;
  const fitBounds = metadata.fitBounds !== false;
  const showPath = !!metadata.showPath;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl,
      attributionControl: false,
    });
    mapRef.current = map;

    L.tileLayer(TILE_URLS[variant] ?? TILE_URLS.default, { maxZoom: 18 }).addTo(map);
    L.control.attribution({ prefix: false })
      .addAttribution('© <a href="https://www.openstreetmap.org">OSM</a>')
      .addTo(map);

    const allLayers: L.Layer[] = [];
    const pathPoints: L.LatLngExpression[] = [];

    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      const lat = Number(d[latField]);
      const lng = Number(d[lngField]);
      if (isNaN(lat) || isNaN(lng)) continue;

      const label = String(d[labelField] ?? "");
      const desc = descriptionField ? String(d[descriptionField] ?? "") : "";
      const icon = iconField ? String(d[iconField] ?? "") : undefined;
      const color = colorField ? String(d[colorField] ?? "") : undefined;
      const radius = radiusField ? Number(d[radiusField]) : undefined;

      // Marker
      const marker = L.marker([lat, lng], { icon: createIcon(color, icon) }).addTo(map);

      if (label || desc) {
        const popupHtml = `<div style="font-size:12px;min-width:120px">
          <strong style="font-size:13px">${label}</strong>
          ${desc ? `<br/><span style="color:var(--sd-text-dim);font-size:11px">${desc}</span>` : ""}
          <br/><span style="color:var(--sd-text-dim);font-size:9px">${lat.toFixed(4)}, ${lng.toFixed(4)}</span>
        </div>`;
        marker.bindPopup(popupHtml);
      }

      marker.on("click", () => onEvent?.(createSafeEvent("map", "select", { index: i, data: d, lat, lng })));
      allLayers.push(marker);
      pathPoints.push([lat, lng]);

      // Circle overlay if radius provided
      if (radius && radius > 0) {
        const circle = L.circle([lat, lng], {
          radius,
          color: resolveColor(color),
          fillColor: resolveColor(color),
          fillOpacity: 0.15,
          weight: 2,
        }).addTo(map);
        allLayers.push(circle);
      }
    }

    // Connect markers with a polyline path
    if (showPath && pathPoints.length > 1) {
      const polyline = L.polyline(pathPoints, {
        color: "var(--sd-accent)",
        weight: 3,
        opacity: 0.6,
        dashArray: "8, 8",
      }).addTo(map);
      allLayers.push(polyline);
    }

    // Fit bounds
    if (fitBounds && allLayers.length > 0) {
      const group = L.featureGroup(allLayers.filter(l => l instanceof L.Marker));
      if (group.getLayers().length > 0) {
        map.fitBounds(group.getBounds().pad(0.15));
      }
    }

    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [data, metadata]);

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