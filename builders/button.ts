import { createElement, type IconNode } from "lucide";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import * as lucide from "lucide";
import type { ConfigBase } from "../../safecontracts/src/contracts";
import { elAttrs, applyIntent } from "../utils/util";

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

function iconNode(name?: string): IconNode | null {
    if (!name) return null;
    const pascal = name.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
    return ((lucide as any)[pascal] as IconNode) ?? null;
}

function iconEl(name: string | undefined, size: number): SVGElement | null {
    const node = iconNode(name);
    if (!node) return null;
    const el = createElement(node);
    el.setAttribute("width", String(size));
    el.setAttribute("height", String(size));
    return el;
}


function iconSpan(role: string, icon: string): HTMLElement {
    const s = elAttrs("span", { "data-role": role });
    const svg = iconEl(icon, 14);
    if (svg) s.appendChild(svg); else s.textContent = icon;
    return s;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

function buildSingleButton(config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    const variant = (metadata.variant as string) ?? "primary";
    const label = metadata.label as string | undefined;
    const icon = metadata.icon as string | undefined;
    const iconPosition = (metadata.iconPosition as string) ?? "left";
    const iconRight = metadata.iconRight as string | undefined;
    const suffix = metadata.suffix as string | undefined;
    const description = metadata.description as string | undefined;
    const iconOnly = !!metadata.iconOnly;
    const disabled = !!metadata.disabled;
    const loading = !!metadata.loading;
    const size = (metadata.size as string) ?? "md";
    const fullWidth = !!metadata.fullWidth;
    const eventName = (metadata.eventName as string) ?? "click";
    const eventContext = metadata.eventContext as Record<string, any> | undefined;
    const selected = !!metadata.selected;
    const status = metadata.status as string | undefined;

    const btn = elAttrs("button", { "data-component": "button", "data-variant": variant, "data-size": size }) as HTMLButtonElement;
    if (disabled) btn.setAttribute("data-disabled", "true");
    if (loading) btn.setAttribute("data-loading", "true");
    if (fullWidth) btn.setAttribute("data-full-width", "true");
    if (iconOnly) btn.setAttribute("data-icon-only", "true");
    if (selected) btn.setAttribute("data-selected", "true");
    if (status) btn.setAttribute("data-status", status);
    btn.disabled = disabled || loading;

    btn.onclick = () => {
        if (disabled || loading) return;
        ctx.fire(eventName, null); // config-driven name; validated by prove build
    };

    if (loading) btn.appendChild(elAttrs("span", { "data-role": "spinner" }));
    if (status) {
        const badge = elAttrs("span", { "data-role": "status-badge", "data-status": status });
        if (status === "completed") badge.textContent = "✓";
        btn.appendChild(badge);
    }
    if (icon && iconPosition === "left" && !iconOnly) btn.appendChild(iconSpan("icon", icon));
    if (iconOnly && icon) btn.appendChild(iconSpan("icon", icon));
    if (!iconOnly && label) {
        const l = elAttrs("span", { "data-role": "label" });
        l.textContent = label;
        btn.appendChild(l);
    }
    if (description) {
        const d = elAttrs("span", { "data-role": "description" });
        d.textContent = description;
        btn.appendChild(d);
    }
    if (suffix) {
        const s = elAttrs("span", { "data-role": "suffix" });
        s.textContent = suffix;
        btn.appendChild(s);
    }
    if (icon && iconPosition === "right" && !iconOnly) btn.appendChild(iconSpan("icon", icon));
    if (iconRight) btn.appendChild(iconSpan("icon-right", iconRight));

    return btn;
}

function buildPaginationGroup(config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    const totalPages = (metadata.totalPages as number) ?? 1;
    const initialPage = (metadata.currentPage as number) ?? 1;
    const showFirstLast = metadata.showFirstLast !== false;
    const variant = (metadata.variant as string) ?? "outline";
    const size = (metadata.size as string) ?? "sm";

    let page = initialPage;

    const root = elAttrs("div", { "data-component": "button", "data-group-variant": "pagination", "data-size": size });
    applyIntent(root, metadata);

    const go = (p: number) => {
        page = Math.max(1, Math.min(totalPages, p));
        ctx.fire("page", { page, totalPages });
        render();
    };

    function pageBtn(text: string, isDisabled: boolean, target: () => number): HTMLElement {
        const b = elAttrs("button", { "data-role": "page-btn", "data-variant": variant }) as HTMLButtonElement;
        if (isDisabled) b.setAttribute("data-disabled", "true");
        b.disabled = isDisabled;
        b.textContent = text;
        b.onclick = () => go(target());
        return b;
    }

    function render() {
        root.replaceChildren();
        if (showFirstLast) root.appendChild(pageBtn("«", page <= 1, () => 1));
        root.appendChild(pageBtn("‹", page <= 1, () => page - 1));
        const indicator = elAttrs("span", { "data-role": "page-indicator" });
        indicator.textContent = `${page} / ${totalPages}`;
        root.appendChild(indicator);
        root.appendChild(pageBtn("›", page >= totalPages, () => page + 1));
        if (showFirstLast) root.appendChild(pageBtn("»", page >= totalPages, () => totalPages));
    }
    render();

    return root;
}

function buildButtonGroup(config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    const groupVariant = (metadata.groupVariant as string) ?? "toolbar";
    const groupDirection = (metadata.groupDirection as string) ?? "horizontal";

    if (groupVariant === "pagination") return buildPaginationGroup(config, ctx);

    const root = elAttrs("div", {
        "data-component": "button",
        "data-group-variant": groupVariant,
        "data-group-direction": groupDirection,
    });

    for (const [, child] of Object.entries(config.children ?? {})) {
        const item = elAttrs("div", { "data-role": "group-item" });
        if (!child.component || child.component === "button") {
            item.appendChild(buildButton(child, ctx));
        } else {
            // Non-button child: placeholder only — full renderer recursion is the host's job.
            item.appendChild(elAttrs("div", { "data-role": "button-child", "data-child-component": child.component }));
        }
        root.appendChild(item);
    }

    return root;
}

function buildButton(config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const hasChildren = config.children && Object.keys(config.children).length > 0;
    const hasGroupVariant = !!config.metadata.groupVariant;
    if (hasChildren || hasGroupVariant) return buildButtonGroup(config, ctx);
    return buildSingleButton(config, ctx);
}

export function createSafeButton(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const root = buildButton(config, ctx);
    container.appendChild(root);
    return root;
}

export function initSafeButtons(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-button-config]").forEach((host) => {
        if (host.dataset.buttonMounted) return;
        host.dataset.buttonMounted = "1";
        const config = JSON.parse(host.dataset.buttonConfig!) as ConfigBase;
        createSafeButton(host, config);
    });
}