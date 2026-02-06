'use client'

import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { X } from 'lucide-react'

type Option = {
  label: string
  value: string
}

type MultiSelectProps = {
  label: string
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  error?: string
  disabled?: boolean
}

const MultiSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Search...',
  error,
  disabled,
}: MultiSelectProps) => {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const selectedSet = useMemo(() => new Set(value), [value])

  const filteredOptions = useMemo(() => {
    return options.filter(
      (opt) =>
        !selectedSet.has(opt.value) &&
        opt.label.toLowerCase().includes(search.toLowerCase())
    )
  }, [options, search, selectedSet])

  const addValue = (val: string) => {
    onChange([...value, val])
    setSearch('')
  }

  const removeValue = (val: string) => {
    onChange(value.filter((v) => v !== val))
  }

  return (
    <div className="space-y-1 w-full">
      <label className="text-sm text-muted-foreground">{label}</label>

      <div
        className={clsx(
          'rounded-xl border bg-background px-3 py-2',
          'focus-within:ring-1 focus-within:ring-primary/40',
          error ? 'border-destructive/60' : 'border-border/60',
          disabled && 'opacity-60 pointer-events-none'
        )}
        onClick={() => setOpen(true)}
      >
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {value.map((val) => {
              const option = options.find((o) => o.value === val)
              if (!option) return null

              return (
                <span
                  key={val}
                  className="flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-xs"
                >
                  {option.label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeValue(val)
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                </span>
              )
            })}
          </div>
        )}

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {open && filteredOptions.length > 0 && (
        <div className="mt-1 max-h-48 overflow-y-auto rounded-xl border border-border/60 bg-card shadow-sm">
          {filteredOptions.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => addValue(opt.value)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export default MultiSelect
