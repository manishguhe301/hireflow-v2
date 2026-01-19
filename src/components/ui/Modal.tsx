'use client'

import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import clsx from 'clsx'
import { useTheme } from 'next-themes'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

const Modal = ({ open, onClose, children, className }: ModalProps) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark';

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        // onClick={onClose}
      />

      <div
        className={clsx(
          'relative z-10 w-full max-w-lg rounded-2xl border border-border/50 text-foreground shadow-2xl',
          'animate-in fade-in zoom-in-95 duration-200',
          isDark ? 'bg-slate-950' : 'bg-slate-50',
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-foreground/70 hover:text-foreground hover:bg-muted/40 transition cursor-pointer border"
        >
          <X size={18} />
        </button>

        <div className="p-6 text-foreground">{children}</div>
      </div>
    </div>
  )
}

export default Modal
