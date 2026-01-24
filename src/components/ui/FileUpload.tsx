'use client'

import React, { useRef, useState } from 'react'
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form'
import clsx from 'clsx'
import { UploadCloud, CheckCircle, X } from 'lucide-react'
import Image from 'next/image'

type FileUploadProps<T extends FieldValues> = {
  label: string
  description?: string
  name: Path<T>
  register: UseFormRegister<T>
  error?: FieldError
  required?: boolean
  accept?: string
  maxSizeMB?: number
}

export function FileUpload<T extends FieldValues>({
  label,
  description,
  name,
  register,
  error,
  required = false,
  accept,
  maxSizeMB,
}: FileUploadProps<T>) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const validateFile = (file: File) => {
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeMB}MB`
    }

    if (accept) {
      const allowedTypes = accept.split(',').map(t => t.trim())
      const isValidType = allowedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', ''))
        }
        return file.type === type
      })

      if (!isValidType) {
        return 'Invalid file type'
      }
    }

    return true
  }

  const { ref, onChange, ...rest } = register(name, {
    required: required ? 'This file is required' : false,
    validate: (value) => {
      if (!value?.[0]) return true
      return validateFile(value[0])
    }
  })

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFileName(null)
    setPreview(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

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
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {fileName ? (
            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
          ) : (
            <UploadCloud className="h-5 w-5 text-muted-foreground shrink-0" />
          )}

          <div className="flex flex-col min-w-0 flex-1">
            <span
              className="text-sm font-medium truncate"
              title={fileName || undefined}
            >
              {fileName || 'Choose file'}
            </span>

            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {fileName && (
            <button
              type="button"
              onClick={handleRemoveFile}
              className="p-1 rounded-full hover:bg-destructive/10 text-destructive transition"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Click to browse
          </span>
        </div>
      </div>

      {preview && (
        <div className="mt-3 flex items-center gap-3">
          <div className="relative">
            <Image
              src={preview}
              alt="Preview"
              className="h-20 w-20 rounded-lg object-cover border border-border/40"
              height={80}
              width={80}
            />
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition"
              aria-label="Remove preview"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">{fileName}</p>
            <p>{(preview.length / 1024).toFixed(2)} KB</p>
          </div>
        </div>
      )}

      <input
        type="file"
        hidden
        accept={accept}
        {...rest}
        ref={(el) => {
          ref(el)
          inputRef.current = el
        }}
        onChange={(e) => {
          onChange(e)
          const file = e.target.files?.[0]
          if (file) {
            setFileName(file.name)

            if (file.type.startsWith('image/')) {
              const reader = new FileReader()
              reader.onloadend = () => setPreview(reader.result as string)
              reader.readAsDataURL(file)
            } else {
              setPreview(null)
            }
          }
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