export function CompactSheet() {
  const data = Array.from({ length: 12 }, (_, i) => ({
    id: `#${1001 + i}`,
    item: ["Widget A","Gadget B","Tool C","Part D","Module E","Unit F"][i % 6],
    qty: Math.floor(Math.random() * 100) + 1,
    price: (Math.random() * 50 + 5).toFixed(2),
    total: ((Math.random() * 5000) + 100).toFixed(2),
  }));

  return (
    <div className="overflow-hidden rounded border border-gray-200 bg-white text-xs shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="px-2 py-1.5 text-left">ID</th>
            <th className="px-2 py-1.5 text-left">Item</th>
            <th className="px-2 py-1.5 text-right">Qty</th>
            <th className="px-2 py-1.5 text-right">Unit Price</th>
            <th className="px-2 py-1.5 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
              <td className="px-2 py-1 text-gray-500 font-mono">{row.id}</td>
              <td className="px-2 py-1 text-gray-800">{row.item}</td>
              <td className="px-2 py-1 text-right text-gray-700">{row.qty}</td>
              <td className="px-2 py-1 text-right text-gray-700">${row.price}</td>
              <td className="px-2 py-1 text-right text-gray-900">${row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
