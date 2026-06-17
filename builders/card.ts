import type { ConfigBase, RowCell, RowDef } from "../../safecontracts/src/contracts";
import { el, applyPaintState, applyIntent, readSchema, readSchema } from "../utils/util";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import { readList } from "../../safecontracts/src/contracts-data";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

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

export function createSafeCard(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    const rows = metadata.rows as RowDef[] | undefined;
    const accent = (metadata.accent as string) ?? "brand";
    const spacing = (metadata.spacing as string) ?? "normal";
    const surface = (metadata.surface as string) ?? "base";
    const radius = (metadata.radius as string) ?? "md";
    const variant = (metadata.variant as string) ?? "ghost";
    const header = metadata.header as string | undefined;
    const density = metadata.density as string | undefined;
    const backLabel = metadata.backLabel as string | undefined;

    // Self-extract record data from the first DataSource (contract: record).
    const data = readList(config);

    // External paint state (resolved from state.json by host)
    const _selectedCard = metadata.selectedCard ?? null;
    const _activeScene = metadata.activeScene ?? null;

    const root = el("div");
    root.setAttribute("data-component", "card");
    applyIntent(root, metadata);
    applyPaintState(root, metadata, "card");

    // Paint intent attributes
    if (_selectedCard != null) root.setAttribute("data-selected", String(_selectedCard));
    if (_activeScene != null) root.setAttribute("data-active-scene", String(_activeScene));
    root.onclick = () => ctx.fire("click", { data });

    const appendBack = () => {
        if (!backLabel) return;
        const back = el("div", "back", backLabel);
        back.onclick = (e) => {
            e.stopPropagation();
            ctx.fire("back", {});
        };
        root.appendChild(back);
    };

    if (rows && rows.length > 0) {
        appendBack();
        if (header) root.appendChild(el("div", "header", header));
        for (const rowDef of rows) {
            const row = el("div", "row");
            row.setAttribute("data-cells", String(rowDef.length));
            for (const cell of rowDef as RowCell[]) {
                if (cell.text) {
                    const c = el("div", undefined, cell.text);
                    if (cell.style != null) c.setAttribute("data-style", cell.style);
                    if (cell.align != null) c.setAttribute("data-align", cell.align);
                    row.appendChild(c);
                    continue;
                }
                const val = data[cell.field];
                if (val == null || String(val).trim() === "") continue;
                const c = el("div", undefined, String(val));
                if (cell.style != null) c.setAttribute("data-style", cell.style);
                if (cell.align != null) c.setAttribute("data-align", cell.align);
                c.setAttribute("data-field", cell.field);
                row.appendChild(c);
            }
            root.appendChild(row);
        }
        container.appendChild(root);
        return root;
    }

    if (density != null) root.setAttribute("data-density", density);
    appendBack();
    if (header) root.appendChild(el("div", "header", header));

    // schema via readSchema in util
    const fields = readSchema(config) ?? [];

    for (const field of fields) {
        const val = data[field.name];
        if (val == null || String(val).trim() === "") continue;
        const fieldRow = el("div", "field-row");
        fieldRow.appendChild(el("div", "field-label", field.label));
        const value = el("div", "field-value", String(val));
        value.setAttribute("data-field", field.name);
        fieldRow.appendChild(value);
        root.appendChild(fieldRow);
    }
    if (fields.length === 0) root.appendChild(el("div", "empty", "No fields configured"));

    container.appendChild(root);
    return root;
}
