'use client'

import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import clsx from 'clsx'

type FormTextareaProps = {
  label: string
  placeholder?: string
  register: UseFormRegisterReturn
  error?: FieldError
  disabled?: boolean
  rows?: number
  className?: string
  maxLength?: number
}

export const FormTextarea = ({
  label,
  placeholder,
  register,
  error,
  disabled,
  rows = 4,
  className,
  maxLength = 500,
}: FormTextareaProps) => {
  return (
    <div className="space-y-1">
      <label className="text-sm text-muted-foreground">
        {label}
      </label>

      <textarea
        {...register}
        maxLength={maxLength}
        disabled={disabled}
        rows={rows}
        placeholder={placeholder}
        className={clsx(
          'w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition',
          'bg-background text-foreground border-border/60',
          'focus:border-primary/40 focus:ring-1 focus:ring-primary/30',
          disabled && 'opacity-70 cursor-not-allowed',
          error && 'border-destructive/60',
          className
        )}
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{error?.message}</span>
        <span>Max {maxLength} characters</span>
      </div>
    </div>
  )
}

