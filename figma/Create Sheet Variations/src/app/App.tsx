import { useState } from "react";
import { BasicSheet } from "./components/sheets/BasicSheet";
import { EmptySheet } from "./components/sheets/EmptySheet";
import { StripedSheet } from "./components/sheets/StripedSheet";
import { SpreadsheetGrid } from "./components/sheets/SpreadsheetGrid";
import { MinimalSheet } from "./components/sheets/MinimalSheet";
import { ColorCodedSheet } from "./components/sheets/ColorCodedSheet";
import { ColumnsOnlySheet } from "./components/sheets/ColumnsOnlySheet";
import { RowsOnlySheet } from "./components/sheets/RowsOnlySheet";
import { DarkSheet } from "./components/sheets/DarkSheet";
import { CompactSheet } from "./components/sheets/CompactSheet";
import { SkeletonSheet } from "./components/sheets/SkeletonSheet";
import { GroupedSheet } from "./components/sheets/GroupedSheet";
import { HeatmapSheet } from "./components/sheets/HeatmapSheet";
import { SingleColumnSheet } from "./components/sheets/SingleColumnSheet";
import { PivotSheet } from "./components/sheets/PivotSheet";
import { CardSheet } from "./components/sheets/CardSheet";
import { TimelineSheet } from "./components/sheets/TimelineSheet";

/* MARKER-MAKE-KIT-INVOKED */

const sections = [
  {
    id: "basic",
    label: "Basic Table",
    description: "Standard rows & columns with header and hover states",
    bg: "bg-white",
    component: <BasicSheet />,
  },
  {
    id: "empty",
    label: "Empty State",
    description: "Column headers only — no row data, placeholder skeleton cells",
    bg: "bg-gray-50",
    component: <EmptySheet />,
  },
  {
    id: "columns-only",
    label: "Columns Only",
    description: "Headers defined, truly empty body with empty-state message",
    bg: "bg-white",
    component: <ColumnsOnlySheet />,
  },
  {
    id: "rows-only",
    label: "Rows Only (No Columns)",
    description: "Single-column list rows — no multi-column table structure",
    bg: "bg-gray-50",
    component: <RowsOnlySheet />,
  },
  {
    id: "minimal",
    label: "Minimal / Key-Value",
    description: "Label–value pairs, no borders, ultra-clean",
    bg: "bg-white",
    component: <MinimalSheet />,
  },
  {
    id: "single-col",
    label: "Single Column with Bars",
    description: "One data column with inline progress bars",
    bg: "bg-gray-50",
    component: <SingleColumnSheet />,
  },
  {
    id: "striped",
    label: "Striped with Totals Row",
    description: "Alternating row colors, colored header, footer totals",
    bg: "bg-white",
    component: <StripedSheet />,
  },
  {
    id: "color-coded",
    label: "Color-Coded Status",
    description: "Status badges, progress bars, and delta indicators",
    bg: "bg-gray-50",
    component: <ColorCodedSheet />,
  },
  {
    id: "dark",
    label: "Dark Theme",
    description: "Dark background, monospaced font, crypto-ticker style",
    bg: "bg-gray-950",
    component: <DarkSheet />,
  },
  {
    id: "compact",
    label: "Compact / Dense",
    description: "Tiny font, tight padding — lots of data in little space",
    bg: "bg-white",
    component: <CompactSheet />,
  },
  {
    id: "grouped",
    label: "Grouped Rows",
    description: "Rows organized under labeled group headers",
    bg: "bg-gray-50",
    component: <GroupedSheet />,
  },
  {
    id: "pivot",
    label: "Pivot / Cross-Tab",
    description: "Regions × quarters with row and column totals",
    bg: "bg-white",
    component: <PivotSheet />,
  },
  {
    id: "heatmap",
    label: "Heatmap Grid",
    description: "Color-intensity cells, no traditional row separators",
    bg: "bg-gray-50",
    component: <HeatmapSheet />,
  },
  {
    id: "timeline",
    label: "Gantt / Timeline",
    description: "Month columns with colored bars per project",
    bg: "bg-white",
    component: <TimelineSheet />,
  },
  {
    id: "cards",
    label: "Card Grid (No Lines)",
    description: "Metrics in card layout — sheet data without table chrome",
    bg: "bg-gray-50",
    component: <CardSheet />,
  },
  {
    id: "skeleton",
    label: "Skeleton / Loading",
    description: "Animated placeholder — data is loading",
    bg: "bg-white",
    component: <SkeletonSheet />,
  },
  {
    id: "spreadsheet",
    label: "Editable Spreadsheet",
    description: "Interactive grid with cell selection and editing",
    bg: "bg-gray-50",
    component: <SpreadsheetGrid />,
  },
];

export default function App() {
  const [active, setActive] = useState<string | null>(null);

  const filtered = active ? sections.filter(s => s.id === active) : sections;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-gray-900">Sheet Variations</h1>
            <p className="text-gray-500 text-sm mt-0.5">{sections.length} variations — with and without rows, columns, and values</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActive(null)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${active === null ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              All
            </button>
          </div>
        </div>
        {/* Filter pills */}
        <div className="max-w-7xl mx-auto px-6 pb-3 flex gap-2 flex-wrap">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(active === s.id ? null : s.id)}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors ${active === s.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {filtered.map(section => (
          <div key={section.id}>
            <div className="mb-3 flex items-baseline gap-3">
              <h2 className="text-gray-900">{section.label}</h2>
              <span className="text-sm text-gray-400">{section.description}</span>
            </div>
            <div className={`rounded-xl p-6 ${section.bg} ${section.bg === "bg-gray-950" ? "border border-gray-800" : "border border-gray-200"}`}>
              {section.component}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
