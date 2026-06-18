import type { ConfigBase, OnSafeEvent } from "../../safecontracts/src/contracts";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import { elAttrs, applyPaintState, applyIntent } from "../utils/util";
import type { RenderChild } from "./layout";

/*----------------------------------------------------------------------------------------------------
 *
 * Briefing — vertical dashboard panel. Composes existing components
 * via renderChild. Each section in config.children is rendered by its
 * own builder (list, calendar, callout, etc.).
 *
 * Layout: header (title + date), scrollable body of sections, chat bar.
 * Based on jitui BriefingPanel.
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
    const showDate = metadata.showDate !== false;
    const showChat = metadata.showChat !== false;
    const children = config.children ?? {};

    const root = elAttrs("div", { "data-component": "briefing" });
    applyIntent(root, metadata);
    applyPaintState(root, metadata, "briefing");

    /* ---- Header ---- */
    const header = elAttrs("div", { "data-role": "header" });
    const headerTitle = elAttrs("span", { "data-role": "header-title" });
    headerTitle.textContent = title;
    header.appendChild(headerTitle);
    if (showDate) {
        const headerDate = elAttrs("span", { "data-role": "header-date" });
        headerDate.textContent = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
        header.appendChild(headerDate);
    }
    root.appendChild(header);

    /* ---- Body: scrollable sections ---- */
    const body = elAttrs("div", { "data-role": "body" });

    // Sort children by metadata.order
    const sortedKeys = Object.keys(children).sort((a, b) => {
        const orderA = (children[a]?.metadata?.order as number) ?? 99;
        const orderB = (children[b]?.metadata?.order as number) ?? 99;
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
        const sectionIcon = (childMeta.icon as string) ?? "";
        const sectionTitle = (childMeta.title as string) ?? key;

        const section = elAttrs("div", { "data-role": "section", "data-section": sectionType });

        /* Section header */
        const sectionHeader = elAttrs("div", { "data-role": "section-header" });
        sectionHeader.onclick = () => ctx.fire("select", { section: sectionType });

        if (sectionIcon) {
            const iconEl = elAttrs("span", { "data-role": "section-icon" });
            iconEl.textContent = sectionIcon;
            sectionHeader.appendChild(iconEl);
        }

        const titleEl = elAttrs("span", { "data-role": "section-title" });
        titleEl.textContent = sectionTitle;
        sectionHeader.appendChild(titleEl);

        /* Count badge — show data length if available */
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

        /* Section content — metrics get a special grid, others use renderChild */
        const content = elAttrs("div", { "data-role": "section-content" });

        if (sectionType === "metrics") {
            // Metrics render as a grid of cards instead of delegating to a single builder
            const grid = elAttrs("div", { "data-role": "metrics-grid" });
            const metricsData = (childData ? (Object.values(childData)[0] as any)?.inline : null) ?? [];
            if (Array.isArray(metricsData)) {
                for (const m of metricsData) {
                    const card = elAttrs("div", { "data-role": "metric-card" });
                    card.onclick = () => ctx.fire("select", { section: "metrics", id: m.target ?? m.label ?? "" });
                    const val = elAttrs("div", { "data-role": "metric-value" });
                    val.textContent = String(m.value ?? "");
                    card.appendChild(val);
                    const lbl = elAttrs("div", { "data-role": "metric-label" });
                    lbl.textContent = String(m.label ?? "");
                    card.appendChild(lbl);
                    grid.appendChild(card);
                }
            }
            content.appendChild(grid);
        } else if (renderChild) {
            // Delegate to the child's own builder
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
