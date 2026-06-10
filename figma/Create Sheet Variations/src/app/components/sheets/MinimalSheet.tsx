export function MinimalSheet() {
  return (
    <div className="bg-white">
      <table className="w-full text-sm">
        <tbody className="divide-y divide-gray-100">
          {[
            { label: "Total Users", value: "24,521" },
            { label: "Active Sessions", value: "1,284" },
            { label: "Conversion Rate", value: "3.6%" },
            { label: "Avg. Session Duration", value: "4m 32s" },
            { label: "Bounce Rate", value: "41.2%" },
            { label: "New Signups Today", value: "87" },
          ].map((item, i) => (
            <tr key={i}>
              <td className="py-3 text-gray-500">{item.label}</td>
              <td className="py-3 text-right text-gray-900">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
