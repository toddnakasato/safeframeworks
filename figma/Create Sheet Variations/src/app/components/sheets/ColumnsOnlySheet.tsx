export function ColumnsOnlySheet() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-900">
            <th className="px-4 py-4 text-left text-gray-900">Date</th>
            <th className="px-4 py-4 text-left text-gray-900">Description</th>
            <th className="px-4 py-4 text-left text-gray-900">Category</th>
            <th className="px-4 py-4 text-right text-gray-900">Amount</th>
            <th className="px-4 py-4 text-right text-gray-900">Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={5} className="px-4 py-16 text-center text-gray-400 italic">
              No transactions yet
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
