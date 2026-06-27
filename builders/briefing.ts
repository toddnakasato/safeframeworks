import type { ConfigBase, OnSafeEvent } from "../../safecontracts/src/contracts";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import { elAttrs, applyPaintState, applyIntent } from "../utils/util";
import type { RenderChild } from "./layout";

/*----------------------------------------------------------------------------------------------------
 *
 * Briefing — vertical dashboard panel. Composes existing components
 * via renderChild. ConfigBase.children defines sections rendered in order.
 *
 * Every briefing variant (narrative, priority, memo, delta, standup, digest,
 * default, compact) uses the same composition path. The "variant" is expressed
 * in the children configs and their data — not in builder code.
 *
 * Layout: header (subtitle + title + date), scrollable body of sections, chat bar.
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeBriefing(
    container: HTMLElement,
    config: ConfigBase,
    ctx: SafeFireContext,
    renderChild?: RenderChild,
): HTMLElement {
    const metadata = config.metadata;
    const title = (metadata.title as string) ?? "Briefing";
    const subtitle = (metadata.subtitle as string) ?? "";
    const showDate = metadata.showDate !== false;
    const showChat = metadata.showChat === true;
    const panelWidth = (metadata.width as string) ?? "";
    const panelAlign = (metadata.align as string) ?? "";
    const children = config.children ?? {};

    const root = elAttrs("div", { "data-component": "briefing", "data-layout": "column" });
    applyIntent(root, metadata);
    applyPaintState(root, metadata, "briefing");

    if (panelWidth) root.style.width = panelWidth;
    if (panelAlign === "center") { root.style.marginLeft = "auto"; root.style.marginRight = "auto"; }
    else if (panelAlign === "right") { root.style.marginLeft = "auto"; }

    /* ---- Header ---- */
    const header = elAttrs("div", { "data-role": "header" });
    if (subtitle) {
        const headerSub = elAttrs("span", { "data-role": "header-subtitle" });
        headerSub.textContent = subtitle;
        header.appendChild(headerSub);
    }
    const headerTitle = elAttrs("span", { "data-role": "header-title" });
    headerTitle.textContent = title;
    header.appendChild(headerTitle);
    if (showDate || metadata.date) {
        const headerDate = elAttrs("span", { "data-role": "header-date" });
        headerDate.textContent = (metadata.date as string) ??
            new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
        header.appendChild(headerDate);
    }
    root.appendChild(header);

    /* ---- Body: children rendered in order ---- */
    const body = elAttrs("div", { "data-role": "body" });

    const sortedKeys = Object.keys(children).sort((a, b) => {
        const orderA = ((children[a] as any)?.metadata?.order as number) ?? 99;
        const orderB = ((children[b] as any)?.metadata?.order as number) ?? 99;
        return orderA - orderB;
    });

    if (sortedKeys.length === 0) {
        const empty = elAttrs("div", { "data-role": "empty" });
        empty.textContent = "No sections configured";
        body.appendChild(empty);
    }

    for (const key of sortedKeys) {
        const childConfig = children[key] as ConfigBase;
        if (!childConfig || !childConfig.metadata) continue;

        const childMeta = childConfig.metadata;
        const sectionType = (childMeta.section as string) ?? key;
        const sectionTitle = (childMeta.title as string) ?? key;
        const sectionColumns = (childMeta.sectionColumns as string) ?? "";

        // Group consecutive children with the same section into one section
        const existingSection = body.querySelector(`[data-section="${sectionType}"]`) as HTMLElement | null;
        if (existingSection) {
            // Append to existing section content
            const content = existingSection.querySelector("[data-role='section-content']") as HTMLElement;
            if (content && renderChild) {
                const rendered = renderChild(childConfig);
                content.appendChild(rendered);
                // Apply grid via data attribute — safestyles handles layout
                if (sectionColumns && !content.dataset.sectionGrid) {
                    content.setAttribute("data-section-grid", sectionColumns);
                }
            }
            continue;
        }

        const section = elAttrs("div", { "data-role": "section", "data-section": sectionType });

        /* Section header */
        const sectionHeader = elAttrs("div", { "data-role": "section-header" });
        sectionHeader.onclick = () => ctx.fire("select", { section: sectionType });

        if (childMeta.icon) {
            const iconEl = elAttrs("span", { "data-role": "section-icon", "data-icon": String(childMeta.icon) });
            sectionHeader.appendChild(iconEl);
        }

        const titleEl = elAttrs("span", { "data-role": "section-title" });
        titleEl.textContent = sectionTitle;
        sectionHeader.appendChild(titleEl);

        /* Count badge */
        const childData = childConfig.data;
        if (childData) {
            const firstSlot = Object.values(childData)[0] as any;
            const inline = firstSlot?.inline;
            if (Array.isArray(inline) && inline.length > 0) {
                const countEl = elAttrs("span", { "data-role": "section-count" });
                countEl.textContent = String(inline.length);
                sectionHeader.appendChild(countEl);
            }
        }

        section.appendChild(sectionHeader);

        /* Section content — delegate to child builder */
        const content = elAttrs("div", { "data-role": "section-content" });
        if (sectionColumns) {
            content.setAttribute("data-section-grid", sectionColumns);
        }
        if (renderChild) {
            const rendered = renderChild(childConfig);
            content.appendChild(rendered);
        }

        section.appendChild(content);
        body.appendChild(section);
    }

    root.appendChild(body);

    /* ---- Chat bar ---- */
    if (showChat) {
        const chatBar = elAttrs("div", { "data-role": "chat-bar" });
        const chatInput = elAttrs("input", { "data-role": "chat-input" }) as HTMLInputElement;
        chatInput.type = "text";
        chatInput.placeholder = "e.g. 'more leads', 'next month'...";
        chatInput.onkeydown = (e: KeyboardEvent) => {
            if (e.key === "Enter" && chatInput.value.trim()) {
                ctx.fire("send", { text: chatInput.value.trim() });
                chatInput.value = "";
            }
        };
        chatBar.appendChild(chatInput);
        root.appendChild(chatBar);
    }

    container.appendChild(root);
    return root;
}
