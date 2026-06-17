import type { ConfigBase } from "../../safecontracts/src/contracts";
import { el, applyIntent } from "../utils/util";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import { DAY_NAMES_SHORT, MONTH_NAMES } from "../../safecontracts/src/contracts";

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

function getWeekStart(date: Date, offset: number, weekStart: string): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + offset * 7);
    const day = d.getDay();
    if (weekStart === "monday") d.setDate(d.getDate() - ((day + 6) % 7));
    else d.setDate(d.getDate() - day);
    return d;
}

function getWeekDates(start: Date, numDays: number): Date[] {
    const dates: Date[] = [];
    for (let i = 0; i < numDays; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        dates.push(d);
    }
    return dates;
}

function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isWeekend(date: Date): boolean {
    const d = date.getDay();
    return d === 0 || d === 6;
}

function formatHour(h: number): string {
    if (h === 0) return "12:00 AM";
    if (h < 12) return `${h}:00 AM`;
    if (h === 12) return "12:00 PM";
    return `${h - 12}:00 PM`;
}

function formatDateRange(dates: Date[]): string {
    if (!dates.length) return "";
    const s = dates[0];
    const e = dates[dates.length - 1];
    if (s.getMonth() === e.getMonth()) {
        return `${MONTH_NAMES[s.getMonth()]} ${s.getDate()}-${e.getDate()}, ${s.getFullYear()}`;
    }
    return `${MONTH_NAMES[s.getMonth()]} ${s.getDate()} - ${MONTH_NAMES[e.getMonth()]} ${e.getDate()}, ${s.getFullYear()}`;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

export function createSafeWeek(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
    const metadata = config.metadata;
    const variant = (metadata.variant as string) ?? "full";
    const showNav = metadata.showNavigation !== false;
    const highlightToday = metadata.highlightToday !== false;
    const weekStart = (metadata.weekStart as string) ?? "sunday";
    const startHour = (metadata.startHour as number) ?? 8;
    const endHour = (metadata.endHour as number) ?? 18;
    const slotHeight = (metadata.slotHeight as number) ?? 60;

    const today = new Date();
    const displayToday = highlightToday ? today : new Date(0);
    let offset = 0;

    const root = el("div");
    root.setAttribute("data-component", "week");
    applyIntent(root, metadata);
    root.setAttribute("data-variant", variant);

    const fireNavigate = (dir: number) => {
        offset += dir;
        ctx.fire("navigate", { direction: dir });
        render();
    };

    const fireSelect = (date: Date, hour: number) => {
        ctx.fire("select", { date: date.toISOString().split("T")[0], hour });
    };

    function buildGrid(dates: Date[]): HTMLElement {
        const wrapper = el("div", "week-grid-wrapper");

        if (showNav) {
            const nav = el("div", "week-nav");
            const prev = el("button", "week-nav-btn", "‹ Previous Week");
            prev.setAttribute("data-dir", "prev");
            prev.onclick = () => fireNavigate(-1);
            const title = el("span", "week-nav-title", formatDateRange(dates));
            const next = el("button", "week-nav-btn", "Next Week ›");
            next.setAttribute("data-dir", "next");
            next.onclick = () => fireNavigate(1);
            nav.append(prev, title, next);
            wrapper.appendChild(nav);
        }

        const grid = el("div", "week-grid");
        grid.style.gridTemplateColumns = `auto repeat(${dates.length}, 1fr)`;
        grid.appendChild(el("div", "week-corner"));

        for (const date of dates) {
            const h = el("div", "week-day-header");
            if (isSameDay(date, displayToday)) h.setAttribute("data-today", "true");
            if (isWeekend(date)) h.setAttribute("data-weekend", "true");
            h.appendChild(el("span", "week-day-name", DAY_NAMES_SHORT[date.getDay()]));
            h.appendChild(el("span", "week-day-num", String(date.getDate())));
            grid.appendChild(h);
        }

        for (let hr = startHour; hr <= endHour; hr++) {
            grid.appendChild(el("div", "week-time-label", formatHour(hr)));
            for (const date of dates) {
                const cell = el("div", "week-cell");
                if (isWeekend(date)) cell.setAttribute("data-weekend", "true");
                cell.style.minHeight = `${slotHeight}px`;
                cell.onclick = () => fireSelect(date, hr);
                grid.appendChild(cell);
            }
        }

        wrapper.appendChild(grid);
        return wrapper;
    }

    function buildMini(dates: Date[], label: string, dir: number): HTMLElement {
        const mini = el("div", "week-mini");
        mini.onclick = () => fireNavigate(dir);
        mini.appendChild(el("div", "week-mini-label", label));
        mini.appendChild(el("div", "week-mini-range", formatDateRange(dates)));
        const grid = el("div", "week-mini-grid");
        for (const date of dates) {
            const day = el("div", "week-mini-day");
            if (isSameDay(date, displayToday)) day.setAttribute("data-today", "true");
            if (isWeekend(date)) day.setAttribute("data-weekend", "true");
            day.appendChild(el("div", "week-mini-day-name", DAY_NAMES_SHORT[date.getDay()]));
            day.appendChild(el("div", "week-mini-day-num", String(date.getDate())));
            grid.appendChild(day);
        }
        mini.appendChild(grid);
        return mini;
    }

    function render() {
        root.replaceChildren();
        const numDays = variant === "workweek" ? 5 : 7;
        const ws = variant === "workweek"
            ? getWeekStart(today, offset, "monday")
            : getWeekStart(today, offset, weekStart);
        const dates = getWeekDates(ws, numDays);

        root.appendChild(buildGrid(dates));

        if (variant === "full-with-preview") {
            const prevDates = getWeekDates(getWeekStart(today, offset - 1, weekStart), 7);
            const nextDates = getWeekDates(getWeekStart(today, offset + 1, weekStart), 7);
            const previews = el("div", "week-previews");
            previews.appendChild(buildMini(prevDates, "Last Week", -1));
            previews.appendChild(buildMini(nextDates, "Next Week", 1));
            root.appendChild(previews);
        }
    }
    render();

    container.appendChild(root);
    return root;
}

export function initSafeWeeks(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-week-config]").forEach((host) => {
        if (host.dataset.weekMounted) return;
        host.dataset.weekMounted = "1";
        const config = JSON.parse(host.dataset.weekConfig!) as ConfigBase;
        createSafeWeek(host, config);
    });
}