/**
 * Calendar builder for this renderer's SafeCalendar — config-driven calendar.
 *
 * Framework-agnostic DOM port of the react SafeCalendar:
 *   grid          single month
 *   year          12 months
 *   comparison    side-by-side months
 *   flat          horizontal rows
 *   flat-quarter  grouped by quarter
 *
 * Structure + data-* attributes ONLY — paint lives in safestyles.
 * Date math internal. Events: "navigate" (prev/next), "select" (day click).
 * Same data-role markup as the react JSX implementation, so one stylesheet
 * covers both.
 */
import type { ConfigBase, OnSafeEvent } from "../../../safecontracts/src/contracts";
import { createSafeEvent } from "../../../safecontracts/src/contracts";

/* ------------------------------------------------------------------ */
/*  Date helpers                                                       */
/* ------------------------------------------------------------------ */

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
}

function todayTuple(): [number, number, number] {
    const d = new Date();
    return [d.getFullYear(), d.getMonth(), d.getDate()];
}

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES_NARROW = ["SU", "M", "TU", "W", "TH", "F", "SA"];

function shiftDays(names: string[], weekStart: string): string[] {
    if (weekStart === "monday") return [...names.slice(1), names[0]];
    return names;
}

function shiftFirstDay(firstDay: number, weekStart: string): number {
    if (weekStart === "monday") return (firstDay + 6) % 7;
    return firstDay;
}

/** Generate array: nulls for leading blanks, then day numbers. */
function generateDays(year: number, month: number, weekStart: string): (number | null)[] {
    const total = getDaysInMonth(year, month);
    const first = shiftFirstDay(getFirstDayOfMonth(year, month), weekStart);
    const days: (number | null)[] = [];
    for (let i = 0; i < first; i++) days.push(null);
    for (let d = 1; d <= total; d++) days.push(d);
    return days;
}

function el(tag: string, role?: string, text?: string): HTMLElement {
    const e = document.createElement(tag);
    if (role) e.setAttribute("data-role", role);
    if (text != null) e.textContent = text;
    return e;
}

