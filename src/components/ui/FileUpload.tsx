'use client'

import React, { useRef, useState } from 'react'
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form'
import clsx from 'clsx'
import { UploadCloud, CheckCircle } from 'lucide-react'

type FileUploadProps<T extends FieldValues> = {
  label: string
  description?: string
  name: Path<T>
  register: UseFormRegister<T>
  error?: FieldError
  required?: boolean
}

export function FileUpload<T extends FieldValues>({
  label,
  description,
  name,
  register,
  error,
  required,
}: FileUploadProps<T>) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const { ref, onChange, ...rest } = register(name, {
    required: required ? 'This file is required' : false,
  })

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        className={clsx(
          'flex items-center justify-between gap-4 rounded-2xl border p-4 cursor-pointer transition',
          'bg-card border-border/40 hover:bg-muted/40',
          error && 'border-destructive/60'
        )}
      >
        <div className="flex items-center gap-3">
          {fileName ? (
            <CheckCircle className="h-5 w-5 text-primary" />
          ) : (
            <UploadCloud className="h-5 w-5 text-muted-foreground" />
          )}

          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {fileName || 'Choose file'}
            </span>
            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        </div>

        <span className="text-xs text-muted-foreground">
          Click to browse
        </span>
      </div>

      <input
        type="file"
        hidden
        {...rest}
        ref={(el) => {
          ref(el)
          inputRef.current = el
        }}
        onChange={(e) => {
          onChange(e)
          const file = e.target.files?.[0]
          if (file) setFileName(file.name)
        }}
      />

      {error && (
        <p className="text-xs text-destructive">
          {error.message}
        </p>
      )}
    </div>
  )
}
