import L from "leaflet";
import { getDataSource } from "../../safecontracts/src/contracts";
import "leaflet/dist/leaflet.css";
import type { ConfigBase, OnSafeEvent } from "../../safecontracts/src/contracts";
import { createSafeEvent } from "../../safecontracts/src/contracts";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

const TILE_URLS: Record<string, string> = {
    default: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    dark: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    minimal: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
};

const ACCENT_VARS: Record<string, string> = {
    brand: "--sd-accent", info: "--sd-info", success: "--sd-success",
    warn: "--sd-warning", danger: "--sd-danger", neutral: "--sd-text-dim",
};

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

function accentColor(accent?: string): string {
    const v = ACCENT_VARS[accent ?? "brand"] ?? "--sd-accent";
    return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#3b82f6";
}

function createIcon(accent?: string, icon?: string): L.DivIcon {
    // Structure + intent attribute only — paint lives in safestyles.
    return L.divIcon({
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
        html: `<div data-map-pin data-accent="${accent ?? "brand"}"><span data-map-pin-icon>${icon ?? "●"}</span></div>`,
    });
}

export function mapData(config: ConfigBase): Record<string, any>[] {
    const ds = getDataSource(config);
    return Array.isArray(ds?.inline) ? ds.inline : [];
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

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
    const accentField = metadata.accentField as string | undefined;
    const radiusField = metadata.radiusField as string | undefined;
    const center = (metadata.center as [number, number]) ?? [40.7128, -74.006];
    const zoom = (metadata.zoom as number) ?? 12;
    const zoomControl = metadata.zoomControl !== false;
    const fitBounds = metadata.fitBounds !== false;
    const showPath = !!metadata.showPath;

    const map = L.map(container, { center, zoom, zoomControl, attributionControl: false });
    container.setAttribute("data-component", "map");
    container.setAttribute("data-variant", variant);

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
        const accent = accentField ? String(d[accentField] ?? "") : undefined;
        const radius = radiusField ? Number(d[radiusField]) : undefined;

        const marker = L.marker([lat, lng], { icon: createIcon(accent, icon) }).addTo(map);

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
            const c = accentColor(accent);
            const circle = L.circle([lat, lng], {
                radius,
                color: c,
                fillColor: c,
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

export function initSafeMaps(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-map-config]").forEach((el) => {
        if (el.dataset.mapMounted) return;
        el.dataset.mapMounted = "1";
        const config = JSON.parse(el.dataset.mapConfig!) as ConfigBase;
        createSafeMap(el, config, mapData(config));
    });
}
