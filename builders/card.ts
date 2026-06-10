import type { ConfigBase, OnSafeEvent, RowCell, RowDef } from "../../safecontracts/src/contracts";
import { createSafeEvent } from "../../safecontracts/src/contracts";

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

function el(tag: string, role?: string, text?: string): HTMLElement {
    const e = document.createElement(tag);
    if (role) e.setAttribute("data-role", role);
    if (text != null) e.textContent = text;
    return e;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeCard(container: HTMLElement, config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
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
    const ds = Object.values(config.data ?? {})[0];
    const raw = ds?.inline;
    const data: Record<string, any> = (Array.isArray(raw) ? raw[0] : raw) ?? {};

    const root = el("div");
    root.setAttribute("data-component", "card");
    root.setAttribute("data-variant", variant);
    root.setAttribute("data-surface", surface);
    root.setAttribute("data-radius", radius);
    root.setAttribute("data-spacing", spacing);
    root.setAttribute("data-accent", accent);
    root.onclick = () => onEvent?.(createSafeEvent("card", "click", { data }));

    const appendBack = () => {
        if (!backLabel) return;
        const back = el("div", "back", backLabel);
        back.onclick = (e) => {
            e.stopPropagation();
            onEvent?.(createSafeEvent("card", "back", {}));
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

    const resolvedSchema = Object.values(config.data ?? {})[0]?.schema;
    const fields = resolvedSchema?.fields ?? [];

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

export function initSafeCards(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-card-config]").forEach((host) => {
        if (host.dataset.cardMounted) return;
        host.dataset.cardMounted = "1";
        const config = JSON.parse(host.dataset.cardConfig!) as ConfigBase;
        createSafeCard(host, config);
    });
}
