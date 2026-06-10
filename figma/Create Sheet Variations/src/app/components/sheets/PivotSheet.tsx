const regions = ["North", "South", "East", "West", "Central"];
const quarters = ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"];

const data: Record<string, Record<string, number>> = {
  North: { "Q1 2024": 142000, "Q2 2024": 168000, "Q3 2024": 153000, "Q4 2024": 201000 },
  South: { "Q1 2024": 98000, "Q2 2024": 112000, "Q3 2024": 125000, "Q4 2024": 134000 },
  East: { "Q1 2024": 187000, "Q2 2024": 202000, "Q3 2024": 195000, "Q4 2024": 228000 },
  West: { "Q1 2024": 231000, "Q2 2024": 256000, "Q3 2024": 241000, "Q4 2024": 289000 },
  Central: { "Q1 2024": 74000, "Q2 2024": 81000, "Q3 2024": 77000, "Q4 2024": 92000 },
};

const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`;

export function PivotSheet() {
  const rowTotals = regions.map(r => quarters.reduce((s, q) => s + data[r][q], 0));
  const colTotals = quarters.map(q => regions.reduce((s, r) => s + data[r][q], 0));
  const grandTotal = rowTotals.reduce((a, b) => a + b, 0);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="px-4 py-3 text-left">Region</th>
            {quarters.map(q => (
              <th key={q} className="px-4 py-3 text-right">{q}</th>
            ))}
            <th className="px-4 py-3 text-right bg-slate-700">Total</th>
          </tr>
        </thead>
        <tbody>
          {regions.map((region, ri) => (
            <tr key={region} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 text-gray-900">{region}</td>
              {quarters.map(q => (
                <td key={q} className="px-4 py-3 text-right text-gray-700 tabular-nums">
                  {fmt(data[region][q])}
                </td>
              ))}
              <td className="px-4 py-3 text-right text-gray-900 bg-slate-50 tabular-nums">
                {fmt(rowTotals[ri])}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-slate-300 bg-slate-100">
            <td className="px-4 py-3 text-gray-800">Total</td>
            {colTotals.map((t, i) => (
              <td key={i} className="px-4 py-3 text-right text-gray-900 tabular-nums">{fmt(t)}</td>
            ))}
            <td className="px-4 py-3 text-right text-slate-900 bg-slate-200 tabular-nums">{fmt(grandTotal)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
