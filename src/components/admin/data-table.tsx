export function DataTable({
  columns,
  rows,
  emptyLabel,
}: {
  columns: string[];
  rows: React.ReactNode[][];
  emptyLabel: string;
}) {
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-espresso-100/70 bg-cream-50 shadow-soft">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-espresso-100 text-xs text-espresso-400 uppercase">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-5 py-3 font-medium whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-espresso-100">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="px-5 py-4 text-espresso-700 whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && <p className="py-14 text-center text-espresso-400">{emptyLabel}</p>}
    </div>
  );
}
