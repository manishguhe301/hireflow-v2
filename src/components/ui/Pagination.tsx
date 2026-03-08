'use client'

type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-lg border border-border/40 px-4 py-2 min-w-[40px] text-sm transition hover:bg-muted hover:-translate-y-[1px]  disabled:opacity-50"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(
          (p) =>
            p === 1 ||
            p === totalPages ||
            Math.abs(p - page) <= 1
        )
        .map((p, idx, arr) => (
          <span key={p} className="flex items-center gap-2">
            {idx > 0 && arr[idx - 1] !== p - 1 && (
              <span className="px-1 text-muted-foreground">…</span>
            )}
            <button
              onClick={() => onPageChange(p)}
              className={`rounded-lg px-4 py-2 min-w-[40px] text-sm transition ${page === p
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-border/40 hover:bg-muted hover:-translate-y-[1px]'
                }`}
            >
              {p}
            </button>
          </span>
        ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-lg border border-border/40 px-4 py-2 text-sm transition hover:bg-muted hover:-translate-y-[1px] disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}
