export function SkeletonSheet() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm animate-pulse">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {[140, 100, 80, 60, 70].map((w, i) => (
              <th key={i} className="px-4 py-3">
                <div className="h-3 rounded bg-gray-200" style={{ width: w }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} className="border-b border-gray-100">
              <td className="px-4 py-3"><div className="h-3 w-32 rounded bg-gray-100" /></td>
              <td className="px-4 py-3"><div className="h-3 w-20 rounded bg-gray-100" /></td>
              <td className="px-4 py-3"><div className="h-3 w-16 rounded bg-gray-100" /></td>
              <td className="px-4 py-3"><div className="h-3 w-12 rounded bg-gray-100" /></td>
              <td className="px-4 py-3"><div className="h-3 w-14 rounded bg-gray-100" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
