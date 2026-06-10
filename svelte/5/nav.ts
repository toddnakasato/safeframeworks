/**
 * Nav builder for this renderer's SafeNav — navStyle "accordion".
 *
 * Framework-agnostic DOM logic recreated from the figma "Left Menu Navigation
 * Bars" Shopfront design: header with colored logo block, accordion groups
 * with colored lucide icons and chevrons, child items with dot/active state
 * and badges, bottom icon row.
 *
 * SafeNav calls createSafeNav(container, config, onEvent) and removes the
 * returned root on unmount. Same mapping in every framework/version.
 */
import { createElement, Store, ChevronDown, Dot, type IconNode } from "lucide";
import * as lucide from "lucide";
import type { ConfigBase, OnSafeEvent } from "../../../safecontracts/src/contracts";
import { createSafeEvent } from "../../../safecontracts/src/contracts";

/** Resolve a kebab-case icon name to a lucide IconNode. */
function iconNode(name?: string): IconNode | null {
    if (!name) return null;
    const pascal = name.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
    return ((lucide as any)[pascal] as IconNode) ?? null;
}

function iconEl(name: string | undefined, size: number, color?: string): SVGElement | null {
    const node = iconNode(name);
    if (!node) return null;
    const el = createElement(node);
    el.setAttribute("width", String(size));
    el.setAttribute("height", String(size));
    if (color) el.style.color = color;
    return el;
}

function div(attrs: Record<string, string> = {}, style = ""): HTMLDivElement {
    const el = document.createElement("div");
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (style) el.setAttribute("style", style);
    return el;
}

