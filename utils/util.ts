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
 */

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

/**
 * Apply the shared Intent attributes (surface, radius, spacing, density)
 * from metadata to a root element, with per-component defaults.
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
