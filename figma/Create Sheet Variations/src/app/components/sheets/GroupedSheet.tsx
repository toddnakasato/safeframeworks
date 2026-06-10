export function GroupedSheet() {
  const groups = [
    {
      label: "Engineering",
      color: "bg-blue-50 text-blue-700",
      rows: [
        { name: "Alice Johnson", title: "Sr. Engineer", location: "NYC", start: "Jan 2021" },
        { name: "Marcus Kim", title: "Staff Engineer", location: "SF", start: "Mar 2019" },
        { name: "Priya Patel", title: "Junior Engineer", location: "Remote", start: "Sep 2023" },
      ],
    },
    {
      label: "Design",
      color: "bg-violet-50 text-violet-700",
      rows: [
        { name: "Sofia Ruiz", title: "Lead Designer", location: "Austin", start: "Jun 2020" },
        { name: "James Chen", title: "UI Designer", location: "LA", start: "Feb 2022" },
      ],
    },
    {
      label: "Marketing",
      color: "bg-emerald-50 text-emerald-700",
      rows: [
        { name: "Olivia Turner", title: "CMO", location: "NYC", start: "Nov 2018" },
        { name: "Liam Brooks", title: "Content Lead", location: "Chicago", start: "Jul 2021" },
        { name: "Zoe Adams", title: "SEO Specialist", location: "Remote", start: "Jan 2023" },
      ],
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-gray-600">Name</th>
            <th className="px-4 py-3 text-left text-gray-600">Title</th>
            <th className="px-4 py-3 text-left text-gray-600">Location</th>
            <th className="px-4 py-3 text-left text-gray-600">Start Date</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <>
              <tr key={group.label} className={`border-b border-gray-100 ${group.color}`}>
                <td colSpan={4} className="px-4 py-2 text-xs font-semibold uppercase tracking-wide">
                  {group.label} — {group.rows.length} members
                </td>
              </tr>
              {group.rows.map((row, i) => (
                <tr key={`${group.label}-${i}`} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 pl-8 text-gray-900">{row.name}</td>
                  <td className="px-4 py-3 text-gray-600">{row.title}</td>
                  <td className="px-4 py-3 text-gray-600">{row.location}</td>
                  <td className="px-4 py-3 text-gray-500">{row.start}</td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
