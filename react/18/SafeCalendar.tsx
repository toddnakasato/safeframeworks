import { useState } from "react";
import { fireCalendar } from "safecontracts";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { MONTH_NAMES } from "safecontracts";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface SafeCalendarProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES_NARROW = ["SU", "M", "TU", "W", "TH", "F", "SA"];

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

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

function shiftDays(names: string[], weekStart: string): string[] {
  if (weekStart === "monday") return [...names.slice(1), names[0]];
  return names;
}

function shiftFirstDay(firstDay: number, weekStart: string): number {
  if (weekStart === "monday") return (firstDay + 6) % 7;
  return firstDay;
}

function generateDays(year: number, month: number, weekStart: string): (number | null)[] {
  const total = getDaysInMonth(year, month);
  const first = shiftFirstDay(getFirstDayOfMonth(year, month), weekStart);
  const days: (number | null)[] = [];
  for (let i = 0; i < first; i++) days.push(null);
  for (let d = 1; d <= total; d++) days.push(d);
  return days;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

interface MonthGridProps {
  year: number;
  month: number;
  size: string;
  showNav: boolean;
  highlightToday: boolean;
  weekStart: string;
  dayFormat: string;
  onNavigate?: (dir: number) => void;
  onSelect?: (year: number, month: number, day: number) => void;
}

function MonthGrid({
  year, month, size, showNav, highlightToday, weekStart, dayFormat, onNavigate, onSelect,
}: MonthGridProps) {
  const [todayY, todayM, todayD] = todayTuple();
  const days = generateDays(year, month, weekStart);
  const dayNames = shiftDays(dayFormat === "narrow" ? DAY_NAMES_NARROW : DAY_NAMES_SHORT, weekStart);

  return (
    <div data-component="calendar" data-variant="grid" data-size={size}>
      <div data-role="calendar-header">
        {showNav && (
          <button data-role="calendar-nav" data-dir="prev" onClick={() => onNavigate?.(-1)}>
            ‹
          </button>
        )}
        <span data-role="calendar-title">
          {MONTH_NAMES[month]} {year}
        </span>
        {showNav && (
          <button data-role="calendar-nav" data-dir="next" onClick={() => onNavigate?.(1)}>
            ›
          </button>
        )}
      </div>

      <div data-role="calendar-grid">
        {dayNames.map((name) => (
          <div key={name} data-role="calendar-day-name">{name}</div>
        ))}
        {days.map((day, i) => {
          const isToday = highlightToday && day !== null && year === todayY && month === todayM && day === todayD;
          return (
            <div
              key={i}
              data-role="calendar-cell"
              data-empty={day === null || undefined}
              data-today={isToday || undefined}
              data-weekend={day !== null && ((i % 7 === 0) || (i % 7 === 6)) ? true : undefined}
              onClick={day !== null ? () => onSelect?.(year, month, day) : undefined}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface FlatMonthProps {
  year: number;
  month: number;
  highlightToday: boolean;
  weekStart: string;
  onSelect?: (year: number, month: number, day: number) => void;
}

function FlatMonth({ year, month, highlightToday, weekStart, onSelect }: FlatMonthProps) {
  const [todayY, todayM, todayD] = todayTuple();
  const days = generateDays(year, month, weekStart);

  return (
    <div data-role="calendar-flat-month">
      <div data-role="calendar-flat-label">{MONTH_NAMES[month]}</div>
      <div data-role="calendar-flat-days">
        {days.map((day, i) => {
          const isToday = highlightToday && day !== null && year === todayY && month === todayM && day === todayD;
          return (
            <div
              key={i}
              data-role="calendar-flat-cell"
              data-empty={day === null || undefined}
              data-today={isToday || undefined}
              onClick={day !== null ? () => onSelect?.(year, month, day) : undefined}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FlatDayHeaders(props: { weekStart: string; maxCells: number }) {
  const names = shiftDays(DAY_NAMES_NARROW, props.weekStart);
  return (
    <div data-role="calendar-flat-header">
      <div data-role="calendar-flat-label" />
      <div data-role="calendar-flat-days">
        {Array.from({ length: props.maxCells }, (_, i) => (
          <div key={i} data-role="calendar-flat-day-name">{names[i % 7]}</div>
        ))}
      </div>
    </div>
  );
}

export function SafeCalendar({ config, onEvent }: SafeCalendarProps) {
  const { metadata } = config;
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

  const [viewYear, setViewYear] = useState(cfgYear);
  const [viewMonth, setViewMonth] = useState(cfgMonth);

  const fireNavigate = (dir: number) => {
    const d = new Date(viewYear, viewMonth + dir, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
    fireCalendar(onEvent, "navigate", {
      year: d.getFullYear(), month: d.getMonth(), direction: dir,
    });
  };

  const fireSelect = (y: number, m: number, d: number) => {
    fireCalendar(onEvent, "select", { year: y, month: m, day: d });
  };

  if (variant === "grid") {
    return (
      <MonthGrid
        year={viewYear} month={viewMonth} size={size}
        showNav={showNav} highlightToday={highlightToday}
        weekStart={weekStart} dayFormat={dayFormat}
        onNavigate={fireNavigate} onSelect={fireSelect}
      />
    );
  }

  if (variant === "year") {
    return (
      <div data-component="calendar" data-variant="year">
        {Array.from({ length: 12 }, (_, i) => (
          <MonthGrid
            key={i}
            year={cfgYear} month={i} size="sm"
            showNav={false} highlightToday={highlightToday}
            weekStart={weekStart} dayFormat="narrow"
            onSelect={fireSelect}
          />
        ))}
      </div>
    );
  }

  if (variant === "comparison") {
    const months: { year: number; month: number; label: string; current: boolean }[] = [];
    for (let offset = -compareMonths; offset <= 0; offset++) {
      const d = new Date(cfgYear, cfgMonth + offset, 1);
      months.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        label: offset === 0 ? "This Month" : offset === -1 ? "Last Month" : `${Math.abs(offset)} Months Ago`,
        current: offset === 0,
      });
    }
    return (
      <div data-component="calendar" data-variant="comparison">
        {months.map((m) => (
          <div key={`${m.year}-${m.month}`} data-role="calendar-compare-panel" data-current={m.current || undefined}>
            <div data-role="calendar-compare-badge">{m.label}</div>
            <MonthGrid
              year={m.year} month={m.month} size={size}
              showNav={false} highlightToday={highlightToday}
              weekStart={weekStart} dayFormat={dayFormat}
              onSelect={fireSelect}
            />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "flat") {
    return (
      <div data-component="calendar" data-variant="flat">
        <FlatDayHeaders weekStart={weekStart} maxCells={37} />
        {Array.from({ length: 12 }, (_, i) => (
          <FlatMonth
            key={i}
            year={cfgYear} month={i}
            highlightToday={highlightToday} weekStart={weekStart}
            onSelect={fireSelect}
          />
        ))}
      </div>
    );
  }

  if (variant === "flat-quarter") {
    const quarterLabels = ["Q1", "Q2", "Q3", "Q4"];
    const quarterAccents = ["success", "info", "warn", "danger"];
    return (
      <div data-component="calendar" data-variant="flat-quarter">
        <FlatDayHeaders weekStart={weekStart} maxCells={37} />
        {quarters.map((q) => {
          const qi = q - 1;
          const startMonth = qi * 3;
          return (
            <div key={q} data-role="calendar-quarter" data-accent={quarterAccents[qi]}>
              <div data-role="calendar-quarter-badge">{quarterLabels[qi]}</div>
              {Array.from({ length: 3 }, (_, i) => (
                <FlatMonth
                  key={startMonth + i}
                  year={cfgYear} month={startMonth + i}
                  highlightToday={highlightToday} weekStart={weekStart}
                  onSelect={fireSelect}
                />
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div data-component="calendar" data-variant={variant}>
      Unknown calendar variant: {variant}
    </div>
  );
}
