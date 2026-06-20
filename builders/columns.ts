import type { ConfigBase, SafeFireContext } from "../../safecontracts/src/contracts";
import { el } from "../utils/util";
import { COLUMNS_DEFAULTS } from "../../safecontracts/src/components/columns";

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeColumns(container: HTMLElement, config: ConfigBase, _ctx?: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    const D = COLUMNS_DEFAULTS;
    const totalColumns = (metadata.totalColumns as number) ?? D.totalColumns;
    const gap = (metadata.gap as string) ?? D.gap;
    const rowGap = (metadata.rowGap as string) ?? gap;
    const spacing = (metadata.spacing as string) ?? D.spacing;
    const surface = (metadata.surface as string) ?? D.surface;
    const radius = (metadata.radius as string) ?? D.radius;

    const children = Object.entries(config.children ?? {});
    const hasHeader = children.some(([, c]) => (c as any).metadata?.position === "header");
    const hasFooter = children.some(([, c]) => (c as any).metadata?.position === "footer");
    const hasPositioned = hasHeader || hasFooter;

    const root = el("div");
    root.setAttribute("data-component", "columns");
    root.setAttribute("data-surface", surface);
    root.setAttribute("data-radius", radius);
    root.setAttribute("data-spacing", spacing);
    root.setAttribute("data-columns", String(totalColumns));
    if (hasPositioned) root.setAttribute("data-positioned", "");

    if (hasPositioned) {
        // Three-section layout: header (pinned top), body (scrolls), footer (pinned bottom)
        const headerEl = hasHeader ? el("div", "columns-header") : null;
        const bodyEl = el("div", "columns-body");
        const footerEl = hasFooter ? el("div", "columns-footer") : null;

        // Body gets the grid
        bodyEl.style.gridTemplateColumns = `repeat(${totalColumns}, minmax(0, 1fr))`;
        bodyEl.style.gap = gap;
        bodyEl.style.rowGap = rowGap;

        for (const [key, childConfig] of children) {
            const childMeta = (childConfig as any).metadata ?? {};
            const position = childMeta.position as string | undefined;
            const span = (childMeta.span as number) ?? totalColumns;
            const start = childMeta.start as number | undefined;
            const cell = el("div", "column", key);
            cell.setAttribute("data-span", String(span));

            if (position === "header" && headerEl) {
                headerEl.appendChild(cell);
            } else if (position === "footer" && footerEl) {
                footerEl.appendChild(cell);
            } else {
                cell.style.gridColumn = start ? `${start} / span ${span}` : `span ${span}`;
                bodyEl.appendChild(cell);
            }
        }

        if (headerEl) root.appendChild(headerEl);
        root.appendChild(bodyEl);
        if (footerEl) root.appendChild(footerEl);
    } else {
        // Simple grid — no header/footer
        root.style.gridTemplateColumns = `repeat(${totalColumns}, minmax(0, 1fr))`;
        root.style.gap = gap;
        root.style.rowGap = rowGap;

        if (children.length > 0) {
            for (const [key, childConfig] of children) {
                const span = ((childConfig as any).metadata?.span as number) ?? totalColumns;
                const start = (childConfig as any).metadata?.start as number | undefined;
                const cell = el("div", "column", key);
                cell.setAttribute("data-span", String(span));
                cell.style.gridColumn = start ? `${start} / span ${span}` : `span ${span}`;
                root.appendChild(cell);
            }
        } else {
            const half = Math.max(1, Math.floor(totalColumns / 2));
            for (const label of ["Column 1", "Column 2"]) {
                const cell = el("div", "column", label);
                cell.setAttribute("data-span", String(half));
                cell.style.gridColumn = `span ${half}`;
                root.appendChild(cell);
            }
        }
    }

    container.appendChild(root);
    return root;
}
