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

    const root = el("div");
    root.setAttribute("data-component", "columns");
    root.setAttribute("data-surface", surface);
    root.setAttribute("data-radius", radius);
    root.setAttribute("data-spacing", spacing);
    root.setAttribute("data-columns", String(totalColumns));
    // Structural grid template — react sets the same inline.
    root.style.display = "grid";
    root.style.gridTemplateColumns = `repeat(${totalColumns}, minmax(0, 1fr))`;
    root.style.gap = gap;
    root.style.rowGap = rowGap;

    const children = Object.entries(config.children ?? {});
    if (children.length > 0) {
        for (const [key, childConfig] of children) {
            const span = (childConfig.metadata.span as number) ?? totalColumns;
            const start = childConfig.metadata.start as number | undefined;
            const cell = el("div", "column", key);
            cell.setAttribute("data-span", String(span));
            cell.style.gridColumn = start ? `${start} / span ${span}` : `span ${span}`;
            root.appendChild(cell);
        }
    } else {
        // Placeholder cells matching the previous stub shells' visible output.
        const half = Math.max(1, Math.floor(totalColumns / 2));
        for (const label of ["Column 1", "Column 2"]) {
            const cell = el("div", "column", label);
            cell.setAttribute("data-span", String(half));
            cell.style.gridColumn = `span ${half}`;
            root.appendChild(cell);
        }
    }

    container.appendChild(root);
    return root;
}
