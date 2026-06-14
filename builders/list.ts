import { createElement, type IconNode } from "lucide";
import { el } from "./util";
import { fireList } from "../../safecontracts/src/contracts-emit";
import { getDataSource } from "../../safecontracts/src/contracts";
import * as lucide from "lucide";
import type { ConfigBase, OnSafeEvent } from "../../safecontracts/src/contracts";
import { DAY_NAMES_SHORT } from "../../safecontracts/src/contracts";
import { LIST_DEFAULTS, LIST_STATUS_ACCENTS } from "../../safecontracts/src/components/list";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

interface PagerState { page: number; }

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

function iconGlyph(name: string | undefined, size: number): Node | null {
    if (!name) return null;
    const node = iconNode(name);
    if (!node) return document.createTextNode(name);
    const svg = createElement(node);
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    return svg;
}

function fieldOf(meta: Record<string, unknown>, key: string, fallback: string): string {
    return (meta[key] as string) ?? fallback;
}

function makePager(state: PagerState, count: number, pageSize: number, onEvent: OnSafeEvent | undefined, rerender: () => void, instanceId?: string) {
    const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(count / pageSize)) : 1;
    const page = Math.min(state.page, totalPages);
    const slice = <T,>(items: T[]): T[] =>
        pageSize > 0 ? items.slice((page - 1) * pageSize, page * pageSize) : items;
    const go = (p: number) => {
        const next = Math.max(1, Math.min(totalPages, p));
        state.page = next;
        fireList(onEvent, "page", { page: next, totalPages }, { instanceId });
        rerender();
    };
    return { page, totalPages, slice, go };
}

