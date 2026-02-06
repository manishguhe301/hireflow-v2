'use client'

import clsx from 'clsx'
import { FieldError } from 'react-hook-form'

type FormDatePickerProps = {
  label: string
  value?: Date
  onChange: (date?: Date) => void
  error?: FieldError
  minDate?: Date
  disabled?: boolean
}

const FormDatePicker = ({
  label,
  value,
  onChange,
  error,
  minDate,
  disabled,
}: FormDatePickerProps) => {
  return (
    <div className="space-y-1 w-full">
      <label className="text-sm text-muted-foreground">
        {label}
      </label>

      <input
        type="date"
        value={value ? value.toISOString().split('T')[0] : ''}
        min={minDate ? minDate.toISOString().split('T')[0] : undefined}
        onChange={(e) =>
          onChange(e.target.value ? new Date(e.target.value) : undefined)
        }
        disabled={disabled}
        className={clsx(
          'w-full rounded-xl border px-4 py-3 text-sm outline-none transition',
          'bg-background text-foreground border-border/60',
          'focus:border-primary/40 focus:ring-1 focus:ring-primary/30',
          disabled && 'opacity-60 cursor-not-allowed',
          error && 'border-destructive/60'
        )}
      />

      {error && (
        <p className="text-xs text-destructive">
          {error.message}
        </p>
      )}
    </div>
  )
}

export default FormDatePicker