/**
 * util.ts — shared vanilla-DOM helpers for builders.
 *
 * Pure DOM construction — this is renderer machinery, NOT contract.
 * (Event creation lives in safecontracts contracts-emit.ts; data reads in
 * contracts-data.ts readList/readRecord. This file owns only the HTML.)
 *
 * Two element helpers cover the two conventions used across builders:
 *   el(tag, role?, text?)   — data-role + textContent shorthand
 *   elAttrs(tag, attrs)     — explicit attribute map
 *
 * Four builder helpers standardize the common patterns:
 *   parseIntent(metadata)   — extract variant/spacing/surface/accent/radius with defaults
 *   applyIntent(root, metadata) — parseIntent + setAttribute in one call
 *   applyPaintState(root, metadata, component) — read COMPONENT_PAINT, set data-* attrs
 *   readData(config)        — readList from contract (one line instead of three)
 */

import type { ConfigBase } from "../../safecontracts/src/contracts";
import { readList, readRecord } from "../../safecontracts/src/contracts-data";
import { COMPONENT_PAINT } from "../../safecontracts/src/contracts-paint";

// ---------------------------------------------------------------------------
// Element helpers
// ---------------------------------------------------------------------------

/** Create an element with optional data-role and text content. */
export function el(tag: string, role?: string, text?: string): HTMLElement {
    const e = document.createElement(tag);
    if (role) e.setAttribute("data-role", role);
    if (text != null) e.textContent = text;
    return e;
}

/** Create an element from an attribute map. */
export function elAttrs(tag: string, attrs: Record<string, string> = {}): HTMLElement {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
}

// ---------------------------------------------------------------------------
// Intent helpers — standard metadata fields every builder reads
// ---------------------------------------------------------------------------

/** Standard intent fields extracted from metadata with defaults. */
export interface Intent {
    variant: string;
    spacing: string;
    surface: string;
    accent: string;
    radius: string;
}

/** Default intent values when metadata doesn't specify. */
const INTENT_DEFAULTS: Intent = {
    variant: "default",
    spacing: "normal",
    surface: "base",
    accent: "brand",
    radius: "md",
};

/**
 * Extract standard intent fields from metadata.
 * Override defaults per-component via the second argument.
 */
export function parseIntent(metadata: Record<string, any>, defaults?: Partial<Intent>): Intent {
    const d = defaults ? { ...INTENT_DEFAULTS, ...defaults } : INTENT_DEFAULTS;
    return {
        variant:  (metadata.variant as string) ?? d.variant,
        spacing:  (metadata.spacing as string) ?? d.spacing,
        surface:  (metadata.surface as string) ?? d.surface,
        accent:   (metadata.accent as string)  ?? d.accent,
        radius:   (metadata.radius as string)  ?? d.radius,
    };
}

/**
 * Parse intent fields and set them as data-* attributes on the root element.
 * Returns the parsed Intent for builders that need the values.
 */
export function applyIntent(root: HTMLElement, metadata: Record<string, any>, defaults?: Partial<Intent>): Intent {
    const intent = parseIntent(metadata, defaults);
    root.setAttribute("data-variant", intent.variant);
    root.setAttribute("data-spacing", intent.spacing);
    root.setAttribute("data-surface", intent.surface);
    root.setAttribute("data-accent", intent.accent);
    root.setAttribute("data-radius", intent.radius);
    return intent;
}

/**
 * Apply the shared Intent attributes (surface, radius, spacing, density)
 * from metadata to a root element, with per-component defaults.
 * @deprecated Use applyIntent instead — covers all five standard fields.
 */
export function intentAttrs(root: HTMLElement, metadata: Record<string, any>, defaults: { surface?: string; radius?: string; spacing?: string; density?: string } = {}): void {
    const pairs: [string, string | undefined][] = [
        ["data-surface", (metadata.surface as string) ?? defaults.surface],
        ["data-radius", (metadata.radius as string) ?? defaults.radius],
        ["data-spacing", (metadata.spacing as string) ?? defaults.spacing],
        ["data-density", (metadata.density as string) ?? defaults.density]
    ];
    for (const [attr, value] of pairs) {
        if (value != null) root.setAttribute(attr, value);
    }
}

// ---------------------------------------------------------------------------
// Paint state helper — reads COMPONENT_PAINT, sets data-* from metadata
// ---------------------------------------------------------------------------

/**
 * Read paint state keys from COMPONENT_PAINT for a component and set
 * the corresponding data-* attributes on root from metadata values.
 *
 * Only processes paint entries that have an `attr` field defined.
 * Skips null/undefined values (they mean "no paint state").
 *
 * Example: table's COMPONENT_PAINT has key:"selectedRow", attr:"data-row-selected".
 * If metadata.selectedRow is 3, sets root.setAttribute("data-row-selected", "3").
 */
export function applyPaintState(root: HTMLElement, metadata: Record<string, any>, component: string): void {
    const paintDefs = COMPONENT_PAINT[component];
    if (!paintDefs) return;

    // Collect unique key->attr mappings (many events write the same key)
    const seen = new Map<string, string>();
    for (const def of Object.values(paintDefs)) {
        if (def.attr && !seen.has(def.key)) {
            seen.set(def.key, def.attr);
        }
    }

    for (const [key, attr] of seen) {
        const value = metadata[key];
        if (value != null) {
            root.setAttribute(attr, String(value));
        }
    }
}

// ---------------------------------------------------------------------------
// Data helpers — one-line access to config data via contract
// ---------------------------------------------------------------------------

/**
 * Read list data from config via the contract's readList.
 * Replaces the three-line pattern:
 *   const ds = getDataSource(config);
 *   const raw = ds?.inline;
 *   const data = Array.isArray(raw) ? raw : [];
 */
export function readData(config: ConfigBase, slot?: string): Record<string, any>[] {
    return readList(config, slot);
}

/**
 * Read a single record from config via the contract's readRecord.
 * Replaces the three-line pattern for single-object data sources.
 */
export function readSingleRecord(config: ConfigBase, slot?: string): Record<string, any> {
    return readRecord(config, slot);
}

// ---------------------------------------------------------------------------
// Collapsible header
// ---------------------------------------------------------------------------

/**
 * Collapsible header block: label + chevron, click toggles and re-renders.
 * Returns the header element; caller appends it and supplies the rerender.
 */
export function collapsibleHeader(
    label: string,
    opts: {
        collapsible?: boolean;
        collapsed?: () => boolean;
        toggle?: () => void;
        collapseIcon?: string;
        expandIcon?: string;
    } = {}
): HTMLElement {
    const header = el("div", "header");
    const hl = el("span", "header-label", label);
    header.appendChild(hl);
    if (opts.collapsible) {
        header.setAttribute("data-collapsible", "true");
        const chevron = el("span", "header-chevron", opts.collapsed?.() ? (opts.expandIcon ?? "▸") : (opts.collapseIcon ?? "▾"));
        header.appendChild(chevron);
        header.onclick = () => opts.toggle?.();
    }
    return header;
}
