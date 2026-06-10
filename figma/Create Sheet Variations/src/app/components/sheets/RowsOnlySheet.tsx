export function RowsOnlySheet() {
  const rows = [
    "🚀 Launch v2.0 of the platform",
    "📊 Review Q2 analytics report",
    "💬 Schedule team retrospective",
    "🔐 Update API authentication layer",
    "📝 Draft blog post on new features",
    "🛠 Fix pagination bug in search results",
    "📦 Migrate legacy data to new schema",
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="divide-y divide-gray-100">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
            <span className="text-gray-800 text-sm">{row}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
