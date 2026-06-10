export function EmptySheet() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-gray-600">Column A</th>
            <th className="px-4 py-3 text-left text-gray-600">Column B</th>
            <th className="px-4 py-3 text-left text-gray-600">Column C</th>
            <th className="px-4 py-3 text-left text-gray-600">Column D</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-gray-100">
              {Array.from({ length: 4 }).map((_, j) => (
                <td key={j} className="px-4 py-3">
                  <div className="h-4 w-full rounded bg-gray-100" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-center py-8 text-gray-400 text-xs">
        No data to display
      </div>
    </div>
  );
}
