import type { ConfigBase } from "../../safecontracts/src/contracts";
import { el, applyIntent, readList } from "../utils/util";
import type { SafeFireContext } from "../../safecontracts/src/contracts";
import { MONTH_NAMES } from "../../safecontracts/src/contracts";
import { DAY_NAMES_SHORT, DAY_NAMES_NARROW, getDaysInMonth, getFirstDayOfMonth, todayTuple, shiftDays, shiftFirstDay, generateDays } from "../../safecontracts/src/contracts-date";

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/
export function createSafeCalendar(container: HTMLElement, config: ConfigBase, ctx: SafeFireContext): HTMLElement {
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
    applyIntent(root, metadata);

    const fireNavigate = (dir: number) => {
        const d = new Date(viewYear, viewMonth + dir, 1);
        viewYear = d.getFullYear();
        viewMonth = d.getMonth();
        ctx.fire("navigate", {
            year: d.getFullYear(),
            month: d.getMonth(),
            direction: dir
        });
        render();
    };

    const fireSelect = (y: number, m: number, d: number) => {
        ctx.fire("select", { year: y, month: m, day: d, date: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
    };

    function buildMonthGrid(year: number, month: number, gridSize: string, nav: boolean, gridDayFormat: string): HTMLElement {
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
            if (day !== null && (i % 7 === 0 || i % 7 === 6)) cell.setAttribute("data-weekend", "true");
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

    function render() {
        root.replaceChildren();

        if (variant === "grid") {
            root.setAttribute("data-size", size);
            const month_ = buildMonthGrid(viewYear, viewMonth, size, showNav, dayFormat);
            // root itself carries data-component/variant/size; move children up
            while (month_.firstChild) root.appendChild(month_.firstChild);
            return;
        }

        if (variant === "year") {
            for (let i = 0; i < 12; i++) {
                root.appendChild(buildMonthGrid(cfgYear, i, "sm", false, "narrow"));
            }
            return;
        }

        if (variant === "year-horizontal") {
            root.setAttribute("data-variant", "year-horizontal");
            // Day-of-week header row
            root.appendChild(buildFlatDayHeaders(37));
            // 12 flat month rows — each month is one horizontal line
            for (let i = 0; i < 12; i++) {
                root.appendChild(buildFlatMonth(cfgYear, i));
            }
            return;
        }

        if (variant === "browse") {
            root.setAttribute("data-size", size);
            const month_ = buildMonthGrid(viewYear, viewMonth, size, false, dayFormat);
            while (month_.firstChild) root.appendChild(month_.firstChild);
            // Bottom nav: mini calendar grids for prev/next month, each acts as a button
            const nav = el("div", "calendar-browse-nav");
            const prevDate = new Date(viewYear, viewMonth - 1, 1);
            const nextDate = new Date(viewYear, viewMonth + 1, 1);
            const prevMini = buildMonthGrid(prevDate.getFullYear(), prevDate.getMonth(), "xs", false, "narrow");
            prevMini.setAttribute("data-role", "calendar-browse-mini");
            prevMini.setAttribute("data-dir", "prev");
            prevMini.onclick = () => fireNavigate(-1);
            const nextMini = buildMonthGrid(nextDate.getFullYear(), nextDate.getMonth(), "xs", false, "narrow");
            nextMini.setAttribute("data-role", "calendar-browse-mini");
            nextMini.setAttribute("data-dir", "next");
            nextMini.onclick = () => fireNavigate(1);
            nav.appendChild(prevMini);
            nav.appendChild(nextMini);
            root.appendChild(nav);
            return;
        }

        if (variant === "detail-left" || variant === "detail-right") {
            const events: Record<string, any>[] = readList(config);
            const side = variant === "detail-left" ? "left" : "right";
            let panelCollapsed = false;
            let selectedDate = "";

            const wrapper = el("div", "calendar-detail-wrapper");
            wrapper.setAttribute("data-side", side);

            // Panel
            const panel = el("div", "calendar-detail-panel");
            const panelHeader = el("div", "calendar-detail-panel-header");
            const panelTitle = el("span", "calendar-detail-panel-title", "Select a day");
            const collapseBtn = el("button", "calendar-detail-collapse", "▸");
            collapseBtn.onclick = () => {
                panelCollapsed = !panelCollapsed;
                panel.setAttribute("data-collapsed", String(panelCollapsed));
                collapseBtn.textContent = panelCollapsed ? (side === "left" ? "◂" : "▸") : (side === "left" ? "▸" : "◂");
            };
            panelHeader.appendChild(panelTitle);
            panelHeader.appendChild(collapseBtn);
            panel.appendChild(panelHeader);
            const panelList = el("div", "calendar-detail-panel-list");
            panel.appendChild(panelList);

            // Calendar grid
            const calArea = el("div", "calendar-detail-cal");

            function updatePanel(dateStr: string) {
                selectedDate = dateStr;
                panelTitle.textContent = dateStr || "Select a day";
                panelList.replaceChildren();
                const dayEvents = events.filter(e => e.date === dateStr);
                if (dayEvents.length === 0) {
                    panelList.appendChild(el("div", "calendar-detail-empty", "No items"));
                } else {
                    for (const ev of dayEvents) {
                        const item = el("div", "calendar-detail-item");
                        item.appendChild(el("div", "calendar-detail-item-title", ev.title ?? ev.name ?? ""));
                        if (ev.time) item.appendChild(el("div", "calendar-detail-item-time", ev.time));
                        if (ev.description) item.appendChild(el("div", "calendar-detail-item-desc", ev.description));
                        panelList.appendChild(item);
                    }
                }
            }

            // Wrap fireSelect to also update panel
            const origFire = fireSelect;
            const detailFireSelect = (y: number, m: number, d: number) => {
                origFire(y, m, d);
                updatePanel(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
            };

            calArea.setAttribute("data-size", size);
            // Build grid but override cell clicks to use detailFireSelect
            const month_ = buildMonthGrid(viewYear, viewMonth, size, showNav, dayFormat);
            // Re-wire cell clicks to use detailFireSelect
            month_.querySelectorAll("[data-role='calendar-cell']:not([data-empty])").forEach(cell => {
                const day = parseInt(cell.textContent ?? "0", 10);
                if (day > 0) (cell as HTMLElement).onclick = () => detailFireSelect(viewYear, viewMonth, day);
            });
            while (month_.firstChild) calArea.appendChild(month_.firstChild);

            if (side === "left") {
                wrapper.appendChild(panel);
                wrapper.appendChild(calArea);
            } else {
                wrapper.appendChild(calArea);
                wrapper.appendChild(panel);
            }
            root.appendChild(wrapper);
            return;
        }

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

        if (variant === "flat") {
            root.appendChild(buildFlatDayHeaders(37));
            for (let i = 0; i < 12; i++) root.appendChild(buildFlatMonth(cfgYear, i));
            return;
        }

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

        root.textContent = `Unknown calendar variant: ${variant}`;
    }
    render();

    container.appendChild(root);
    return root;
}
