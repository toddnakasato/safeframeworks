export function CardSheet() {
  const metrics = [
    { title: "Monthly Revenue", value: "$284,521", delta: "+12.4%", up: true, sub: "vs last month" },
    { title: "Active Users", value: "18,432", delta: "+5.2%", up: true, sub: "vs last month" },
    { title: "Churn Rate", value: "2.1%", delta: "-0.4%", up: true, sub: "vs last month" },
    { title: "Avg. Order Value", value: "$142", delta: "-3.1%", up: false, sub: "vs last month" },
    { title: "Support Tickets", value: "234", delta: "+18.7%", up: false, sub: "vs last month" },
    { title: "NPS Score", value: "72", delta: "+3pts", up: true, sub: "vs last month" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {metrics.map((m) => (
        <div key={m.title} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">{m.title}</p>
          <p className="text-2xl text-gray-900 mb-2">{m.value}</p>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${m.up ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
              {m.delta}
            </span>
            <span className="text-xs text-gray-400">{m.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