function buildPager(page: number, totalPages: number, numbers: boolean, go: (p: number) => void): HTMLElement | null {
    if (totalPages <= 1) return null;
    const bar = el("div", "list-pager");
    const prev = el("button", "pager-btn", "‹ Previous");
    prev.setAttribute("data-dir", "prev");
    if (page <= 1) {
        (prev as HTMLButtonElement).disabled = true;
        prev.setAttribute("data-disabled", "true");
    }
    prev.onclick = () => go(page - 1);
    bar.appendChild(prev);
    if (numbers) {
        for (let p = 1; p <= totalPages; p++) {
            const num = el("button", "pager-num", String(p));
            if (p === page) num.setAttribute("data-active", "true");
            num.onclick = () => go(p);
            bar.appendChild(num);
        }
    } else {
        bar.appendChild(el("span", "pager-info", `${page} / ${totalPages}`));
    }
    const next = el("button", "pager-btn", "Next ›");
    next.setAttribute("data-dir", "next");
    if (page >= totalPages) {
        (next as HTMLButtonElement).disabled = true;
        next.setAttribute("data-disabled", "true");
    }
    next.onclick = () => go(page + 1);
    bar.appendChild(next);
    return bar;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

function buildSimple(root: HTMLElement, config: ConfigBase, data: any[], onEvent?: OnSafeEvent): void {
    const instanceId = config.metadata?.name as string | undefined;
    const meta = config.metadata;
    const direction = (meta.direction as string) ?? LIST_DEFAULTS.direction;
    const labelField = fieldOf(meta, "labelField", "label");
    const iconField = fieldOf(meta, "iconField", "icon");
    const descriptionField = fieldOf(meta, "descriptionField", "description");
    const withIcons = (meta.variant as string) === "icon";
    const pageSize = (meta.pageSize as number) ?? LIST_DEFAULTS.pageSize;
    const numbers = meta.pageNumbers !== false;
    const state: PagerState = { page: 1 };

    root.setAttribute("data-variant", withIcons ? "icon" : "simple");
    root.setAttribute("data-direction", direction);

    function render() {
        root.replaceChildren();
        const { page, totalPages, slice, go } = makePager(state, data.length, pageSize, onEvent, render, instanceId);
        const items = el("div", "list-items");
        slice(data).forEach((item, i) => {
            const label = typeof item === "string" ? item : item[labelField];
            const description = typeof item === "object" ? item[descriptionField] : undefined;
            const icon = typeof item === "object" ? item[iconField] : undefined;
            const row = el("div", "list-item");
            row.tabIndex = 0;
            row.setAttribute("role", "listitem");
            row.onclick = () => fireList(onEvent, "select", { index: i, label, item }, { instanceId });
            if (withIcons && icon) {
                const ic = el("span", "item-icon");
                const g = iconGlyph(icon, 16);
                if (g) ic.appendChild(g);
                row.appendChild(ic);
            }
            const body = el("span", "item-body");
            body.appendChild(el("span", "item-label", String(label ?? "")));
            if (description) body.appendChild(el("span", "item-description", String(description)));
            row.appendChild(body);
            items.appendChild(row);
        });
        root.appendChild(items);
        const pager = buildPager(page, totalPages, numbers, go);
        if (pager) root.appendChild(pager);
    }
    render();
}

function buildSelection(root: HTMLElement, config: ConfigBase, data: any[], onEvent?: OnSafeEvent): void {
    const instanceId = config.metadata?.name as string | undefined;
    const meta = config.metadata;
    const mode = (meta.selectionMode as string) ?? LIST_DEFAULTS.selectionMode;
    const labelField = fieldOf(meta, "labelField", "label");
    const descriptionField = fieldOf(meta, "descriptionField", "description");
    let single: number | null = null;
    const multi = new Set<number>();

    root.setAttribute("data-variant", "selection");
    root.setAttribute("data-selection-mode", mode);

    const isSelected = (i: number) => (mode === "single" ? single === i : multi.has(i));

    const toggle = (i: number, item: any) => {
        if (mode === "single") {
            single = i;
            fireList(onEvent, "select", { index: i, item }, { instanceId });
        } else {
            if (multi.has(i)) multi.delete(i); else multi.add(i);
            fireList(onEvent, "toggle", { index: i, selected: multi.has(i), item }, { instanceId });
        }
        render();
    };

    function render() {
        root.replaceChildren();
        const items = el("div", "list-items");
        data.forEach((item, i) => {
            const row = el("div", "list-item");
            if (isSelected(i)) row.setAttribute("data-selected", "true");
            row.tabIndex = 0;
            row.setAttribute("role", mode === "single" ? "radio" : "checkbox");
            row.setAttribute("aria-checked", String(isSelected(i)));
            row.onclick = () => toggle(i, item);
            const control = el("span", "item-control");
            if (isSelected(i)) control.setAttribute("data-checked", "true");
            if (mode === "multiple" && isSelected(i)) control.textContent = "✓";
            row.appendChild(control);
            const body = el("span", "item-body");
            body.appendChild(el("span", "item-label", String(item[labelField] ?? "")));
            if (item[descriptionField]) body.appendChild(el("span", "item-description", String(item[descriptionField])));
            row.appendChild(body);
            items.appendChild(row);
        });
        root.appendChild(items);
    }
    render();
}

function buildColumns(root: HTMLElement, config: ConfigBase, data: any[], onEvent?: OnSafeEvent): void {
    const instanceId = config.metadata?.name as string | undefined;
    const meta = config.metadata;
    const schema = getDataSource(config)?.schema;
    const fields = (schema?.fields ?? []) as any[];
    const pageSize = (meta.pageSize as number) ?? LIST_DEFAULTS.pageSize;
    const numbers = meta.pageNumbers !== false;
    const state: PagerState = { page: 1 };

    root.setAttribute("data-variant", "columns");

    function render() {
        root.replaceChildren();
        const { page, totalPages, slice, go } = makePager(state, data.length, pageSize, onEvent, render, instanceId);
        const header = el("div", "list-header");
        header.style.gridTemplateColumns = `repeat(${fields.length}, 1fr)`;
        for (const f of fields) header.appendChild(el("span", "header-cell", String(f.label ?? f.name)));
        root.appendChild(header);
        const items = el("div", "list-items");
        slice(data).forEach((item, i) => {
            const row = el("div", "list-item");
            row.style.gridTemplateColumns = `repeat(${fields.length}, 1fr)`;
            row.tabIndex = 0;
            row.setAttribute("role", "listitem");
            row.onclick = () => fireList(onEvent, "select", { index: i, item }, { instanceId });
            for (const f of fields) row.appendChild(el("span", "item-cell", String(item[f.name] ?? "")));
            items.appendChild(row);
        });
        root.appendChild(items);
        const pager = buildPager(page, totalPages, numbers, go);
        if (pager) root.appendChild(pager);
    }
    render();
}

function buildFiles(root: HTMLElement, config: ConfigBase, data: any[], onEvent?: OnSafeEvent): void {
    const instanceId = config.metadata?.name as string | undefined;
    const meta = config.metadata;
    const labelField = fieldOf(meta, "labelField", "name");
    const iconField = fieldOf(meta, "iconField", "icon");
    const pageSize = (meta.pageSize as number) ?? LIST_DEFAULTS.pageSize;
    const numbers = meta.pageNumbers !== false;
    const state: PagerState = { page: 1 };

    root.setAttribute("data-variant", "files");

    function render() {
        root.replaceChildren();
        const { page, totalPages, slice, go } = makePager(state, data.length, pageSize, onEvent, render, instanceId);
        const items = el("div", "list-items");
        slice(data).forEach((item, i) => {
            const row = el("div", "list-item");
            if (item.type != null) row.setAttribute("data-file-type", String(item.type));
            row.tabIndex = 0;
            row.setAttribute("role", "listitem");
            row.onclick = () => fireList(onEvent, "select", { index: i, item }, { instanceId });
            const ic = el("span", "item-icon");
            const g = iconGlyph(item[iconField], 18);
            if (g) ic.appendChild(g);
            row.appendChild(ic);
            const body = el("span", "item-body");
            body.appendChild(el("span", "item-label", String(item[labelField] ?? "")));
            body.appendChild(el("span", "item-meta", String(item.size ?? "")));
            row.appendChild(body);
            row.appendChild(el("span", "item-time", String(item.modified ?? "")));
            items.appendChild(row);
        });
        root.appendChild(items);
        const pager = buildPager(page, totalPages, numbers, go);
        if (pager) root.appendChild(pager);
    }
    render();
}

function buildActions(root: HTMLElement, config: ConfigBase, data: any[], onEvent?: OnSafeEvent): void {
    const instanceId = config.metadata?.name as string | undefined;
    const meta = config.metadata;
    const labelField = fieldOf(meta, "labelField", "title");
    const iconField = fieldOf(meta, "iconField", "icon");
    const statusField = fieldOf(meta, "statusField", "status");
    const timeField = fieldOf(meta, "timeField", "time");
    const actionField = fieldOf(meta, "actionField", "action");

    root.setAttribute("data-variant", "actions");
    const overrides = Object.fromEntries(
        Object.entries((meta.statusAccents as Record<string, string>) ?? {}).map(([k, v]) => [k.toLowerCase(), v]),
    );
    const statusAccents: Record<string, string> = { ...LIST_STATUS_ACCENTS, ...overrides };

    const items = el("div", "list-items");
    data.forEach((item, i) => {
        const status = item[statusField] as string | undefined;
        const intent = status ? statusAccents[status.toLowerCase()] ?? "neutral" : undefined;
        const row = el("div", "list-item");
        row.tabIndex = 0;
        row.setAttribute("role", "listitem");
        const ic = el("span", "item-icon");
        const g = iconGlyph(item[iconField], 18);
        if (g) ic.appendChild(g);
        row.appendChild(ic);
        const body = el("span", "item-body");
        body.appendChild(el("span", "item-label", String(item[labelField] ?? "")));
        body.appendChild(el("span", "item-meta", String(item[timeField] ?? "")));
        row.appendChild(body);
        if (status) {
            const badge = el("span", "item-badge", status);
            if (intent) badge.setAttribute("data-accent", intent);
            row.appendChild(badge);
        }
        if (item[actionField]) {
            const btn = el("button", "item-action", String(item[actionField]));
            btn.onclick = (e) => {
                e.stopPropagation();
                fireList(onEvent, "action", { index: i, action: item[actionField], item }, { instanceId });
            };
            row.appendChild(btn);
        }
        items.appendChild(row);
    });
    root.appendChild(items);
}

function flattenTree(nodes: any[], expanded: Set<string>, level = 0): any[] {
    const out: any[] = [];
    for (const node of nodes) {
        out.push({ ...node, level });
        if (node.children && expanded.has(String(node.id))) {
            out.push(...flattenTree(node.children, expanded, level + 1));
        }
    }
    return out;
}

function collectGroupIds(nodes: any[]): string[] {
    const out: string[] = [];
    for (const n of nodes) {
        if (n.children?.length) {
            out.push(String(n.id));
            out.push(...collectGroupIds(n.children));
        }
    }
    return out;
}

function buildHierarchy(root: HTMLElement, config: ConfigBase, data: any[], onEvent?: OnSafeEvent): void {
    const instanceId = config.metadata?.name as string | undefined;
    const meta = config.metadata;
    const labelField = fieldOf(meta, "labelField", "name");
    const iconField = fieldOf(meta, "iconField", "icon");
    const countField = fieldOf(meta, "countField", "count");
    const pageSize = (meta.pageSize as number) ?? LIST_DEFAULTS.pageSize;
    const numbers = meta.pageNumbers !== false;
    const expanded = new Set<string>(collectGroupIds(data).slice(0, 3));
    const state: PagerState = { page: 1 };

    root.setAttribute("data-variant", "hierarchy");

    const toggleNode = (id: string) => {
        if (expanded.has(id)) expanded.delete(id); else expanded.add(id);
        fireList(onEvent, "expand", { id, expanded: expanded.has(id) }, { instanceId });
        render();
    };

    function render() {
        root.replaceChildren();
        const flat = flattenTree(data, expanded);
        const { page, totalPages, slice, go } = makePager(state, flat.length, pageSize, onEvent, render, instanceId);
        const items = el("div", "list-items");
        for (const node of slice(flat)) {
            const isGroup = !!node.children?.length;
            const isOpen = expanded.has(String(node.id));
            const row = el("div", "list-item");
            row.setAttribute("data-depth", String(node.level));
            if (isGroup) row.setAttribute("data-group", "true");
            row.style.paddingLeft = `${node.level * 20 + 12}px`;
            row.tabIndex = 0;
            row.setAttribute("role", isGroup ? "button" : "listitem");
            if (isGroup) row.setAttribute("aria-expanded", String(isOpen));
            row.onclick = () => isGroup
                ? toggleNode(String(node.id))
                : fireList(onEvent, "select", { id: node.id, item: node }, { instanceId });
            if (isGroup) {
                const chev = el("span", "item-chevron");
                if (isOpen) chev.setAttribute("data-expanded", "true");
                const g = iconGlyph("chevron-right", 14);
                if (g) chev.appendChild(g);
                row.appendChild(chev);
            } else {
                const chev = el("span", "item-chevron");
                chev.setAttribute("data-leaf", "true");
                row.appendChild(chev);
            }
            const ic = el("span", "item-icon");
            const g = iconGlyph(node[iconField], 16);
            if (g) ic.appendChild(g);
            row.appendChild(ic);
            row.appendChild(el("span", "item-label", String(node[labelField] ?? "")));
            if (node[countField]) row.appendChild(el("span", "item-meta", String(node[countField])));
            items.appendChild(row);
        }
        root.appendChild(items);
        const pager = buildPager(page, totalPages, numbers, go);
        if (pager) root.appendChild(pager);
    }
    render();
}

function buildPropertyGrid(root: HTMLElement, config: ConfigBase, data: any[], onEvent?: OnSafeEvent): void {
    const instanceId = config.metadata?.name as string | undefined;
    const expanded = new Set<string>(
        data.filter((g) => g.children?.length).map((g) => String(g.id)),
    );
    const values: Record<string, unknown> = {};
    const walk = (nodes: any[]) => {
        for (const n of nodes) {
            if (n.children) walk(n.children);
            else if (n.id != null) values[String(n.id)] = n.value ?? "";
        }
    };
    walk(data);

    root.setAttribute("data-variant", "property-grid");

    const toggleGroup = (id: string) => {
        if (expanded.has(id)) expanded.delete(id); else expanded.add(id);
        fireList(onEvent, "expand", { id, expanded: expanded.has(id) }, { instanceId });
        render();
    };

    // Commit without re-render so the edited input/select keeps focus.
    const commit = (id: string, value: unknown) => {
        values[id] = value;
        fireList(onEvent, "change", { id, value }, { instanceId });
    };

    function renderNode(node: any, level: number): HTMLElement {
        if (node.children?.length) {
            const isOpen = expanded.has(String(node.id));
            const group = el("div", "prop-group");
            const header = el("div", "prop-group-header");
            header.tabIndex = 0;
            header.setAttribute("role", "button");
            header.setAttribute("aria-expanded", String(isOpen));
            header.style.paddingLeft = `${level * 20 + 12}px`;
            header.onclick = () => toggleGroup(String(node.id));
            const chev = el("span", "item-chevron");
            if (isOpen) chev.setAttribute("data-expanded", "true");
            const g = iconGlyph("chevron-right", 14);
            if (g) chev.appendChild(g);
            header.appendChild(chev);
            const label = el("span", "item-label", String(node.name ?? ""));
            label.setAttribute("data-level", String(level));
            header.appendChild(label);
            group.appendChild(header);
            if (isOpen) for (const c of node.children) group.appendChild(renderNode(c, level + 1));
            return group;
        }
        const id = String(node.id);
        const options = node.options as string[] | undefined;
        const row = el("div", "prop-row");
        row.style.paddingLeft = `${level * 20 + 12}px`;
        row.appendChild(el("span", "prop-name", String(node.name ?? "")));
        if (options) {
            const select = document.createElement("select");
            select.setAttribute("data-role", "prop-value");
            for (const o of options) {
                const opt = document.createElement("option");
                opt.value = o;
                opt.textContent = o;
                select.appendChild(opt);
            }
            select.value = String(values[id] ?? "");
            select.onchange = () => commit(id, select.value);
            row.appendChild(select);
        } else {
            const input = document.createElement("input");
            input.setAttribute("data-role", "prop-value");
            input.type = typeof node.value === "number" ? "number" : "text";
            input.value = String(values[id] ?? "");
            input.oninput = () => commit(id, typeof node.value === "number" ? Number(input.value) : input.value);
            row.appendChild(input);
        }
        return row;
    }

    function render() {
        root.replaceChildren();
        const items = el("div", "list-items");
        for (const n of data) items.appendChild(renderNode(n, 0));
        root.appendChild(items);
    }
    render();
}

function buildGantt(root: HTMLElement, config: ConfigBase, data: any[], onEvent?: OnSafeEvent): void {
    const instanceId = config.metadata?.name as string | undefined;
    const meta = config.metadata;
    const title = (meta.title as string) ?? LIST_DEFAULTS.ganttTitle;
    const days = (meta.days as number) ?? LIST_DEFAULTS.ganttDays;
    const labelField = fieldOf(meta, "labelField", "label");
    const baseStart = meta.startDate ? new Date(meta.startDate as string) : new Date();
    let offset = 0;

    root.setAttribute("data-variant", "gantt");

    const sameDay = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    const navigate = (dir: number) => {
        offset += dir;
        fireList(onEvent, "navigate", { direction: dir }, { instanceId });
        render();
    };

    const inRange = (item: any, d: Date) => {
        if (!item.start || !item.end) return false;
        const s = new Date(item.start);
        const e = new Date(item.end);
        return d >= new Date(s.getFullYear(), s.getMonth(), s.getDate())
            && d <= new Date(e.getFullYear(), e.getMonth(), e.getDate());
    };

    function render() {
        root.replaceChildren();
        const start = new Date(baseStart);
        start.setDate(start.getDate() + offset * days);
        const dates: Date[] = Array.from({ length: days }, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
        });
        const today = new Date();

        const scroll = el("div", "gantt-scroll");
        const header = el("div", "gantt-header");
        const titleWrap = el("span", "gantt-title");
        const prev = el("button", "gantt-nav", "‹");
        prev.setAttribute("data-dir", "prev");
        prev.onclick = () => navigate(-1);
        const next = el("button", "gantt-nav", "›");
        next.setAttribute("data-dir", "next");
        next.onclick = () => navigate(1);
        titleWrap.appendChild(prev);
        titleWrap.appendChild(el("span", undefined, title));
        titleWrap.appendChild(next);
        header.appendChild(titleWrap);

        const dateRow = el("span", "gantt-dates");
        dateRow.style.gridTemplateColumns = `repeat(${days}, 1fr)`;
        for (const d of dates) {
            const cell = el("span", "gantt-date");
            if (sameDay(d, today)) cell.setAttribute("data-today", "true");
            if (d.getDay() === 0 || d.getDay() === 6) cell.setAttribute("data-weekend", "true");
            cell.appendChild(el("span", "gantt-day-name", DAY_NAMES_SHORT[d.getDay()]));
            cell.appendChild(el("span", "gantt-day-num", String(d.getDate())));
            dateRow.appendChild(cell);
        }
        header.appendChild(dateRow);
        scroll.appendChild(header);

        const items = el("div", "list-items");
        data.forEach((item, i) => {
            const intent = (item.accent as string) ?? "brand";
            const row = el("div", "gantt-row");
            row.onclick = () => fireList(onEvent, "select", { index: i, item }, { instanceId });
            row.appendChild(el("span", "gantt-row-label", String(item[labelField] ?? "")));
            const cells = el("span", "gantt-cells");
            cells.style.gridTemplateColumns = `repeat(${days}, 1fr)`;
            for (const d of dates) {
                const cell = el("span", "gantt-cell");
                const active = inRange(item, d);
                if (active) {
                    cell.setAttribute("data-active", "true");
                    cell.setAttribute("data-accent", intent);
                }
                if (d.getDay() === 0 || d.getDay() === 6) cell.setAttribute("data-weekend", "true");
                cells.appendChild(cell);
            }
            row.appendChild(cells);
            items.appendChild(row);
        });
        scroll.appendChild(items);
        root.appendChild(scroll);
    }
    render();
}

