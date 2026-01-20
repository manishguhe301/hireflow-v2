'use client'

import { FieldError } from 'react-hook-form'

type FormRadioGroupProps = {
  label: string
  error?: FieldError
  children: React.ReactNode
}

export const FormRadioGroup = ({
  label,
  error,
  children,
}: FormRadioGroupProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm text-muted-foreground">
        {label}
      </label>

      {children}

      {error && (
        <span className="text-xs text-destructive">
          {error.message || 'Required'}
        </span>
      )}
    </div>
  )
}
