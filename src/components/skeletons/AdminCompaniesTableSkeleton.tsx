'use client'

import Skeleton from '../ui/Skeleton'

export default function AdminCompaniesTableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border/60">
          <tr className="text-left">
            {['Company', 'Industry', 'Location', 'Status', 'Actions'].map(
              (col) => (
                <th key={col} className="px-6 py-4 font-medium">
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 4 }).map((_, i) => (
            <tr
              key={i}
              className="border-b border-border/40 last:border-none"
            >
              <td className="px-6 py-4">
                <div className="flex flex-col  gap-3">
                  <Skeleton width={140} height={14} animation="wave" />
                  <Skeleton width={140} height={8} animation="wave" />
                </div>
              </td>
              <td className="px-6 py-4">
                <Skeleton width={120} height={14} animation="wave" />
              </td>
              <td className="px-6 py-4">
                <Skeleton width={120} height={14} animation="wave" />
              </td>
              <td className="px-6 py-4">
                <Skeleton width={80} height={20} variant="rounded" animation="wave" />
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <Skeleton width={70} height={15} variant="rounded" animation="wave" />
                  <Skeleton width={70} height={15} variant="rounded" animation="wave" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}