export function createSafeList(container: HTMLElement, config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
    const instanceId = config.metadata?.name as string | undefined;
    const raw = getDataSource(config)?.inline;
    const list: any[] = Array.isArray(raw) ? raw : [];
    const variant = (config.metadata.variant as string) ?? LIST_DEFAULTS.variant;

    const root = el("div");
    root.setAttribute("data-component", "list");
    // Intent tokens -> data-* attributes. Paint lives in safestyles.
    for (const key of ["accent", "surface", "spacing", "density", "radius"] as const) {
        const v = config.metadata[key] as string | undefined;
        if (v) root.setAttribute(`data-${key}`, v);
    }

    switch (variant) {
        case "simple":
        case "icon":
            buildSimple(root, config, list, onEvent);
            break;
        case "selection":
            buildSelection(root, config, list, onEvent);
            break;
        case "columns":
            buildColumns(root, config, list, onEvent);
            break;
        case "files":
            buildFiles(root, config, list, onEvent);
            break;
        case "actions":
            buildActions(root, config, list, onEvent);
            break;
        case "hierarchy":
            buildHierarchy(root, config, list, onEvent);
            break;
        case "property-grid":
            buildPropertyGrid(root, config, list, onEvent);
            break;
        case "gantt":
            buildGantt(root, config, list, onEvent);
            break;
        default:
            root.textContent = `Unknown list variant: ${variant}`;
    }

    container.appendChild(root);
    return root;
}

export function initSafeLists(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-list-config]").forEach((host) => {
        if (host.dataset.listMounted) return;
        host.dataset.listMounted = "1";
        const config = JSON.parse(host.dataset.listConfig!) as ConfigBase;
        createSafeList(host, config);
    });
}
