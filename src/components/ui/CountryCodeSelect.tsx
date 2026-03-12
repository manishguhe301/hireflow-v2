'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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
  disabled?: boolean
}

export default function CountryCodeSelect({
  label,
  value,
  options,
  onChange,
  error,
}: CountryCodeSelectProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [search, setSearch] = useState('')

  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  )

  const filteredOptions = useMemo(() => {
    if (!search) return options

    const query = search.toLowerCase()

    return options.filter(
      (o) =>
        o.country.toLowerCase().includes(query) ||
        o.value.includes(query)
    )
  }, [options, search])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])


  return (
    <div className="space-y-1 relative" ref={wrapperRef}>
      <label className="text-sm text-muted-foreground">{label}</label>

      <button
        type="button"
        onClick={() => {
          setOpen((v) => {
            if (v) setSearch('')
            return !v
          })
        }}
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
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-border/60 bg-card shadow-lg bg-background">
          <div className="p-2 border-b border-border/60">
            <input
              type="text"
              placeholder="Search country or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md border border-border/60 bg-background focus:outline-none"
            />
          </div>
          {
            filteredOptions.length > 0 ?
              <div className="max-h-52 overflow-auto">
                {filteredOptions.map((option) => (
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
              </div> : (
                <div className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition">
                  No results found
                </div>
              )}
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
