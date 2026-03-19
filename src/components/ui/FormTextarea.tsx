'use client'

import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

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
  const [length, setLength] = useState(0)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const { onChange, ref, ...restRegister } = register

  useEffect(() => {
    if (textareaRef.current) {
      setLength(textareaRef.current.value.length)
    }
  }, [])

  return (
    <div className="space-y-1">
      <label className="text-sm text-muted-foreground">
        {label}
      </label>

      <textarea
        {...restRegister}
        ref={(el) => {
          textareaRef.current = el
          ref(el)
        }}
        onChange={(e) => {
          setLength(e.target.value.length)
          onChange(e)
        }}
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
        <span className={clsx(
          length > maxLength * 0.9 && "text-destructive"
        )}>
          {length} / {maxLength}
        </span>
      </div>
    </div>
  )
}