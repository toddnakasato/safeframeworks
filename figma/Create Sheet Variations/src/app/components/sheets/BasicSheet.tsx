export function BasicSheet() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-gray-600">Name</th>
            <th className="px-4 py-3 text-left text-gray-600">Role</th>
            <th className="px-4 py-3 text-left text-gray-600">Department</th>
            <th className="px-4 py-3 text-right text-gray-600">Salary</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: "Alice Johnson", role: "Engineer", dept: "Engineering", salary: "$120,000" },
            { name: "Bob Smith", role: "Designer", dept: "Product", salary: "$95,000" },
            { name: "Carol White", role: "Manager", dept: "Operations", salary: "$110,000" },
            { name: "David Lee", role: "Analyst", dept: "Finance", salary: "$88,000" },
            { name: "Eva Brown", role: "Engineer", dept: "Engineering", salary: "$115,000" },
          ].map((row, i) => (
            <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-900">{row.name}</td>
              <td className="px-4 py-3 text-gray-600">{row.role}</td>
              <td className="px-4 py-3 text-gray-600">{row.dept}</td>
              <td className="px-4 py-3 text-right text-gray-900">{row.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
