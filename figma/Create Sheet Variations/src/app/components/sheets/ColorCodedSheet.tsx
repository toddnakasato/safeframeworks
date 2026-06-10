const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Inactive: "bg-gray-100 text-gray-600",
  Critical: "bg-red-100 text-red-700",
};

const changeColors = (v: number) =>
  v > 0 ? "text-emerald-600" : v < 0 ? "text-red-500" : "text-gray-500";

export function ColorCodedSheet() {
  const data = [
    { server: "api-prod-01", cpu: 42, mem: 68, disk: 31, status: "Active", change: +2.1 },
    { server: "api-prod-02", cpu: 78, mem: 82, disk: 55, status: "Critical", change: +12.4 },
    { server: "db-primary", cpu: 23, mem: 91, disk: 74, status: "Active", change: -1.2 },
    { server: "cache-01", cpu: 11, mem: 34, disk: 18, status: "Active", change: +0.3 },
    { server: "worker-01", cpu: 56, mem: 44, disk: 29, status: "Pending", change: +4.7 },
    { server: "worker-02", cpu: 0, mem: 0, disk: 0, status: "Inactive", change: 0 },
  ];

  const bar = (v: number, color: string) => (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${v}%` }} />
      </div>
      <span className="text-gray-700 w-8 text-right">{v}%</span>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-gray-600">Server</th>
            <th className="px-4 py-3 text-left text-gray-600">CPU</th>
            <th className="px-4 py-3 text-left text-gray-600">Memory</th>
            <th className="px-4 py-3 text-left text-gray-600">Disk</th>
            <th className="px-4 py-3 text-left text-gray-600">Status</th>
            <th className="px-4 py-3 text-right text-gray-600">24h Change</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-900 font-mono">{row.server}</td>
              <td className="px-4 py-3">{bar(row.cpu, "bg-blue-400")}</td>
              <td className="px-4 py-3">{bar(row.mem, "bg-violet-400")}</td>
              <td className="px-4 py-3">{bar(row.disk, "bg-orange-400")}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs ${statusColors[row.status]}`}>
                  {row.status}
                </span>
              </td>
              <td className={`px-4 py-3 text-right ${changeColors(row.change)}`}>
                {row.change > 0 ? "+" : ""}{row.change}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
