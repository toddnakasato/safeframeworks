import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./components/ui/button";

export default function App() {
  // Get current date (October 9, 2025)
  const today = new Date(2025, 9, 9); // Month is 0-indexed
  const [selectedDate, setSelectedDate] = useState(today);

  // Helper function to get days in a month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper function to get the first day of the month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar data for a specific month
  const generateCalendarDays = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayNamesShort = ["SU", "M", "TU", "W", "TH", "F", "SA"];

  // Check if a date is today
  const isToday = (year: number, month: number, day: number | null) => {
    if (day === null) return false;
    return year === today.getFullYear() && 
           month === today.getMonth() && 
           day === today.getDate();
  };

  // Navigate months
  const navigateMonth = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  // Plain theme styles
  const getCardStyles = () => {
    return `border-0 backdrop-blur-xl transition-all duration-300 bg-white/70 shadow-2xl`;
  };

  // Render a single month calendar
  const renderMonth = (year: number, month: number, showNavigation = false, size: "small" | "default" = "default") => {
    const days = generateCalendarDays(year, month);
    const cellSize = size === "small" ? "h-8 w-8 text-xs" : "h-10 w-10";
    const headerSize = size === "small" ? "text-sm" : "text-base";

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {showNavigation && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth(-1)}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <h3 className={`${headerSize} transition-colors duration-300 text-slate-800 ${!showNavigation ? 'text-center w-full' : ''}`}>
            {monthNames[month]} {year}
          </h3>
          {showNavigation && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth(1)}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div
              key={day}
              className={`${cellSize} flex items-center justify-center text-xs transition-colors duration-300 text-slate-500`}
            >
              {day}
            </div>
          ))}
          {days.map((day, index) => (
            <div
              key={index}
              className={`${cellSize} flex items-center justify-center rounded-lg transition-all duration-300 ${
                day === null
                  ? ""
                  : isToday(year, month, day)
                  ? "bg-green-500 text-white shadow-md"
                  : "bg-slate-50/50 text-slate-700 hover:bg-slate-100 cursor-pointer"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render flat calendar month (horizontal layout)
  const renderFlatMonth = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    // Create array of all days including leading spaces
    const allDays: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      allDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      allDays.push(day);
    }

    return (
      <div className="flex gap-4 items-start border-b border-slate-200 pb-3 mb-3">
        {/* Month name */}
        <div className="w-32 flex-shrink-0">
          <h3 className="uppercase text-blue-600 tracking-wide">
            {monthNames[month]}
          </h3>
        </div>

        {/* Calendar grid */}
        <div className="flex-1">
          {/* Days */}
          <div className="flex gap-x-1">
            {allDays.map((day, index) => {
              const isCurrentDay = isToday(year, month, day);
              
              return (
                <div
                  key={index}
                  className={`w-7 h-6 flex items-center justify-center text-sm flex-shrink-0 ${
                    day === null
                      ? ""
                      : isCurrentDay
                      ? "bg-blue-500 text-white rounded"
                      : "text-slate-700"
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 transition-all duration-500 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl tracking-tight transition-colors duration-300 text-slate-900">
              Atom Calendar Month
            </h1>
            <h2 className="text-2xl transition-colors duration-300 text-slate-600">
              finAtomMonth: Simple Month, Full Year & Month Comparison
            </h2>
          </div>
          <p className="text-lg max-w-3xl mx-auto transition-colors duration-300 text-slate-600">
            Comprehensive showcase of calendar month variations including simple month display,
            full year view, and side-by-side month comparisons.
          </p>
        </div>

        {/* Simple Calendar Month Display */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className="text-xl transition-colors duration-300 text-slate-800">
              Simple Calendar Month Display
            </CardTitle>
            <CardDescription className="transition-colors duration-300 text-slate-600">
              Interactive calendar showing a single month with navigation controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="max-w-md mx-auto">
              {renderMonth(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                true,
                "default"
              )}
            </div>

            {/* Additional month examples without navigation */}
            <div className="grid md:grid-cols-3 gap-6 pt-6 border-t transition-colors duration-300 border-slate-200">
              <div>
                <h4 className="mb-3 text-center transition-colors duration-300 text-slate-600">
                  Current Month
                </h4>
                {renderMonth(today.getFullYear(), today.getMonth(), false, "small")}
              </div>
              <div>
                <h4 className="mb-3 text-center transition-colors duration-300 text-slate-600">
                  Next Month
                </h4>
                {renderMonth(
                  today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear(),
                  today.getMonth() === 11 ? 0 : today.getMonth() + 1,
                  false,
                  "small"
                )}
              </div>
              <div>
                <h4 className="mb-3 text-center transition-colors duration-300 text-slate-600">
                  Two Months Ahead
                </h4>
                {renderMonth(
                  today.getMonth() >= 10 ? today.getFullYear() + 1 : today.getFullYear(),
                  (today.getMonth() + 2) % 12,
                  false,
                  "small"
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Full Year Calendar */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className="text-xl transition-colors duration-300 text-slate-800">
              Full Year Calendar - 2025
            </CardTitle>
            <CardDescription className="transition-colors duration-300 text-slate-600">
              Complete year view showing all 12 months at a glance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="p-4 rounded-lg transition-colors duration-300 bg-slate-50/30 border border-slate-200">
                  {renderMonth(2025, i, false, "small")}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* This Month vs Last Month */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className="text-xl transition-colors duration-300 text-slate-800">
              Month Comparison - This Month & Last Month
            </CardTitle>
            <CardDescription className="transition-colors duration-300 text-slate-600">
              Side-by-side comparison of current and previous month
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Main Comparison */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-lg transition-colors duration-300 bg-slate-50/30 border-2 border-slate-300">
                <Badge variant="outline" className="mb-4 px-3 py-1 border-blue-400 text-blue-600 bg-blue-100">
                  Last Month
                </Badge>
                {renderMonth(
                  today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear(),
                  today.getMonth() === 0 ? 11 : today.getMonth() - 1,
                  false,
                  "default"
                )}
              </div>
              <div className="p-6 rounded-lg transition-colors duration-300 bg-green-50/30 border-2 border-green-300">
                <Badge variant="outline" className="mb-4 px-3 py-1 border-green-400 text-green-600 bg-green-100">
                  This Month
                </Badge>
                {renderMonth(today.getFullYear(), today.getMonth(), false, "default")}
              </div>
            </div>

            {/* Additional Comparison Examples */}
            <div className="pt-6 border-t transition-colors duration-300 border-slate-200">
              <h4 className="mb-4 text-center transition-colors duration-300 text-slate-600">
                Quarter Comparison View
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg transition-colors duration-300 bg-slate-50/30 border border-slate-200">
                  <Badge variant="outline" className="mb-3 px-2 py-0.5 text-xs border-slate-400 text-slate-600 bg-slate-100">
                    Two Months Ago
                  </Badge>
                  {renderMonth(
                    today.getMonth() < 2 ? today.getFullYear() - 1 : today.getFullYear(),
                    today.getMonth() < 2 ? today.getMonth() + 10 : today.getMonth() - 2,
                    false,
                    "small"
                  )}
                </div>
                <div className="p-4 rounded-lg transition-colors duration-300 bg-slate-50/30 border border-slate-200">
                  <Badge variant="outline" className="mb-3 px-2 py-0.5 text-xs border-blue-400 text-blue-600 bg-blue-100">
                    Last Month
                  </Badge>
                  {renderMonth(
                    today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear(),
                    today.getMonth() === 0 ? 11 : today.getMonth() - 1,
                    false,
                    "small"
                  )}
                </div>
                <div className="p-4 rounded-lg transition-colors duration-300 bg-green-50/30 border border-green-300">
                  <Badge variant="outline" className="mb-3 px-2 py-0.5 text-xs border-green-400 text-green-600 bg-green-100">
                    This Month
                  </Badge>
                  {renderMonth(today.getFullYear(), today.getMonth(), false, "small")}
                </div>
              </div>
            </div>

            {/* Year-over-Year Comparison */}
            <div className="pt-6 border-t transition-colors duration-300 border-slate-200">
              <h4 className="mb-4 text-center transition-colors duration-300 text-slate-600">
                Year-over-Year Comparison (October 2024 vs October 2025)
              </h4>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 rounded-lg transition-colors duration-300 bg-slate-50/30 border border-slate-200">
                  <Badge variant="outline" className="mb-4 px-3 py-1 border-orange-400 text-orange-600 bg-orange-100">
                    October 2024
                  </Badge>
                  {renderMonth(2024, 9, false, "default")}
                </div>
                <div className="p-6 rounded-lg transition-colors duration-300 bg-green-50/30 border border-green-300">
                  <Badge variant="outline" className="mb-4 px-3 py-1 border-green-400 text-green-600 bg-green-100">
                    October 2025
                  </Badge>
                  {renderMonth(2025, 9, false, "default")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flat Calendar - 2025 */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className="text-xl transition-colors duration-300 text-slate-800">
              Flat Calendar - 2025
            </CardTitle>
            <CardDescription className="transition-colors duration-300 text-slate-600">
              Compact vertical layout showing all 12 months in a continuous format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Background with weekend column shading */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  marginLeft: 'calc(8rem + 1rem)', // w-32 + gap-4
                  backgroundImage: `repeating-linear-gradient(
                    to right,
                    transparent 0,
                    transparent calc(1.75rem + 0.25rem),
                    transparent calc(1.75rem + 0.25rem),
                    transparent calc((1.75rem + 0.25rem) * 5),
                    rgb(241 245 249) calc((1.75rem + 0.25rem) * 5),
                    rgb(241 245 249) calc((1.75rem + 0.25rem) * 6),
                    transparent calc((1.75rem + 0.25rem) * 6),
                    transparent calc((1.75rem + 0.25rem) * 6),
                    rgb(241 245 249) calc((1.75rem + 0.25rem) * 6),
                    rgb(241 245 249) calc((1.75rem + 0.25rem) * 7)
                  )`,
                  backgroundSize: 'calc((1.75rem + 0.25rem) * 7) 100%',
                  backgroundRepeat: 'repeat-x'
                }}
              />
              
              {/* Content layer */}
              <div className="relative">
                {/* Day headers at the top - only shown once */}
                <div className="flex gap-4 items-start mb-2">
                  <div className="w-32 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex gap-x-1">
                      {/* Repeat day headers enough times to cover the maximum month width (37 cells) */}
                      {Array.from({ length: 37 }).map((_, i) => {
                        const dayOfWeek = i % 7;
                        return (
                          <div 
                            key={i} 
                            className="w-7 text-center text-xs text-slate-700 font-semibold flex-shrink-0 h-6 flex items-center justify-center"
                          >
                            {dayNamesShort[dayOfWeek]}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* All months */}
                <div className="space-y-0">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i}>
                      {renderFlatMonth(2025, i)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flat Quarter Calendar - 2025 */}
        <Card className={getCardStyles()}>
          <CardHeader>
            <CardTitle className="text-xl transition-colors duration-300 text-slate-800">
              Flat Quarter Calendar - 2025
            </CardTitle>
            <CardDescription className="transition-colors duration-300 text-slate-600">
              Compact layout organized by fiscal quarters with visual grouping
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Background with weekend column shading */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  marginLeft: 'calc(8rem + 1rem)', // w-32 + gap-4
                  backgroundImage: `repeating-linear-gradient(
                    to right,
                    transparent 0,
                    transparent calc(1.75rem + 0.25rem),
                    transparent calc(1.75rem + 0.25rem),
                    transparent calc((1.75rem + 0.25rem) * 5),
                    rgb(241 245 249) calc((1.75rem + 0.25rem) * 5),
                    rgb(241 245 249) calc((1.75rem + 0.25rem) * 6),
                    transparent calc((1.75rem + 0.25rem) * 6),
                    transparent calc((1.75rem + 0.25rem) * 6),
                    rgb(241 245 249) calc((1.75rem + 0.25rem) * 6),
                    rgb(241 245 249) calc((1.75rem + 0.25rem) * 7)
                  )`,
                  backgroundSize: 'calc((1.75rem + 0.25rem) * 7) 100%',
                  backgroundRepeat: 'repeat-x'
                }}
              />
              
              {/* Content layer */}
              <div className="relative">
                {/* Day headers at the top - only shown once */}
                <div className="flex gap-4 items-start mb-2">
                  <div className="w-32 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex gap-x-1">
                      {Array.from({ length: 37 }).map((_, i) => {
                        const dayOfWeek = i % 7;
                        return (
                          <div 
                            key={i} 
                            className="w-7 text-center text-xs text-slate-700 font-semibold flex-shrink-0 h-6 flex items-center justify-center"
                          >
                            {dayNamesShort[dayOfWeek]}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Q1 */}
                <div className="mb-6">
                  <div className="flex gap-4 items-center mb-2">
                    <div className="w-32 flex-shrink-0">
                      <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">Q1</Badge>
                    </div>
                  </div>
                  <div className="space-y-0">
                    {Array.from({ length: 3 }, (_, i) => (
                      <div key={i}>
                        {renderFlatMonth(2025, i)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Q2 */}
                <div className="mb-6">
                  <div className="flex gap-4 items-center mb-2">
                    <div className="w-32 flex-shrink-0">
                      <Badge className="bg-sky-500 text-white hover:bg-sky-600">Q2</Badge>
                    </div>
                  </div>
                  <div className="space-y-0">
                    {Array.from({ length: 3 }, (_, i) => (
                      <div key={i}>
                        {renderFlatMonth(2025, i + 3)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Q3 */}
                <div className="mb-6">
                  <div className="flex gap-4 items-center mb-2">
                    <div className="w-32 flex-shrink-0">
                      <Badge className="bg-amber-500 text-white hover:bg-amber-600">Q3</Badge>
                    </div>
                  </div>
                  <div className="space-y-0">
                    {Array.from({ length: 3 }, (_, i) => (
                      <div key={i}>
                        {renderFlatMonth(2025, i + 6)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Q4 */}
                <div className="mb-0">
                  <div className="flex gap-4 items-center mb-2">
                    <div className="w-32 flex-shrink-0">
                      <Badge className="bg-purple-500 text-white hover:bg-purple-600">Q4</Badge>
                    </div>
                  </div>
                  <div className="space-y-0">
                    {Array.from({ length: 3 }, (_, i) => (
                      <div key={i}>
                        {renderFlatMonth(2025, i + 9)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
