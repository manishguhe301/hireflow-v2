'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import clsx from 'clsx'
import Tooltip from './ToolTip'

type FormInputProps = {
  label: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel'
  register: UseFormRegisterReturn
  error?: FieldError
  disabled?: boolean
  className?: string
  minLength?: number
  maxLength?: number
  toolTipContent?: string
}

export const FormInput = ({
  label,
  placeholder,
  type = 'text',
  register,
  error,
  disabled,
  className,
  minLength,
  maxLength,
  toolTipContent
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'

  return (
    <div className="space-y-1 w-full">
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        {label}

        {toolTipContent && <Tooltip
          content={
            toolTipContent
          }
        />}
      </label>

      <div className="relative">
        <input
          {...register}
          disabled={disabled}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          className={clsx(
            'w-full rounded-xl border px-4 py-3 text-sm outline-none transition',
            'bg-background text-foreground border-border/60 focus:border-primary/40 focus:ring-1 focus:ring-primary/30',
            'appearance-none',
            type === 'number' &&
            '[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]',
            disabled && 'opacity-70 cursor-not-allowed',
            error && 'border-destructive/60',
            className
          )}
          min={minLength}
          max={maxLength}
        />


        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <span className="text-xs text-destructive">
          {error.message || 'Required'}
        </span>
      )}
    </div>
  )
}
