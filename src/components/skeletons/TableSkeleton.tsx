'use client'

import Skeleton from '../ui/Skeleton'

type Props = {
  rows?: number
  columns?: number
}

export default function TableSkeleton({
  rows = 6,
  columns = 5,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
      <table className="w-full">
        <tbody>
          {[...Array(rows)].map((_, row) => (
            <tr key={row} className="border-b border-border/40">
              {[...Array(columns)].map((_, col) => (
                <td key={col} className="p-4">
                  <Skeleton height={14} width="100%" animation="wave" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}