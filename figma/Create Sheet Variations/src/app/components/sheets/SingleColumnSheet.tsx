export function SingleColumnSheet() {
  const items = [
    { rank: 1, page: "/dashboard", sessions: "18,421" },
    { rank: 2, page: "/pricing", sessions: "12,887" },
    { rank: 3, page: "/features", sessions: "9,340" },
    { rank: 4, page: "/blog/intro", sessions: "7,203" },
    { rank: 5, page: "/signup", sessions: "6,981" },
    { rank: 6, page: "/docs", sessions: "5,544" },
    { rank: 7, page: "/about", sessions: "3,122" },
  ];

  const max = 18421;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <p className="text-sm text-gray-600">Top Pages by Sessions</p>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div key={item.rank} className="flex items-center gap-3 px-4 py-3">
            <span className="text-xs text-gray-400 w-4 tabular-nums">{item.rank}</span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-800 font-mono truncate">{item.page}</span>
                <span className="text-sm text-gray-600 ml-2 shrink-0">{item.sessions}</span>
              </div>
              <div className="h-1 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-400"
                  style={{ width: `${(parseInt(item.sessions.replace(/,/g, "")) / max) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
