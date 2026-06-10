export function DarkSheet() {
  const data = [
    { pair: "BTC/USD", price: "67,420.50", change: "+2.34%", vol: "34.2B", positive: true },
    { pair: "ETH/USD", price: "3,521.80", change: "-0.87%", vol: "18.1B", positive: false },
    { pair: "SOL/USD", price: "182.40", change: "+5.12%", vol: "4.3B", positive: true },
    { pair: "BNB/USD", price: "598.20", change: "+1.02%", vol: "2.8B", positive: true },
    { pair: "XRP/USD", price: "0.5840", change: "-2.14%", vol: "3.1B", positive: false },
    { pair: "ADA/USD", price: "0.4210", change: "+0.44%", vol: "1.2B", positive: true },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="px-4 py-3 text-left text-gray-400">Pair</th>
            <th className="px-4 py-3 text-right text-gray-400">Price (USD)</th>
            <th className="px-4 py-3 text-right text-gray-400">24h Change</th>
            <th className="px-4 py-3 text-right text-gray-400">Volume</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
              <td className="px-4 py-3 text-white font-mono">{row.pair}</td>
              <td className="px-4 py-3 text-right text-white font-mono">{row.price}</td>
              <td className={`px-4 py-3 text-right font-mono ${row.positive ? "text-emerald-400" : "text-red-400"}`}>
                {row.change}
              </td>
              <td className="px-4 py-3 text-right text-gray-300 font-mono">${row.vol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