/** Build the calendar into a container. Returns the root for removal. */
export function createSafeCalendar(container: HTMLElement, config: ConfigBase, onEvent?: OnSafeEvent): HTMLElement {
    const metadata = config.metadata;
    const variant = (metadata.variant as string) ?? "grid";
    const size = (metadata.size as string) ?? "default";
    const showNav = metadata.showNavigation !== false;
    const highlightToday = metadata.highlightToday !== false;
    const weekStart = (metadata.weekStart as string) ?? "sunday";
    const dayFormat = (metadata.dayFormat as string) ?? "short";
    const compareMonths = (metadata.compareMonths as number) ?? 1;
    const quarters = (metadata.quarters as number[]) ?? [1, 2, 3, 4];

    const now = new Date();
    const cfgYear = (metadata.year as number) ?? now.getFullYear();
    const cfgMonth = (metadata.month as number) ?? now.getMonth();

    let viewYear = cfgYear;
    let viewMonth = cfgMonth;

    const root = el("div");
    root.setAttribute("data-component", "calendar");
    root.setAttribute("data-variant", variant);

    const fireNavigate = (dir: number) => {
        const d = new Date(viewYear, viewMonth + dir, 1);
        viewYear = d.getFullYear();
        viewMonth = d.getMonth();
        onEvent?.(createSafeEvent("calendar", "navigate", {
            year: d.getFullYear(), month: d.getMonth(), direction: dir,
        }));
        render();
    };

    const fireSelect = (y: number, m: number, d: number) => {
        onEvent?.(createSafeEvent("calendar", "select", { year: y, month: m, day: d }));
    };

    /* --- sub-builders ------------------------------------------------ */

    function buildMonthGrid(
        year: number, month: number, gridSize: string,
        nav: boolean, gridDayFormat: string,
    ): HTMLElement {
        const [todayY, todayM, todayD] = todayTuple();
        const days = generateDays(year, month, weekStart);
        const dayNames = shiftDays(gridDayFormat === "narrow" ? DAY_NAMES_NARROW : DAY_NAMES_SHORT, weekStart);

        const month_ = el("div");
        month_.setAttribute("data-component", "calendar");
        month_.setAttribute("data-variant", "grid");
        month_.setAttribute("data-size", gridSize);

        const header = el("div", "calendar-header");
        if (nav) {
            const prev = el("button", "calendar-nav", "\u2039");
            prev.setAttribute("data-dir", "prev");
            prev.onclick = () => fireNavigate(-1);
            header.appendChild(prev);
        }
        header.appendChild(el("span", "calendar-title", `${MONTH_NAMES[month]} ${year}`));
        if (nav) {
            const next = el("button", "calendar-nav", "\u203a");
            next.setAttribute("data-dir", "next");
            next.onclick = () => fireNavigate(1);
            header.appendChild(next);
        }
        month_.appendChild(header);

        const grid = el("div", "calendar-grid");
        for (const name of dayNames) grid.appendChild(el("div", "calendar-day-name", name));
        days.forEach((day, i) => {
            const isToday = highlightToday && day !== null && year === todayY && month === todayM && day === todayD;
            const cell = el("div", "calendar-cell", day === null ? "" : String(day));
            if (day === null) cell.setAttribute("data-empty", "true");
            if (isToday) cell.setAttribute("data-today", "true");
            if (day !== null && ((i % 7 === 0) || (i % 7 === 6))) cell.setAttribute("data-weekend", "true");
            if (day !== null) cell.onclick = () => fireSelect(year, month, day);
            grid.appendChild(cell);
        });
        month_.appendChild(grid);
        return month_;
    }

    function buildFlatMonth(year: number, month: number): HTMLElement {
        const [todayY, todayM, todayD] = todayTuple();
        const days = generateDays(year, month, weekStart);

        const row = el("div", "calendar-flat-month");
        row.appendChild(el("div", "calendar-flat-label", MONTH_NAMES[month]));
        const daysEl = el("div", "calendar-flat-days");
        for (const day of days) {
            const isToday = highlightToday && day !== null && year === todayY && month === todayM && day === todayD;
            const cell = el("div", "calendar-flat-cell", day === null ? "" : String(day));
            if (day === null) cell.setAttribute("data-empty", "true");
            if (isToday) cell.setAttribute("data-today", "true");
            if (day !== null) cell.onclick = () => fireSelect(year, month, day);
            daysEl.appendChild(cell);
        }
        row.appendChild(daysEl);
        return row;
    }

    function buildFlatDayHeaders(maxCells: number): HTMLElement {
        const names = shiftDays(DAY_NAMES_NARROW, weekStart);
        const header = el("div", "calendar-flat-header");
        header.appendChild(el("div", "calendar-flat-label"));
        const daysEl = el("div", "calendar-flat-days");
        for (let i = 0; i < maxCells; i++) {
            daysEl.appendChild(el("div", "calendar-flat-day-name", names[i % 7]));
        }
        header.appendChild(daysEl);
        return header;
    }

    /* --- render -------------------------------------------------------- */

    function render() {
        root.replaceChildren();

        /* grid: single month — root IS the month grid */
        if (variant === "grid") {
            root.setAttribute("data-size", size);
            const month_ = buildMonthGrid(viewYear, viewMonth, size, showNav, dayFormat);
            // root itself carries data-component/variant/size; move children up
            while (month_.firstChild) root.appendChild(month_.firstChild);
            return;
        }

        /* year: 12 month grid */
        if (variant === "year") {
            for (let i = 0; i < 12; i++) {
                root.appendChild(buildMonthGrid(cfgYear, i, "sm", false, "narrow"));
            }
            return;
        }

        /* comparison: this month vs previous month(s) */
        if (variant === "comparison") {
            for (let offset = -compareMonths; offset <= 0; offset++) {
                const d = new Date(cfgYear, cfgMonth + offset, 1);
                const label = offset === 0 ? "This Month" : offset === -1 ? "Last Month" : `${Math.abs(offset)} Months Ago`;
                const panel = el("div", "calendar-compare-panel");
                if (offset === 0) panel.setAttribute("data-current", "true");
                panel.appendChild(el("div", "calendar-compare-badge", label));
                panel.appendChild(buildMonthGrid(d.getFullYear(), d.getMonth(), size, false, dayFormat));
                root.appendChild(panel);
            }
            return;
        }

        /* flat: all months horizontal */
        if (variant === "flat") {
            root.appendChild(buildFlatDayHeaders(37));
            for (let i = 0; i < 12; i++) root.appendChild(buildFlatMonth(cfgYear, i));
            return;
        }

        /* flat-quarter: grouped by quarter */
        if (variant === "flat-quarter") {
            const quarterLabels = ["Q1", "Q2", "Q3", "Q4"];
            const quarterAccents = ["success", "info", "warn", "danger"];
            root.appendChild(buildFlatDayHeaders(37));
            for (const q of quarters) {
                const qi = q - 1;
                const startMonth = qi * 3;
                const quarter = el("div", "calendar-quarter");
                quarter.setAttribute("data-accent", quarterAccents[qi]);
                quarter.appendChild(el("div", "calendar-quarter-badge", quarterLabels[qi]));
                for (let i = 0; i < 3; i++) quarter.appendChild(buildFlatMonth(cfgYear, startMonth + i));
                root.appendChild(quarter);
            }
            return;
        }

        /* fallback */
        root.textContent = `Unknown calendar variant: ${variant}`;
    }
    render();

    container.appendChild(root);
    return root;
}

/**
 * Scan-and-mount for server-rendered hosts (Astro): build a calendar in every
 * div[data-calendar-config] not yet mounted.
 */
export function initSafeCalendars(root: Document | HTMLElement = document): void {
    root.querySelectorAll<HTMLElement>("div[data-calendar-config]").forEach((host) => {
        if (host.dataset.calendarMounted) return;
        host.dataset.calendarMounted = "1";
        const config = JSON.parse(host.dataset.calendarConfig!) as ConfigBase;
        createSafeCalendar(host, config);
    });
}
