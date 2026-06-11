import { createElement, type IconNode } from "lucide";
import * as lucide from "lucide";
import type { ConfigBase, OnSafeEvent } from "../../safecontracts/src/contracts";
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

function el(tag: string, attrs: Record<string, string> = {}): HTMLElement {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
}

function iconSpan(role: string, icon: string): HTMLElement {
    const s = el("span", { "data-role": role });
    const svg = iconEl(icon, 14);
    if (svg) s.appendChild(svg); else s.textContent = icon;
    return s;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

function buildSingleButton(config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
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
    const selected = !!metadata.selected;
    const status = metadata.status as string | undefined;

    const btn = el("button", { "data-component": "button", "data-variant": variant, "data-size": size }) as HTMLButtonElement;
    if (disabled) btn.setAttribute("data-disabled", "true");
    if (loading) btn.setAttribute("data-loading", "true");
    if (fullWidth) btn.setAttribute("data-full-width", "true");
    if (iconOnly) btn.setAttribute("data-icon-only", "true");
    if (selected) btn.setAttribute("data-selected", "true");
    if (status) btn.setAttribute("data-status", status);
    btn.disabled = disabled || loading;

    btn.onclick = () => {
        if (disabled || loading) return;
        onEvent?.(createSafeEvent("button", eventName));
    };

    if (loading) btn.appendChild(el("span", { "data-role": "spinner" }));
    if (status) {
        const badge = el("span", { "data-role": "status-badge", "data-status": status });
        if (status === "completed") badge.textContent = "✓";
        btn.appendChild(badge);
    }
    if (icon && iconPosition === "left" && !iconOnly) btn.appendChild(iconSpan("icon", icon));
    if (iconOnly && icon) btn.appendChild(iconSpan("icon", icon));
    if (!iconOnly && label) {
        const l = el("span", { "data-role": "label" });
        l.textContent = label;
        btn.appendChild(l);
    }
    if (description) {
        const d = el("span", { "data-role": "description" });
        d.textContent = description;
        btn.appendChild(d);
    }
    if (suffix) {
        const s = el("span", { "data-role": "suffix" });
        s.textContent = suffix;
        btn.appendChild(s);
    }
    if (icon && iconPosition === "right" && !iconOnly) btn.appendChild(iconSpan("icon", icon));
    if (iconRight) btn.appendChild(iconSpan("icon-right", iconRight));

    return btn;
}

function buildPaginationGroup(config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
    const metadata = config.metadata;
    const totalPages = (metadata.totalPages as number) ?? 1;
    const initialPage = (metadata.currentPage as number) ?? 1;
    const showFirstLast = metadata.showFirstLast !== false;
    const variant = (metadata.variant as string) ?? "outline";
    const size = (metadata.size as string) ?? "sm";

    let page = initialPage;

    const root = el("div", { "data-component": "button", "data-group-variant": "pagination", "data-size": size });

    const go = (p: number) => {
        page = Math.max(1, Math.min(totalPages, p));
        onEvent?.(createSafeEvent("button", "page", { page, totalPages }));
        render();
    };

    function pageBtn(text: string, isDisabled: boolean, target: () => number): HTMLElement {
        const b = el("button", { "data-role": "page-btn", "data-variant": variant }) as HTMLButtonElement;
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
        const indicator = el("span", { "data-role": "page-indicator" });
        indicator.textContent = `${page} / ${totalPages}`;
        root.appendChild(indicator);
        root.appendChild(pageBtn("›", page >= totalPages, () => page + 1));
        if (showFirstLast) root.appendChild(pageBtn("»", page >= totalPages, () => totalPages));
    }
    render();

    return root;
}

function buildButtonGroup(config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
    const metadata = config.metadata;
    const groupVariant = (metadata.groupVariant as string) ?? "toolbar";
    const groupDirection = (metadata.groupDirection as string) ?? "horizontal";

    if (groupVariant === "pagination") return buildPaginationGroup(config, onEvent);

    const root = el("div", {
        "data-component": "button",
        "data-group-variant": groupVariant,
        "data-group-direction": groupDirection,
    });

    for (const [, child] of Object.entries(config.children ?? {})) {
        const item = el("div", { "data-role": "group-item" });
        if (!child.component || child.component === "button") {
            item.appendChild(buildButton(child, onEvent));
        } else {
            // Non-button child: placeholder only — full renderer recursion is the host's job.
            item.appendChild(el("div", { "data-role": "button-child", "data-child-component": child.component }));
        }
        root.appendChild(item);
    }

    return root;
}

function buildButton(config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
    const hasChildren = config.children && Object.keys(config.children).length > 0;
    const hasGroupVariant = !!config.metadata.groupVariant;
    if (hasChildren || hasGroupVariant) return buildButtonGroup(config, onEvent);
    return buildSingleButton(config, onEvent);
}

export function createSafeButton(container: HTMLElement, config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
    const root = buildButton(config, onEvent);
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
