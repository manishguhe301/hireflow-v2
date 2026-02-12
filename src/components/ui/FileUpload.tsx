'use client'

import React, { useRef, useState } from 'react'
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form'
import clsx from 'clsx'
import { UploadCloud, CheckCircle, X, FileText } from 'lucide-react'
import Image from 'next/image'
import { formatFileSize, getFileNameFromPath, validateFileSize, validateFileType } from '@/src/utils/helper'
import Tooltip from './ToolTip'

type FileUploadProps<T extends FieldValues> = {
  label: string
  description?: string
  name: Path<T>
  register: UseFormRegister<T>
  error?: FieldError
  required?: boolean
  accept?: string
  maxSizeMB?: number
  existingFileUrl?: string | null
  isImage?: boolean
  toolTipContent?: string
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
  existingFileUrl,
  isImage = false,
  toolTipContent
}: FileUploadProps<T>) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<number | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const validateFile = (file: File) => {
    if (maxSizeMB && !validateFileSize(file, maxSizeMB)) {
      return `File size must be less than ${maxSizeMB}MB`
    }

    if (accept && !validateFileType(file, accept)) {
      return 'Invalid file type'
    }

    return true
  }

  const { ref, onChange, ...rest } = register(name, {
    required: required && !existingFileUrl ? 'This file is required' : false,
    validate: (value) => {
      if (!value?.[0]) return true
      return validateFile(value[0])
    }
  })

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFileName(null)
    setPreview(null)
    setFileSize(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const showExisting = existingFileUrl && !fileName

  return (
    <div className="space-y-2">
      <label className="text-sm text-muted-foreground flex items-center gap-1">
        <span className='flex flex-row items-center'>
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </span>
        <span>
          {
            toolTipContent && <Tooltip content={toolTipContent} />
          }
        </span>
      </label>

      {showExisting && (
        <div className="rounded-2xl border border-primary/40 bg-primary/5 p-4 space-y-3">
          <div className="flex items-center gap-3">
            {isImage ? (
              // eslint-disable-next-line
              <img
                src={existingFileUrl}
                alt="Current file"
                className="h-16 w-16 rounded-lg object-cover"
              />
            ) : (
              <FileText className="h-8 w-8 text-primary" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">{getFileNameFromPath(existingFileUrl)}</p>
              <p className="text-xs text-muted-foreground">
                Click below to replace with a new file
              </p>
            </div>
          </div>
        </div>
      )}

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
              {fileName || (showExisting ? 'Replace file' : 'Choose file')}
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
            <p>{fileSize && formatFileSize(fileSize)}</p>
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
            setFileSize(file.size)

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