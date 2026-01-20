'use client'

import { UseFormRegisterReturn } from 'react-hook-form'
import clsx from 'clsx'

type FormRadioCardProps = {
  value: string
  title: string
  description?: string
  register: UseFormRegisterReturn
}

export const FormRadioCard = ({
  value,
  title,
  description,
  register,
}: FormRadioCardProps) => {
  return (
    <label
      className={clsx(
        'flex items-start gap-4 rounded-2xl border px-4 py-4 cursor-pointer transition',
        'border-border/40',
        'has-[:checked]:border-primary/40',
        'has-[:checked]:bg-primary/5'
      )}
    >
      <input
        type="radio"
        value={value}
        {...register}
        className="sr-only peer"
      />

      <div
        className={clsx(
          'mt-1 h-4 w-4 rounded-full border-2 transition',
          'border-border',
          'peer-checked:border-primary',
          'peer-checked:border-[5px]'
        )}
      />

      <div>
        <p className="font-medium">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </label>
  )
}
