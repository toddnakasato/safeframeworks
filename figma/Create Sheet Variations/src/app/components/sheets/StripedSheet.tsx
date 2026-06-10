export function StripedSheet() {
  const data = [
    { product: "Pro Plan", q1: 1200, q2: 1540, q3: 1390, q4: 1780 },
    { product: "Basic Plan", q1: 840, q2: 920, q3: 870, q4: 990 },
    { product: "Enterprise", q1: 3200, q2: 4100, q3: 3800, q4: 5200 },
    { product: "Starter", q1: 340, q2: 410, q3: 390, q4: 450 },
    { product: "Team Plan", q1: 1800, q2: 2100, q3: 1950, q4: 2400 },
    { product: "Add-ons", q1: 220, q2: 310, q3: 280, q4: 360 },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-indigo-600 text-white">
            <th className="px-4 py-3 text-left">Product</th>
            <th className="px-4 py-3 text-right">Q1</th>
            <th className="px-4 py-3 text-right">Q2</th>
            <th className="px-4 py-3 text-right">Q3</th>
            <th className="px-4 py-3 text-right">Q4</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-indigo-50"}>
              <td className="px-4 py-3 text-gray-900">{row.product}</td>
              <td className="px-4 py-3 text-right text-gray-700">${row.q1.toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-gray-700">${row.q2.toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-gray-700">${row.q3.toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-gray-700">${row.q4.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-indigo-200 bg-indigo-50">
            <td className="px-4 py-3 text-gray-800">Total</td>
            {["q1","q2","q3","q4"].map(q => (
              <td key={q} className="px-4 py-3 text-right text-gray-900">
                ${data.reduce((sum, r) => sum + r[q as keyof typeof r] as number, 0).toLocaleString()}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
