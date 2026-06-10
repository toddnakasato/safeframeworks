const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = ["6am", "9am", "12pm", "3pm", "6pm", "9pm"];

const rawData: number[][] = [
  [12, 45, 89, 76, 54, 23, 11],
  [34, 67, 94, 88, 72, 41, 28],
  [56, 78, 99, 95, 81, 62, 44],
  [43, 71, 87, 91, 68, 52, 37],
  [28, 53, 74, 82, 59, 38, 21],
  [8,  22, 41, 35, 26, 14, 6],
];

function heatColor(v: number): string {
  if (v >= 90) return "bg-red-500 text-white";
  if (v >= 75) return "bg-orange-400 text-white";
  if (v >= 60) return "bg-amber-300 text-gray-800";
  if (v >= 40) return "bg-yellow-200 text-gray-800";
  if (v >= 20) return "bg-green-100 text-gray-700";
  return "bg-gray-50 text-gray-500";
}

export function HeatmapSheet() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3">
        <p className="text-sm text-gray-600">Active Users by Hour & Day</p>
      </div>
      <div className="p-4">
        <table className="w-full text-xs text-center">
          <thead>
            <tr>
              <th className="w-12 py-1 text-gray-400" />
              {days.map(d => (
                <th key={d} className="py-1 text-gray-500">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour, hi) => (
              <tr key={hour}>
                <td className="pr-2 py-1 text-right text-gray-400">{hour}</td>
                {days.map((_, di) => (
                  <td key={di} className="p-0.5">
                    <div className={`rounded py-2 ${heatColor(rawData[hi][di])}`}>
                      {rawData[hi][di]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex items-center gap-2 justify-end">
          {["Low", "", "", "", "", "High"].map((label, i) => (
            <div key={i} className="flex items-center gap-1">
              {label && <span className="text-xs text-gray-500">{label}</span>}
              <div className={`h-3 w-6 rounded-sm ${["bg-gray-50","bg-green-100","bg-yellow-200","bg-amber-300","bg-orange-400","bg-red-500"][i]}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
