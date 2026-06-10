import { useState } from "react";

const COLS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const ROWS = 10;

const initialData: Record<string, string> = {
  "1-A": "Revenue", "1-B": "45,000", "1-C": "52,000", "1-D": "48,000",
  "2-A": "COGS", "2-B": "18,000", "2-C": "21,000", "2-D": "19,500",
  "3-A": "Gross Profit", "3-B": "27,000", "3-C": "31,000", "3-D": "28,500",
  "4-A": "OpEx", "4-B": "12,000", "4-C": "13,500", "4-D": "11,800",
  "5-A": "Net Income", "5-B": "15,000", "5-C": "17,500", "5-D": "16,700",
};

export function SpreadsheetGrid() {
  const [data, setData] = useState<Record<string, string>>(initialData);
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="overflow-auto rounded-lg border border-gray-300 bg-white shadow-sm font-mono text-xs">
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="w-10 border border-gray-300 bg-gray-100 px-2 py-1 text-center text-gray-500" />
            {COLS.map(col => (
              <th key={col} className="w-28 border border-gray-300 bg-gray-100 px-2 py-1 text-center text-gray-600">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: ROWS }, (_, i) => i + 1).map(row => (
            <tr key={row}>
              <td className="border border-gray-300 bg-gray-50 px-2 py-1 text-center text-gray-500 select-none">
                {row}
              </td>
              {COLS.map(col => {
                const key = `${row}-${col}`;
                const isActive = active === key;
                return (
                  <td key={col} className="border border-gray-200 p-0">
                    <input
                      value={data[key] || ""}
                      onChange={e => setData(prev => ({ ...prev, [key]: e.target.value }))}
                      onFocus={() => setActive(key)}
                      onBlur={() => setActive(null)}
                      className={`w-full px-2 py-1 outline-none ${isActive ? "bg-blue-50 ring-2 ring-inset ring-blue-400" : "bg-white hover:bg-gray-50"} ${row <= 5 && col === "A" ? "text-gray-700" : "text-gray-900"}`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
