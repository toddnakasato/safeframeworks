import type { ConfigBase, Field, SafeFireContext } from "../../safecontracts/src/contracts";
import { getDataSource } from "../../safecontracts/src/contracts";
import { createSafeInput } from "./input";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

const D = {
    columns: "1fr 1fr",
    spacing: "normal",
    surface: "base",
    radius: "md",
    locale: "en-US",
    currency: "USD",
    timezone: "UTC",
    emptyValue: "—",
} as const;

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

function el(tag: string, attrs: Record<string, string> = {}): HTMLElement {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
}

function fieldToInputConfig(
    field: Field,
    locale: string,
    currency: string,
    timezone: string,
    emptyValue: string,
    value: any,
): ConfigBase {
    const type = field.type;
    let inputType = "text";
    let displayFormat: string | undefined;

    switch (type) {
        case "currency": inputType = "currency"; displayFormat = "currency"; break;
        case "number": inputType = "number"; displayFormat = "number"; break;
        case "percent": inputType = "number"; displayFormat = "percent"; break;
        case "date": inputType = "date"; displayFormat = "date"; break;
        case "datetime": inputType = "datetime"; displayFormat = "datetime"; break;
        case "boolean": inputType = "checkbox"; break;
        case "email": inputType = "email"; break;
        case "phone": inputType = "phone"; break;
        case "url": inputType = "url"; break;
        default: inputType = "text"; break;
    }

    return {
        component: "input",
        metadata: {
            component: "input",
            name: field.name,
            field: field.name,
            inputType,
            displayFormat,
            defaultText: emptyValue,
            locale,
            currency,
            timezone,
            hideEdit: false,
            hideCancel: false,
        },
        data: {
            value: {
                name: "value",
                type: "record",
                source: "inline",
                schema: { fields: [field] },
                inline: { [field.name]: value },
            },
        },
    };
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeGrid(container: HTMLElement, config: ConfigBase, ctx?: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    const ds = getDataSource(config) as any;
    const schema = ds?.schema;
    const raw = ds?.inline;
    const record: Record<string, any> = (Array.isArray(raw) ? raw[0] : raw) ?? {};
    const columns = (metadata.columns as string) ?? D.columns;
    const label = metadata.label as string | undefined;
    const collapsible = !!metadata.collapsible;
    const collapseIcon = (metadata.collapseIcon as string) ?? "▾";
    const expandIcon = (metadata.expandIcon as string) ?? "▸";
    const spacing = (metadata.spacing as string) ?? D.spacing;
    const surface = (metadata.surface as string) ?? D.surface;
    const radius = (metadata.radius as string) ?? D.radius;
    const locale = (metadata.locale as string) ?? D.locale;
    const currency = (metadata.currency as string) ?? D.currency;
    const timezone = (metadata.timezone as string) ?? D.timezone;
    const emptyValue = (metadata.emptyValue as string) ?? D.emptyValue;

    const fields: Field[] = ((schema?.fields ?? []) as Field[]).filter((f) => f.visible !== false);

    let collapsed = false;

    const root = el("div", {
        "data-component": "grid",
        "data-surface": surface,
        "data-radius": radius,
        "data-spacing": spacing,
    });

    function render() {
        root.replaceChildren();

        if (label) {
            const header = el("div", { "data-role": "header" });
            if (collapsible) {
                header.setAttribute("data-collapsible", "true");
                header.onclick = () => { collapsed = !collapsed; render(); };
            }
            const hl = el("span", { "data-role": "header-label" });
            hl.textContent = label;
            header.appendChild(hl);
            if (collapsible) {
                const hi = el("span", { "data-role": "header-icon" });
                hi.textContent = collapsed ? expandIcon : collapseIcon;
                header.appendChild(hi);
            }
            root.appendChild(header);
        }

        if (!collapsed) {
            const body = el("div", { "data-role": "body" });
            // Structural grid layout — react sets this inline too.
            body.style.display = "grid";
            body.style.gridTemplateColumns = columns.replace(/1fr/g, "minmax(0, 1fr)");

            for (const field of fields) {
                const cell = el("div", { "data-role": "grid-cell", "data-field-type": field.type });
                const cl = el("div", { "data-role": "label" });
                cl.textContent = field.label;
                cell.appendChild(cl);
                const inputWrap = el("div", { "data-role": "input" });
                createSafeInput(
                    inputWrap,
                    fieldToInputConfig(field, locale, currency, timezone, emptyValue, record[field.name]),
                    onEvent,
                );
                cell.appendChild(inputWrap);
                body.appendChild(cell);
            }
            root.appendChild(body);
        }
    }
    render();

    container.appendChild(root);
    return root;
}

export function initSafeGrids(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-grid-config]").forEach((host) => {
        if (host.dataset.gridMounted) return;
        host.dataset.gridMounted = "1";
        const config = JSON.parse(host.dataset.gridConfig!) as ConfigBase;
        createSafeGrid(host, config);
    });
}
