/**
 * Leaflet + OpenStreetMap builder for this renderer's SafeMap.
 *
 * Framework-agnostic DOM logic: maps ConfigBase + rows → Leaflet map with
 * markers, popups, circles, optional path, fitBounds.
 * SafeMap calls createSafeMap(container, config, data, onEvent) and destroys
 * the returned map on unmount. Same mapping in every framework/version.
 */
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ConfigBase, OnSafeEvent } from "../../../safecontracts/src/contracts";
import { createSafeEvent } from "../../../safecontracts/src/contracts";

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
    // Structure + data attribute only — shape/size/border live in safestyles.
    // Pin color is config/data-driven, exposed as a CSS custom property.
    const bg = resolveColor(color);
    return L.divIcon({
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
        html: `<div data-map-pin style="--pin-color:${bg}"><span data-map-pin-icon>${icon ?? "●"}</span></div>`,
    });
}

/** First DataSource's inline rows from config.data (contract: Record keyed by name). */
export function mapData(config: ConfigBase): Record<string, any>[] {
    const ds = Object.values(config.data ?? {})[0];
    return Array.isArray(ds?.inline) ? ds.inline : [];
}

/** Create a Leaflet map in a container. Fires "select" SafeEvents on marker click. */
export function createSafeMap(
    container: HTMLElement,
    config: ConfigBase,
    data: Record<string, any>[],
    onEvent?: OnSafeEvent,
): L.Map {
    const metadata = config.metadata;
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
    const zoomControl = metadata.zoomControl !== false;
    const fitBounds = metadata.fitBounds !== false;
    const showPath = !!metadata.showPath;

    const map = L.map(container, { center, zoom, zoomControl, attributionControl: false });

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

        const marker = L.marker([lat, lng], { icon: createIcon(color, icon) }).addTo(map);

        if (label || desc) {
            const popupHtml = `<div data-map-popup>
        <strong data-map-popup-label>${label}</strong>
        ${desc ? `<br/><span data-map-popup-desc>${desc}</span>` : ""}
        <br/><span data-map-popup-coords>${lat.toFixed(4)}, ${lng.toFixed(4)}</span>
      </div>`;
            marker.bindPopup(popupHtml);
        }

        marker.on("click", () => onEvent?.(createSafeEvent("map", "select", { index: i, data: d, lat, lng })));
        allLayers.push(marker);
        pathPoints.push([lat, lng]);

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

    if (showPath && pathPoints.length > 1) {
        const polyline = L.polyline(pathPoints, {
            color: "var(--sd-accent)",
            weight: 3,
            opacity: 0.6,
            dashArray: "8, 8",
        }).addTo(map);
        allLayers.push(polyline);
    }

    if (fitBounds && allLayers.length > 0) {
        const group = L.featureGroup(allLayers.filter((l) => l instanceof L.Marker));
        if (group.getLayers().length > 0) {
            map.fitBounds(group.getBounds().pad(0.15));
        }
    }

    setTimeout(() => map.invalidateSize(), 100);
    return map;
}

/**
 * Scan-and-mount for server-rendered hosts (Astro): create a map in every
 * div[data-map-config] not yet mounted.
 */
export function initSafeMaps(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-map-config]").forEach((el) => {
        if (el.dataset.mapMounted) return;
        el.dataset.mapMounted = "1";
        const config = JSON.parse(el.dataset.mapConfig!) as ConfigBase;
        createSafeMap(el, config, mapData(config));
    });
}
