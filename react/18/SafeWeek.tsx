import { useState } from "react";
import { fireWeek } from "../../builders/emit";
import type { ConfigBase, OnSafeEvent } from "safecontracts";
import { DAY_NAMES_SHORT, MONTH_NAMES } from "safecontracts";

/*----------------------------------------------------------------------------------------------------
 *
 * Properties
 *
 ----------------------------------------------------------------------------------------------------*/

export interface SafeWeekProps {
  config: ConfigBase;
  onEvent?: OnSafeEvent;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Helpers
 *
 ----------------------------------------------------------------------------------------------------*/

function todayDate(): Date { return new Date(); }

function getWeekStart(date: Date, offset: number, weekStart: string): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + offset * 7);
  const day = d.getDay();
  if (weekStart === "monday") {
    d.setDate(d.getDate() - ((day + 6) % 7));
  } else {
    d.setDate(d.getDate() - day);
  }
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

function formatHour(h: number): string {
  if (h === 0) return "12:00 AM";
  if (h < 12) return `${h}:00 AM`;
  if (h === 12) return "12:00 PM";
  return `${h - 12}:00 PM`;
}

function formatDateRange(dates: Date[]): string {
  if (dates.length === 0) return "";
  const s = dates[0];
  const e = dates[dates.length - 1];
  if (s.getMonth() === e.getMonth()) {
    return `${MONTH_NAMES[s.getMonth()]} ${s.getDate()}-${e.getDate()}, ${s.getFullYear()}`;
  }
  return `${MONTH_NAMES[s.getMonth()]} ${s.getDate()} - ${MONTH_NAMES[e.getMonth()]} ${e.getDate()}, ${s.getFullYear()}`;
}

function isWeekend(date: Date): boolean {
  const d = date.getDay();
  return d === 0 || d === 6;
}

/*----------------------------------------------------------------------------------------------------
 *
 * Implementation
 *
 ----------------------------------------------------------------------------------------------------*/

function MiniWeek({
  dates,
  today,
  label,
  onClick,
}: {
  dates: Date[];
  today: Date;
  label: string;
  onClick: () => void;
}) {
  return (
    <div data-role="week-mini" onClick={onClick}>
      <div data-role="week-mini-label">{label}</div>
      <div data-role="week-mini-range">{formatDateRange(dates)}</div>
      <div data-role="week-mini-grid">
        {dates.map((date, i) => (
          <div
            key={i}
            data-role="week-mini-day"
            data-today={isSameDay(date, today) || undefined}
            data-weekend={isWeekend(date) || undefined}
          >
            <div data-role="week-mini-day-name">{DAY_NAMES_SHORT[date.getDay()]}</div>
            <div data-role="week-mini-day-num">{date.getDate()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeekGrid({
  dates,
  today,
  startHour,
  endHour,
  slotHeight,
  showNav,
  onNavigate,
  onSelect,
}: {
  dates: Date[];
  today: Date;
  startHour: number;
  endHour: number;
  slotHeight: number;
  showNav: boolean;
  onNavigate: (dir: number) => void;
  onSelect: (date: Date, hour: number) => void;
}) {
  const hours: number[] = [];
  for (let h = startHour; h <= endHour; h++) hours.push(h);

  return (
    <div data-role="week-grid-wrapper">
      {showNav && (
        <div data-role="week-nav">
          <button data-role="week-nav-btn" data-dir="prev" onClick={() => onNavigate(-1)}>
            ‹ Previous Week
          </button>
          <span data-role="week-nav-title">{formatDateRange(dates)}</span>
          <button data-role="week-nav-btn" data-dir="next" onClick={() => onNavigate(1)}>
            Next Week ›
          </button>
        </div>
      )}

      <div
        data-role="week-grid"
        style={{ gridTemplateColumns: `auto repeat(${dates.length}, 1fr)` }}
      >
        <div data-role="week-corner" />

        {dates.map((date, i) => (
          <div
            key={i}
            data-role="week-day-header"
            data-today={isSameDay(date, today) || undefined}
            data-weekend={isWeekend(date) || undefined}
          >
            <span data-role="week-day-name">{DAY_NAMES_SHORT[date.getDay()]}</span>
            <span data-role="week-day-num">{date.getDate()}</span>
          </div>
        ))}

        {hours.map((h) => (
          <div key={h} data-role="week-time-row" style={{ display: "contents" }}>
            <div data-role="week-time-label">{formatHour(h)}</div>
            {dates.map((date, di) => (
              <div
                key={di}
                data-role="week-cell"
                data-weekend={isWeekend(date) || undefined}
                style={{ minHeight: slotHeight }}
                onClick={() => onSelect(date, h)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SafeWeek({ config, onEvent }: SafeWeekProps) {
  const { metadata } = config;
  const variant = (metadata.variant as string) ?? "full";
  const showNav = metadata.showNavigation !== false;
  const highlightToday = metadata.highlightToday !== false;
  const weekStart = (metadata.weekStart as string) ?? "sunday";
  const startHour = (metadata.startHour as number) ?? 8;
  const endHour = (metadata.endHour as number) ?? 18;
  const slotHeight = (metadata.slotHeight as number) ?? 60;

  const today = todayDate();
  const [offset, setOffset] = useState(0);

  const fireNavigate = (dir: number) => {
    setOffset((o) => o + dir);
    fireWeek(onEvent, "navigate", { direction: dir });
  };

  const fireSelect = (date: Date, hour: number) => {
    fireWeek(onEvent, "select", {
      date: date.toISOString().split("T")[0],
      hour,
    });
  };

  const numDays = variant === "workweek" ? 5 : 7;
  const ws = variant === "workweek"
    ? getWeekStart(today, offset, "monday")
    : getWeekStart(today, offset, weekStart);
  const dates = getWeekDates(ws, numDays);
  const displayToday = highlightToday ? today : new Date(0);

  if (variant === "full-with-preview") {
    const prevDates = getWeekDates(getWeekStart(today, offset - 1, weekStart), 7);
    const nextDates = getWeekDates(getWeekStart(today, offset + 1, weekStart), 7);

    return (
      <div data-component="week" data-variant="full-with-preview">
        <WeekGrid
          dates={dates} today={displayToday}
          startHour={startHour} endHour={endHour} slotHeight={slotHeight}
          showNav={showNav} onNavigate={fireNavigate} onSelect={fireSelect}
        />
        <div data-role="week-previews">
          <MiniWeek dates={prevDates} today={displayToday} label="Last Week" onClick={() => fireNavigate(-1)} />
          <MiniWeek dates={nextDates} today={displayToday} label="Next Week" onClick={() => fireNavigate(1)} />
        </div>
      </div>
    );
  }

  return (
    <div data-component="week" data-variant={variant}>
      <WeekGrid
        dates={dates} today={displayToday}
        startHour={startHour} endHour={endHour} slotHeight={slotHeight}
        showNav={showNav} onNavigate={fireNavigate} onSelect={fireSelect}
      />
    </div>
  );
}
