import type { ConfigBase } from "../../safecontracts/src/contracts";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import { elAttrs, applyPaintState, applyIntent, readList } from "../utils/util";

/*----------------------------------------------------------------------------------------------------
 *
 * Dispatch — news/article feed with tag filters, expandable cards,
 * bookmarks. Based on jitui DispatchPanel.
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeDispatch(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    const title = (metadata.title as string) ?? "Dispatch";
    const headlineField = (metadata.headlineField as string) ?? "headline";
    const teaserField = (metadata.teaserField as string) ?? "teaser";
    const bodyField = (metadata.bodyField as string) ?? "body";
    const tagField = (metadata.tagField as string) ?? "tag";
    const sourceField = (metadata.sourceField as string) ?? "source";
    const dateField = (metadata.dateField as string) ?? "date";
    const readTimeField = (metadata.readTimeField as string) ?? "readTime";

    const data = readList(config);

    const root = elAttrs("div", { "data-component": "dispatch" });
    applyIntent(root, metadata);
    applyPaintState(root, metadata, "dispatch");

    if (data.length === 0) {
        const empty = elAttrs("div", { "data-role": "empty" });
        empty.textContent = "No articles";
        root.appendChild(empty);
        container.appendChild(root);
        return root;
    }

    let expandedId: string | null = null;
    let activeTag: string | null = null;
    const bookmarks = new Set<string>();

    // Extract unique tags
    const allTags = Array.from(new Set(data.map(d => String(d[tagField] ?? ""))));

    /* ---- Header ---- */
    const header = elAttrs("div", { "data-role": "header" });
    const headerTitle = elAttrs("span", { "data-role": "header-title" });
    headerTitle.textContent = title;
    header.appendChild(headerTitle);
    const headerCount = elAttrs("span", { "data-role": "header-count" });
    header.appendChild(headerCount);
    root.appendChild(header);

    /* ---- Filter bar ---- */
    const filterBar = elAttrs("div", { "data-role": "filter-bar" });

    function renderFilters() {
        filterBar.replaceChildren();
        const allBtn = elAttrs("button", { "data-role": "filter-tag" });
        allBtn.textContent = "All";
        if (activeTag === null) allBtn.setAttribute("data-active", "true");
        allBtn.onclick = () => { activeTag = null; ctx.fire("filter", { tag: "" }); renderAll(); };
        filterBar.appendChild(allBtn);
        for (const tag of allTags) {
            const btn = elAttrs("button", { "data-role": "filter-tag", "data-tag": tag });
            btn.textContent = tag;
            if (activeTag === tag) btn.setAttribute("data-active", "true");
            btn.onclick = () => { activeTag = activeTag === tag ? null : tag; ctx.fire("filter", { tag: activeTag ?? "" }); renderAll(); };
            filterBar.appendChild(btn);
        }
    }
    root.appendChild(filterBar);

    /* ---- Body ---- */
    const body = elAttrs("div", { "data-role": "body" });

    function renderArticles() {
        body.replaceChildren();
        const filtered = activeTag ? data.filter(d => String(d[tagField]) === activeTag) : data;
        headerCount.textContent = `${filtered.length} stories`;

        for (const item of filtered) {
            const id = String(item.id ?? item[headlineField] ?? "");
            const isExpanded = expandedId === id;
            const isBookmarked = bookmarks.has(id);

            const article = elAttrs("div", { "data-role": "article" });
            if (isExpanded) article.setAttribute("data-expanded", "true");

            /* Meta line */
            const meta = elAttrs("div", { "data-role": "article-meta" });
            const tag = elAttrs("span", { "data-role": "article-tag" });
            tag.textContent = String(item[tagField] ?? "");
            meta.appendChild(tag);
            const info = elAttrs("span", {});
            info.textContent = `${item[readTimeField] ?? ""} · ${item[sourceField] ?? ""}`;
            meta.appendChild(info);
            article.appendChild(meta);

            /* Headline */
            const headline = elAttrs("div", { "data-role": "article-headline" });
            headline.textContent = String(item[headlineField] ?? "");
            headline.onclick = () => { expandedId = isExpanded ? null : id; ctx.fire("select", { id }); renderAll(); };
            article.appendChild(headline);

            /* Teaser (only when collapsed) */
            if (!isExpanded) {
                const teaser = elAttrs("div", { "data-role": "article-teaser" });
                teaser.textContent = String(item[teaserField] ?? "");
                article.appendChild(teaser);
            }

            /* Body (only when expanded) */
            if (isExpanded) {
                const bodyText = elAttrs("div", { "data-role": "article-body" });
                const text = String(item[bodyField] ?? "");
                for (const para of text.split("\n\n")) {
                    const p = elAttrs("div", {});
                    p.textContent = para;
                    bodyText.appendChild(p);
                }
                article.appendChild(bodyText);

                const footer = elAttrs("div", { "data-role": "article-footer" });
                const bkmBtn = elAttrs("button", { "data-role": "btn-bookmark" });
                bkmBtn.textContent = isBookmarked ? "★ Saved" : "☆ Save";
                if (isBookmarked) bkmBtn.setAttribute("data-bookmarked", "true");
                bkmBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (bookmarks.has(id)) bookmarks.delete(id); else bookmarks.add(id);
                    ctx.fire("bookmark", { id });
                    renderAll();
                };
                footer.appendChild(bkmBtn);

                const dateEl = elAttrs("span", {});
                dateEl.textContent = String(item[dateField] ?? "");
                footer.appendChild(dateEl);
                article.appendChild(footer);
            }

            body.appendChild(article);
        }
    }

    function renderAll() { renderFilters(); renderArticles(); }
    renderAll();

    root.appendChild(body);
    container.appendChild(root);
    return root;
}
