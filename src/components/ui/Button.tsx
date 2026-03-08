'use client'

import { Spinner } from '@/src/components/elements/Loader'
import clsx from 'clsx'
import { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'danger' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = {
  children: ReactNode
  isLoading?: boolean
  loadingText?: string
  variant?: ButtonVariant
  size?: ButtonSize
} & ButtonHTMLAttributes<HTMLButtonElement>

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground border-primary/30 hover:opacity-90',
  danger:
    'bg-destructive text-destructive-foreground border-destructive/40 hover:opacity-90',
  outline:
    'bg-transparent text-foreground border-border/50 hover:bg-muted/50',
  ghost:
    'bg-transparent text-foreground border-transparent hover:bg-muted/40',
}


const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1 text-xs rounded-xl',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3.5 text-base rounded-xl',
}

export const Button = ({
  children,
  isLoading,
  loadingText,
  variant = 'primary',
  size = 'md',
  disabled,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={clsx(
        'w-fit font-semibold border transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        'disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      aria-label={props['aria-label']}
    >
      {isLoading ? (
        loadingText ? (
          loadingText
        ) : (
          <Spinner className="h-5 w-5 mx-auto" />
        )
      ) : (
        children
      )}
    </button>
  )
}
