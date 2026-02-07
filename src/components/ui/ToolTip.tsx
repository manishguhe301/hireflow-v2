'use client'

import { Info } from 'lucide-react'
import clsx from 'clsx'
import { useState } from 'react'

type TooltipProps = {
  content: React.ReactNode
}

const Tooltip = ({ content }: TooltipProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />

      {open && (
        <div
          className={clsx(
            'absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2',
            'w-64 rounded-lg border border-border bg-background! shadow-lg',
            'p-3 text-xs text-foreground'
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}

export default Tooltip
