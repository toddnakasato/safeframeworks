import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./components/ui/button";
import { useState } from "react";

export default function App() {
  // Get current date (October 9, 2025 - Thursday)
  const today = new Date(2025, 9, 9);
  
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Get the start of the week (Sunday) for a given date
  const getWeekStart = (date: Date, offset: number = 0) => {
    const d = new Date(date);
    d.setDate(d.getDate() + (offset * 7));
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  // Get the start of the work week (Monday) for a given date
  const getWorkWeekStart = (date: Date, offset: number = 0) => {
    const d = new Date(date);
    d.setDate(d.getDate() + (offset * 7));
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    return new Date(d.setDate(diff));
  };

  // Generate array of dates for a week
  const getWeekDates = (startDate: Date, numDays: number) => {
    const dates = [];
    for (let i = 0; i < numDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayNamesShort = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const workDayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const workDayNamesShort = ["MON", "TUE", "WED", "THU", "FRI"];
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const timeSlots = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
  ];

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const getCardStyles = () => {
    return `border-0 backdrop-blur-xl transition-all duration-300 bg-white/70 shadow-2xl`;
  };

  const formatDateRange = (dates: Date[]) => {
    if (dates.length === 0) return "";
    const start = dates[0];
    const end = dates[dates.length - 1];
    
    if (start.getMonth() === end.getMonth()) {
      return `${monthNames[start.getMonth()]} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
    } else {
      return `${monthNames[start.getMonth()]} ${start.getDate()} - ${monthNames[end.getMonth()]} ${end.getDate()}, ${start.getFullYear()}`;
    }
  };

  // Render 7-Day Week Planner
  const render7DayWeek = () => {
    const weekStart = getWeekStart(today, currentWeekOffset);
    const weekDates = getWeekDates(weekStart, 7);

    return (
      <div className="space-y-4">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Week
          </Button>
          <div className="text-center">
            <div className="text-slate-900">{formatDateRange(weekDates)}</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
            className="gap-2"
          >
            Next Week
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-8 gap-2">
          {/* Time column header */}
          <div className="text-slate-500 text-sm p-2"></div>
          
          {/* Day headers */}
          {weekDates.map((date, idx) => (
            <div
              key={idx}
              className={`text-center p-3 rounded-t-lg ${
                isToday(date)
                  ? "bg-blue-500 text-white"
                  : idx === 0 || idx === 6
                    ? "bg-slate-100 text-slate-700"
                    : "bg-slate-50 text-slate-700"
              }`}
            >
              <div className="text-xs uppercase tracking-wide">
                {dayNamesShort[date.getDay()]}
              </div>
              <div className="text-2xl mt-1">{date.getDate()}</div>
            </div>
          ))}

          {/* Time slots */}
          {timeSlots.map((time, timeIdx) => (
            <div key={timeIdx} className="contents">
              {/* Time label */}
              <div className="text-slate-500 text-xs p-2 text-right pr-3 border-t border-slate-200">
                {time}
              </div>
              
              {/* Day cells */}
              {weekDates.map((date, dayIdx) => (
                <div
                  key={dayIdx}
                  className={`min-h-[60px] border-t border-slate-200 p-2 hover:bg-slate-50 transition-colors cursor-pointer ${
                    dayIdx === 0 || dayIdx === 6 ? "bg-slate-50/50" : ""
                  }`}
                >
                  {/* Empty cell for planning */}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render M-F Work Week Planner
  const renderWorkWeek = () => {
    const weekStart = getWorkWeekStart(today, currentWeekOffset);
    const weekDates = getWeekDates(weekStart, 5);

    return (
      <div className="space-y-4">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Week
          </Button>
          <div className="text-center">
            <div className="text-slate-900">{formatDateRange(weekDates)}</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
            className="gap-2"
          >
            Next Week
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-6 gap-2">
          {/* Time column header */}
          <div className="text-slate-500 text-sm p-2"></div>
          
          {/* Day headers */}
          {weekDates.map((date, idx) => (
            <div
              key={idx}
              className={`text-center p-3 rounded-t-lg ${
                isToday(date)
                  ? "bg-blue-500 text-white"
                  : "bg-slate-50 text-slate-700"
              }`}
            >
              <div className="text-xs uppercase tracking-wide">
                {workDayNamesShort[idx]}
              </div>
              <div className="text-2xl mt-1">{date.getDate()}</div>
            </div>
          ))}

          {/* Time slots */}
          {timeSlots.map((time, timeIdx) => (
            <div key={timeIdx} className="contents">
              {/* Time label */}
              <div className="text-slate-500 text-xs p-2 text-right pr-3 border-t border-slate-200">
                {time}
              </div>
              
              {/* Day cells */}
              {weekDates.map((date, dayIdx) => (
                <div
                  key={dayIdx}
                  className="min-h-[60px] border-t border-slate-200 p-2 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {/* Empty cell for planning */}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render miniature week display
  const renderMiniWeek = (offset: number, label: string) => {
    const weekStart = getWeekStart(today, currentWeekOffset + offset);
    const weekDates = getWeekDates(weekStart, 7);

    return (
      <div 
        className="border-2 border-slate-200 rounded-lg p-3 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
        onClick={() => setCurrentWeekOffset(currentWeekOffset + offset)}
      >
        <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">{label}</div>
        <div className="text-sm mb-2 text-slate-700">{formatDateRange(weekDates)}</div>
        <div className="grid grid-cols-7 gap-1">
          {weekDates.map((date, idx) => (
            <div
              key={idx}
              className={`text-center p-2 rounded text-xs ${
                isToday(date)
                  ? "bg-blue-500 text-white"
                  : idx === 0 || idx === 6
                    ? "bg-slate-100 text-slate-600"
                    : "bg-slate-50 text-slate-600"
              }`}
            >
              <div className="uppercase text-[10px] mb-1">{dayNamesShort[date.getDay()]}</div>
              <div>{date.getDate()}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render 7-Day Week Planner with Mini Week Previews
  const render7DayWeekWithPreviews = () => {
    const weekStart = getWeekStart(today, currentWeekOffset);
    const weekDates = getWeekDates(weekStart, 7);

    return (
      <div className="space-y-6">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Week
          </Button>
          <div className="text-center">
            <div className="text-slate-900">{formatDateRange(weekDates)}</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
            className="gap-2"
          >
            Next Week
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-8 gap-2">
          {/* Time column header */}
          <div className="text-slate-500 text-sm p-2"></div>
          
          {/* Day headers */}
          {weekDates.map((date, idx) => (
            <div
              key={idx}
              className={`text-center p-3 rounded-t-lg ${
                isToday(date)
                  ? "bg-blue-500 text-white"
                  : idx === 0 || idx === 6
                    ? "bg-slate-100 text-slate-700"
                    : "bg-slate-50 text-slate-700"
              }`}
            >
              <div className="text-xs uppercase tracking-wide">
                {dayNamesShort[date.getDay()]}
              </div>
              <div className="text-2xl mt-1">{date.getDate()}</div>
            </div>
          ))}

          {/* Time slots */}
          {timeSlots.map((time, timeIdx) => (
            <div key={timeIdx} className="contents">
              {/* Time label */}
              <div className="text-slate-500 text-xs p-2 text-right pr-3 border-t border-slate-200">
                {time}
              </div>
              
              {/* Day cells */}
              {weekDates.map((date, dayIdx) => (
                <div
                  key={dayIdx}
                  className={`min-h-[60px] border-t border-slate-200 p-2 hover:bg-slate-50 transition-colors cursor-pointer ${
                    dayIdx === 0 || dayIdx === 6 ? "bg-slate-50/50" : ""
                  }`}
                >
                  {/* Empty cell for planning */}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Mini Week Previews */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
          {renderMiniWeek(-1, "Last Week")}
          {renderMiniWeek(1, "Next Week")}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 transition-all duration-500 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl tracking-tight transition-colors duration-300 text-slate-900">
              Atom Week
            </h1>
            <h2 className="text-2xl transition-colors duration-300 text-slate-600">
              finAtomWeek: Weekly Calendar Variations
            </h2>
          </div>
          <p className="text-lg max-w-3xl mx-auto transition-colors duration-300 text-slate-600">
            Professional weekly planner layouts with time slots. Choose between full 7-day week or focused Monday-Friday work week views.
          </p>
        </div>

        {/* 7-Day Week Planner */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className="text-xl transition-colors duration-300 text-slate-800">
              7-Day Week Planner
            </CardTitle>
            <CardDescription className="transition-colors duration-300 text-slate-600">
              Complete week view from Sunday through Saturday with hourly time slots
            </CardDescription>
          </CardHeader>
          <CardContent>
            {render7DayWeek()}
          </CardContent>
        </Card>

        {/* M-F Work Week Planner */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className="text-xl transition-colors duration-300 text-slate-800">
              M-F Work Week Planner
            </CardTitle>
            <CardDescription className="transition-colors duration-300 text-slate-600">
              Focused weekday planner from Monday through Friday with hourly time slots
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderWorkWeek()}
          </CardContent>
        </Card>

        {/* 7-Day Week Planner with Mini Previews */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className="text-xl transition-colors duration-300 text-slate-800">
              7-Day Week Planner with Context View
            </CardTitle>
            <CardDescription className="transition-colors duration-300 text-slate-600">
              Full week planner with miniature last week and next week displays below for easy context and navigation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {render7DayWeekWithPreviews()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
