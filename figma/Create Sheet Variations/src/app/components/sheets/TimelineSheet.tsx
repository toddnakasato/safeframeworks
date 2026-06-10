const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const projects = [
  { name: "Alpha Launch", start: 0, end: 3, color: "bg-blue-400" },
  { name: "Beta Rollout", start: 2, end: 6, color: "bg-violet-400" },
  { name: "API v2", start: 4, end: 7, color: "bg-orange-400" },
  { name: "Mobile App", start: 5, end: 10, color: "bg-emerald-400" },
  { name: "Enterprise", start: 8, end: 11, color: "bg-rose-400" },
];

export function TimelineSheet() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
        <p className="text-sm text-gray-600">2024 Project Roadmap</p>
      </div>
      <div className="p-4 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="pr-4 py-2 text-left text-gray-500 w-32">Project</th>
              {months.map(m => (
                <th key={m} className="py-2 text-center text-gray-400 w-8">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.name} className="border-t border-gray-100">
                <td className="pr-4 py-2 text-gray-800">{project.name}</td>
                {months.map((_, i) => (
                  <td key={i} className="py-2 px-0.5">
                    {i >= project.start && i <= project.end ? (
                      <div className={`h-4 rounded-sm ${project.color} opacity-80 ${i === project.start ? "rounded-l" : ""} ${i === project.end ? "rounded-r" : ""}`} />
                    ) : (
                      <div className="h-4" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