/** Build the accordion nav (Shopfront design) into a container. */
export function createSafeNav(container: HTMLElement, config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
    const metadata = config.metadata;
    const width = (metadata.width as number) ?? 224;
    const title = metadata.title as string | undefined;
    const subtitle = metadata.subtitle as string | undefined;
    const headerIconName = (metadata.icon as string) ?? "store";
    const headerColor = (metadata.headerColor as string) ?? "#6366f1";

    const expanded = new Set<string>();
    let active = "";

    const entries = Object.entries(config.children ?? {});
    const groups = entries.filter(([, c]) => (c.metadata?.section as string) !== "bottom");
    const bottom = entries.filter(([, c]) => (c.metadata?.section as string) === "bottom");
    // First group starts expanded (figma default)
    if (groups.length) expanded.add(groups[0][0]);

    const root = div(
        { "data-component": "nav", "data-nav-style": "accordion" },
        `width:${width}px;height:100%;display:flex;flex-direction:column;background:var(--sd-surface-base,#fff);border-right:1px solid var(--sd-border,#e5e7eb);font-family:inherit`,
    );

    // ── Header ──
    if (title) {
        const header = div({ "data-nav-header": "" }, "height:56px;padding:0 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--sd-border,#e5e7eb)");
        const logo = div({ "data-nav-logo": "" }, `width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;background:${headerColor};color:#fff`);
        const hIcon = iconEl(headerIconName, 13);
        if (hIcon) logo.appendChild(hIcon); else logo.textContent = title.charAt(0).toUpperCase();
        const text = div({ "data-nav-header-text": "" });
        const t = div({ "data-nav-title": "" }, "font-size:14px;font-weight:600;line-height:1;color:var(--sd-text,#111)");
        t.textContent = title;
        text.appendChild(t);
        if (subtitle) {
            const st = div({ "data-nav-subtitle": "" }, "font-size:11px;margin-top:2px;color:var(--sd-text-dim,#6b7280)");
            st.textContent = subtitle;
            text.appendChild(st);
        }
        header.append(logo, text);
        root.appendChild(header);
    }

    // ── Groups ──
    const nav = document.createElement("nav");
    nav.setAttribute("data-nav-main", "");
    nav.setAttribute("style", "flex:1;overflow-y:auto;padding:8px");
    root.appendChild(nav);

    const fire = (key: string) => {
        active = key;
        onEvent?.(createSafeEvent("nav", "navigate", { key, value: key }, { context: { path: key } }));
        render();
    };

    function render() {
        nav.replaceChildren();
        for (const [gKey, group] of groups) {
            const gMeta = group.metadata ?? {};
            const accent = (gMeta.accentColor as string) ?? "var(--sd-accent,#3b82f6)";
            const isExpanded = expanded.has(gKey);

            const wrap = div({ "data-nav-item": "", "data-depth": "0" }, "margin-bottom:2px");

            // Group header button
            const btn = document.createElement("button");
            btn.setAttribute("data-nav-button", "");
            btn.setAttribute("data-has-children", "true");
            btn.setAttribute("style", "width:100%;display:flex;align-items:center;gap:10px;padding:8px 10px;border:none;border-radius:6px;background:transparent;cursor:pointer;font-size:14px;color:var(--sd-text,#111)");
            const gi = iconEl(gMeta.icon as string, 15, accent);
            if (gi) { const s = document.createElement("span"); s.setAttribute("data-nav-icon", ""); s.style.color = accent; s.style.display = "flex"; s.appendChild(gi); btn.appendChild(s); }
            const lbl = document.createElement("span");
            lbl.setAttribute("data-nav-label", "");
            lbl.setAttribute("style", "flex:1;text-align:left;font-weight:500");
            lbl.textContent = (gMeta.label as string) ?? gKey;
            btn.appendChild(lbl);
            const chev = createElement(ChevronDown);
            chev.setAttribute("width", "13"); chev.setAttribute("height", "13");
            chev.setAttribute("style", `color:var(--sd-text-dim,#6b7280);transition:transform .2s;${isExpanded ? "" : "transform:rotate(-90deg)"}`);
            btn.appendChild(chev);
            btn.onclick = () => { isExpanded ? expanded.delete(gKey) : expanded.add(gKey); render(); };
            wrap.appendChild(btn);

            // Children
            if (isExpanded && group.children) {
                const kids = div({ "data-nav-children": "" }, "margin:2px 0 4px 12px;border-left:2px solid var(--sd-border,#e5e7eb);padding-left:8px;display:flex;flex-direction:column;gap:2px");
                for (const [cKey, child] of Object.entries(group.children)) {
                    const cMeta = child.metadata ?? {};
                    const key = `${gKey}.${cKey}`;
                    const isActive = active === key;
                    const cBtn = document.createElement("button");
                    cBtn.setAttribute("data-nav-button", "");
                    cBtn.setAttribute("data-depth", "1");
                    if (isActive) cBtn.setAttribute("data-active", "true");
                    cBtn.setAttribute("style", `width:100%;display:flex;align-items:center;gap:6px;padding:6px 8px;border:none;border-radius:6px;cursor:pointer;font-size:14px;${isActive ? "background:var(--sd-surface-raised,#f3f4f6);color:var(--sd-text,#111);font-weight:500" : "background:transparent;color:var(--sd-text-dim,#6b7280)"}`);
                    const dot = createElement(Dot);
                    dot.setAttribute("width", "14"); dot.setAttribute("height", "14");
                    dot.setAttribute("style", `color:${isActive ? accent : "var(--sd-border,#d1d5db)"}`);
                    cBtn.appendChild(dot);
                    const cLbl = document.createElement("span");
                    cLbl.setAttribute("data-nav-label", "");
                    cLbl.setAttribute("style", "flex:1;text-align:left");
                    cLbl.textContent = (cMeta.label as string) ?? cKey;
                    cBtn.appendChild(cLbl);
                    const badge = cMeta.badge as string | number | undefined;
                    if (badge != null) {
                        const b = document.createElement("span");
                        b.setAttribute("data-nav-badge", "");
                        const isNew = String(badge) === "New";
                        b.setAttribute("style", `font-size:10px;padding:2px 6px;border-radius:999px;${isNew ? `background:${accent};color:#fff` : "background:var(--sd-surface-raised,#f3f4f6);color:var(--sd-text-dim,#6b7280)"}`);
                        b.textContent = String(badge);
                        cBtn.appendChild(b);
                    }
                    cBtn.onclick = () => fire(key);
                    kids.appendChild(cBtn);
                }
                wrap.appendChild(kids);
            }
            nav.appendChild(wrap);
        }
    }
    render();

    // ── Bottom icon row ──
    if (bottom.length) {
        const foot = div({ "data-nav-bottom": "" }, "padding:8px 12px;border-top:1px solid var(--sd-border,#e5e7eb);display:flex;align-items:center;gap:12px");
        for (const [key, child] of bottom) {
            const b = document.createElement("button");
            b.setAttribute("data-nav-button", "");
            b.setAttribute("style", "border:none;background:transparent;cursor:pointer;color:var(--sd-text-dim,#6b7280);display:flex;padding:0");
            const ic = iconEl(child.metadata?.icon as string, 15);
            if (ic) b.appendChild(ic);
            b.onclick = () => fire(key);
            foot.appendChild(b);
        }
        root.appendChild(foot);
    }

    container.appendChild(root);
    return root;
}

/**
 * Scan-and-mount for server-rendered hosts (Astro): build a nav in every
 * div[data-nav-config] not yet mounted.
 */
export function initSafeNavs(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-nav-config]").forEach((el) => {
        if (el.dataset.navMounted) return;
        el.dataset.navMounted = "1";
        const config = JSON.parse(el.dataset.navConfig!) as ConfigBase;
        createSafeNav(el, config);
    });
}
