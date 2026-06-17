/**
 * util.ts — shared vanilla-DOM helpers for builders.
 *
 * DOM construction and attribute application. NOT contract.
 * Types and data reads live in safecontracts. This file owns DOM helpers only.
 *
 * Element helpers:
 *   el(tag, role?, text?)   — data-role + textContent shorthand
 *   elAttrs(tag, attrs)     — explicit attribute map
 *
 * Builder helpers:
 *   applyIntent(root, metadata) — parseIntent + setAttribute in one call
 *   applyPaintState(root, metadata, component) — read COMPONENT_PAINT, set data-* attrs
 *   collapsibleHeader(label, opts) — collapsible section header with chevron
 *
 * Re-exports from safecontracts:
 *   readList, readRecord, readSchema, parseIntent, INTENT_DEFAULTS
 */

import { COMPONENT_PAINT } from "../../safecontracts/src/contracts-paint";
import { parseIntent } from "../../safecontracts/src/contracts-intent";

// Re-export from contracts so builders import from one place
export { readList, readRecord, readSchema } from "../../safecontracts/src/contracts-data";
export { parseIntent, INTENT_DEFAULTS } from "../../safecontracts/src/contracts-intent";
export type { Intent } from "../../safecontracts/src/contracts-intent";

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
// Intent — DOM application (parseIntent lives in safecontracts)
// ---------------------------------------------------------------------------

/**
 * Parse intent fields and set them as data-* attributes on the root element.
 * Returns the parsed intent for builders that need the values.
 */
export function applyIntent(root: HTMLElement, metadata: Record<string, any>, defaults?: Parameters<typeof parseIntent>[1]): ReturnType<typeof parseIntent> {
    const intent = parseIntent(metadata, defaults);
    root.setAttribute("data-variant", intent.variant);
    root.setAttribute("data-spacing", intent.spacing);
    root.setAttribute("data-surface", intent.surface);
    root.setAttribute("data-accent", intent.accent);
    root.setAttribute("data-radius", intent.radius);
    return intent;
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
 */
export function applyPaintState(root: HTMLElement, metadata: Record<string, any>, component: string): void {
    const paintDefs = COMPONENT_PAINT[component];
    if (!paintDefs) return;

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
