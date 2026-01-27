'use client'

import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import clsx from 'clsx'

type SelectOption = {
  label: string
  value: string
  disabled?: boolean
}

type FormSelectProps = {
  label: string
  options: SelectOption[]
  register: UseFormRegisterReturn
  placeholder?: string
  error?: FieldError
  disabled?: boolean
  className?: string
}

export const FormSelect = ({
  label,
  options,
  register,
  placeholder = 'Select an option',
  error,
  disabled,
  className,
}: FormSelectProps) => {
  return (
    <div className="space-y-1 w-full">
      <label className="text-sm text-muted-foreground">
        {label}
      </label>

      <select
        {...register}
        disabled={disabled}
        className={clsx(
          'w-full rounded-xl border px-4 py-3 text-sm outline-none transition',
          'bg-background text-foreground border-border/60',
          'focus:border-primary/40 focus:ring-1 focus:ring-primary/30',
          'appearance-none',
          disabled && 'opacity-70 cursor-not-allowed',
          error && 'border-destructive/60',
          className
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="bg-background text-foreground"
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <span className="text-xs text-destructive">
          {error.message || 'Required'}
        </span>
      )}
    </div>
  )
}
