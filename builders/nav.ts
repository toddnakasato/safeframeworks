import { createElement, ChevronDown, Dot, type IconNode } from "lucide";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import * as lucide from "lucide";
import type { ConfigBase } from "../../safecontracts/src/contracts";
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

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeNav(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    // External paint state (resolved from state.json by host)
    const _activeScene = metadata.activeScene ?? null;

    const title = metadata.title as string | undefined;
    const subtitle = metadata.subtitle as string | undefined;
    const headerIconName = (metadata.icon as string) ?? "store";
    const accent = metadata.accent as string | undefined;
    const width = metadata.width as number | undefined;

    const expanded = new Set<string>();
    let active = "";

    const navData = readList(config);
    // Each entry: { key, label, icon?, accent?, section?, badge?, children?: [...] }
    const entries = navData.map((d: any) => [d.key ?? d.label, d] as [string, any]);
    const groups = entries.filter(([, d]) => d.section !== "bottom");
    const bottom = entries.filter(([, d]) => d.section === "bottom");
    // First group starts expanded (figma default)
    if (groups.length) expanded.add(groups[0][0]);

    const root = el("div", { "data-component": "nav", "data-nav-style": "accordion" });
    // Intent only — paint is safestyles' job.
    if (accent) root.setAttribute("data-accent", accent);
    if (width) root.style.setProperty("--nav-width", `${width}px`);

    if (title) {
        const header = el("div", { "data-nav-header": "" });
        const inner = el("div", { "data-nav-header-inner": "" });
        const logo = el("div", { "data-nav-logo": "" });
        const hIcon = iconEl(headerIconName, 13);
        if (hIcon) logo.appendChild(hIcon); else logo.textContent = title.charAt(0).toUpperCase();
        const text = el("div", { "data-nav-header-text": "" });
        const t = el("div", { "data-nav-title": "" });
        t.textContent = title;
        text.appendChild(t);
        if (subtitle) {
            const st = el("div", { "data-nav-subtitle": "" });
            st.textContent = subtitle;
            text.appendChild(st);
        }
        inner.append(logo, text);
        header.appendChild(inner);
        root.appendChild(header);
    }

    const nav = el("nav", { "data-nav-main": "" });
    root.appendChild(nav);

    const fire = (key: string) => {
        active = key;
        ctx.fire("navigate", { key, value: key });
        render();
    };

    function render() {
        nav.replaceChildren();
        for (const [gKey, group] of groups) {
            const gAccent = group.accent as string | undefined;
            const isExpanded = expanded.has(gKey);

            const wrap = el("div", { "data-nav-item": "", "data-depth": "0" });
            if (gAccent) wrap.setAttribute("data-accent", gAccent);

            const btn = el("button", { "data-nav-button": "", "data-has-children": "true", "data-depth": "0" });
            if (isExpanded) btn.setAttribute("data-expanded", "true");
            const gi = iconEl(group.icon as string, 15);
            if (gi) { const s = el("span", { "data-nav-icon": "" }); s.appendChild(gi); btn.appendChild(s); }
            const lbl = el("span", { "data-nav-label": "" });
            lbl.textContent = (group.label as string) ?? gKey;
            btn.appendChild(lbl);
            const chevWrap = el("span", { "data-nav-chevron": "" });
            const chev = createElement(ChevronDown);
            chev.setAttribute("width", "13");
            chev.setAttribute("height", "13");
            chevWrap.appendChild(chev);
            btn.appendChild(chevWrap);
            btn.onclick = () => { isExpanded ? expanded.delete(gKey) : expanded.add(gKey); render(); };
            wrap.appendChild(btn);

            if (isExpanded && Array.isArray(group.children)) {
                const kids = el("div", { "data-nav-children": "" });
                for (const child of group.children as any[]) {
                    const key = `${gKey}.${child.key ?? child.label}`;
                    const isActive = active === key;
                    const cBtn = el("button", { "data-nav-button": "", "data-depth": "1" });
                    if (isActive) cBtn.setAttribute("data-active", "true");
                    const dotWrap = el("span", { "data-nav-dot": "" });
                    const dot = createElement(Dot);
                    dot.setAttribute("width", "14");
                    dot.setAttribute("height", "14");
                    dotWrap.appendChild(dot);
                    cBtn.appendChild(dotWrap);
                    const cLbl = el("span", { "data-nav-label": "" });
                    cLbl.textContent = (child.label as string) ?? child.key;
                    cBtn.appendChild(cLbl);
                    const badge = child.badge as string | number | undefined;
                    if (badge != null) {
                        const b = el("span", { "data-nav-badge": "" });
                        if (typeof badge === "string" && isNaN(Number(badge))) b.setAttribute("data-badge-accent", "true");
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

    if (bottom.length) {
        const foot = el("div", { "data-nav-bottom": "" });
        for (const [key, child] of bottom) {
            const b = el("button", { "data-nav-button": "", "data-icon-only": "true" });
            const ic = iconEl(child.icon as string, 15);
            if (ic) b.appendChild(ic);
            b.onclick = () => fire(key);
            foot.appendChild(b);
        }
        root.appendChild(foot);
    }

    container.appendChild(root);
    return root;
}

export function initSafeNavs(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-nav-config]").forEach((host) => {
        if (host.dataset.navMounted) return;
        host.dataset.navMounted = "1";
        const config = JSON.parse(host.dataset.navConfig!) as ConfigBase;
        createSafeNav(host, config);
    });
}