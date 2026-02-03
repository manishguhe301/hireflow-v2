'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import { FieldError } from 'react-hook-form'

type CountryCodeOption = {
  label: string
  value: string
  country: string
  flag: string
}

type CountryCodeSelectProps = {
  label?: string
  value?: string
  options: CountryCodeOption[]
  onChange: (value: string) => void
  error?: FieldError
}

export default function CountryCodeSelect({
  label,
  value,
  options,
  onChange,
  error,
}: CountryCodeSelectProps) {
  const [open, setOpen] = useState(false)

  const selected = options.find((o) => o.value === value)

  return (
    <div className="space-y-1 relative">
      <label className="text-sm text-muted-foreground">{label}</label>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={clsx(
          'w-full rounded-xl border px-4 py-3 text-sm flex items-center justify-between',
          'bg-background border-border/60 focus:outline-none',
          error && 'border-destructive/60'
        )}
      >
        {selected ? (
          <div className="flex items-center gap-2">
            {selected.flag && (
              //eslint-disable-next-line @next/next/no-img-element
              <img
                src={selected.flag}
                alt={selected.country}
                className="h-4 w-4 rounded-sm"
              />
            )}
            <span className="font-medium">{selected.value}</span>
            <span className="text-muted-foreground">
              {selected.country}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">
            Select phone code
          </span>
        )}

        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-border/60 bg-card shadow-lg bg-background">
          {options.map((option) => (
            <button
              key={`${option.value}-${option.country}`}
              type="button"
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition"
            >
              {option.flag && (
                //eslint-disable-next-line @next/next/no-img-element
                <img
                  src={option.flag}
                  alt={option.country}
                  className="h-4 w-4 rounded-sm"
                />
              )}
              <span className="font-medium">{option.value}</span>
              <span className="text-muted-foreground">
                {option.country}
              </span>
            </button>
          ))}
        </div>
      )}

      {error && (
        <span className="text-xs text-destructive">
          {error.message}
        </span>
      )}
    </div>
  )
}
