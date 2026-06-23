import { createElement, ChevronDown, Dot, type IconNode } from "lucide";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import * as lucide from "lucide";
import type { ConfigBase } from "../../safecontracts/src/contracts";
import { elAttrs, applyPaintState } from "../utils/util";

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

export function createSafeNav(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;

    const title = metadata.title as string | undefined;
    const subtitle = metadata.subtitle as string | undefined;
    const headerIconName = (metadata.icon as string) ?? "store";
    const accent = metadata.accent as string | undefined;
    const width = metadata.width as number | undefined;

    const expanded = new Set<string>();
    let active = "";

    // Read items from config.children — one way, config declares intent
    const children = Object.entries(config.children ?? {}) as [string, ConfigBase][];
    const groups = children.filter(([, c]) => c.metadata?.section !== "bottom");
    const bottom = children.filter(([, c]) => c.metadata?.section === "bottom");

    // First group starts expanded
    if (groups.length) expanded.add(groups[0][0]);

    const navStyle = (metadata.navStyle as string) ?? "classic";

    const root = elAttrs("div", { "data-component": "nav", "data-nav-style": navStyle, "data-layout": "column" });
    applyPaintState(root, metadata, "nav");
    if (accent) root.setAttribute("data-accent", accent);
    if (width) root.style.setProperty("--nav-width", `${width}px`);

    if (title) {
        const header = elAttrs("div", { "data-nav-header": "" });
        const inner = elAttrs("div", { "data-nav-header-inner": "" });
        const logo = elAttrs("div", { "data-nav-logo": "" });
        const hIcon = iconEl(headerIconName, 13);
        if (hIcon) logo.appendChild(hIcon); else logo.textContent = title.charAt(0).toUpperCase();
        const text = elAttrs("div", { "data-nav-header-text": "" });
        const t = elAttrs("div", { "data-nav-title": "" });
        t.textContent = title;
        text.appendChild(t);
        if (subtitle) {
            const st = elAttrs("div", { "data-nav-subtitle": "" });
            st.textContent = subtitle;
            text.appendChild(st);
        }
        inner.append(logo, text);
        header.appendChild(inner);
        root.appendChild(header);
    }

    const nav = elAttrs("nav", { "data-nav-main": "", "data-layout": "column" });
    root.appendChild(nav);

    const fire = (key: string) => {
        active = key;
        ctx.fire("navigate", { key, value: key });
        render();
    };

    function render() {
        nav.replaceChildren();

        if (navStyle === "grouped") {
            for (const [gKey, group] of groups) {
                const gMeta = group.metadata ?? {};
                const heading = gMeta.sectionHeading as string | undefined;
                if (heading) {
                    const h = elAttrs("div", { "data-nav-section-heading": "" });
                    h.textContent = heading;
                    nav.appendChild(h);
                }
                const isActive = active === gKey;
                const btn = elAttrs("button", { "data-nav-button": "", "data-depth": "0" });
                if (isActive) btn.setAttribute("data-active", "true");
                const ic = iconEl(gMeta.icon as string, 15);
                if (ic) { const s = elAttrs("span", { "data-nav-icon": "" }); s.appendChild(ic); btn.appendChild(s); }
                const lbl = elAttrs("span", { "data-nav-label": "" });
                lbl.textContent = (gMeta.label as string) ?? gKey;
                btn.appendChild(lbl);
                const badge = gMeta.badge as string | number | undefined;
                if (badge != null) {
                    const b = elAttrs("span", { "data-nav-badge": "" });
                    if (typeof badge === "string" && isNaN(Number(badge))) b.setAttribute("data-badge-accent", "true");
                    b.textContent = String(badge);
                    btn.appendChild(b);
                }
                btn.onclick = () => fire(gKey);
                nav.appendChild(btn);
            }
            return;
        }

        // Accordion
        for (const [gKey, group] of groups) {
            const gMeta = group.metadata ?? {};
            const gAccent = gMeta.accent as string | undefined;
            const isExpanded = expanded.has(gKey);
            const kids = Object.entries(group.children ?? {}) as [string, ConfigBase][];

            const wrap = elAttrs("div", { "data-nav-item": "", "data-depth": "0" });
            if (gAccent) wrap.setAttribute("data-accent", gAccent);

            if (kids.length > 0) {
                const btn = elAttrs("button", { "data-nav-button": "", "data-has-children": "true", "data-depth": "0" });
                if (isExpanded) btn.setAttribute("data-expanded", "true");
                const gi = iconEl(gMeta.icon as string, 15);
                if (gi) { const s = elAttrs("span", { "data-nav-icon": "" }); s.appendChild(gi); btn.appendChild(s); }
                const lbl = elAttrs("span", { "data-nav-label": "" });
                lbl.textContent = (gMeta.label as string) ?? gKey;
                btn.appendChild(lbl);
                const chevWrap = elAttrs("span", { "data-nav-chevron": "" });
                const chev = createElement(ChevronDown);
                chev.setAttribute("width", "13"); chev.setAttribute("height", "13");
                chevWrap.appendChild(chev);
                btn.appendChild(chevWrap);
                btn.onclick = () => { isExpanded ? expanded.delete(gKey) : expanded.add(gKey); render(); };
                wrap.appendChild(btn);

                if (isExpanded) {
                    const childWrap = elAttrs("div", { "data-nav-children": "", "data-layout": "column" });
                    for (const [cKey, child] of kids) {
                        const cMeta = child.metadata ?? {};
                        const key = `${gKey}.${cKey}`;
                        const isActive = active === key;
                        const cBtn = elAttrs("button", { "data-nav-button": "", "data-depth": "1" });
                        if (isActive) cBtn.setAttribute("data-active", "true");
                        const dotWrap = elAttrs("span", { "data-nav-dot": "" });
                        const dot = createElement(Dot);
                        dot.setAttribute("width", "14"); dot.setAttribute("height", "14");
                        dotWrap.appendChild(dot);
                        cBtn.appendChild(dotWrap);
                        const cLbl = elAttrs("span", { "data-nav-label": "" });
                        cLbl.textContent = (cMeta.label as string) ?? cKey;
                        cBtn.appendChild(cLbl);
                        const badge = cMeta.badge as string | number | undefined;
                        if (badge != null) {
                            const b = elAttrs("span", { "data-nav-badge": "" });
                            if (typeof badge === "string" && isNaN(Number(badge))) b.setAttribute("data-badge-accent", "true");
                            b.textContent = String(badge);
                            cBtn.appendChild(b);
                        }
                        cBtn.onclick = () => fire(key);
                        childWrap.appendChild(cBtn);
                    }
                    wrap.appendChild(childWrap);
                }
            } else {
                // Leaf item — no children
                const isActive = active === gKey;
                const btn = elAttrs("button", { "data-nav-button": "", "data-depth": "0" });
                if (isActive) btn.setAttribute("data-active", "true");
                const gi = iconEl(gMeta.icon as string, 15);
                if (gi) { const s = elAttrs("span", { "data-nav-icon": "" }); s.appendChild(gi); btn.appendChild(s); }
                const lbl = elAttrs("span", { "data-nav-label": "" });
                lbl.textContent = (gMeta.label as string) ?? gKey;
                btn.appendChild(lbl);
                btn.onclick = () => fire(gKey);
                wrap.appendChild(btn);
            }

            nav.appendChild(wrap);
        }
    }

    render();

    if (bottom.length) {
        const foot = elAttrs("div", { "data-nav-bottom": "", "data-layout": "column" });
        for (const [key, child] of bottom) {
            const cMeta = child.metadata ?? {};
            const b = elAttrs("button", { "data-nav-button": "", "data-icon-only": "true" });
            const ic = iconEl(cMeta.icon as string, 15);
            if (ic) b.appendChild(ic);
            b.onclick = () => fire(key);
            foot.appendChild(b);
        }
        root.appendChild(foot);
    }

    container.appendChild(root);
    return root;
}
