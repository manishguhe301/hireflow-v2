'use client'

import { isPasswordValid, isValidEmail, showError } from '@/src/utils/helper'
import { Role } from '@prisma/client'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { AppSdk } from '@/src/utils/AppSdk'
import { useRouter } from 'next/navigation'
import { Spinner } from '../elements/Loader'

type Inputs = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const CreateAdminUser = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = watch('password')
  const router = useRouter()

  const [error, setError] = useState('')
  const [passType, setPassType] = useState<'password' | 'text'>('password')
  const [confirmPassType, setConfirmPassType] = useState<'password' | 'text'>(
    'password'
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleFormSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!isValidEmail(data.email)) {
      showError('Invalid email format', setError)
      return
    }

    if (!isPasswordValid(data.password)) {
      showError('Password must be at least 8 characters', setError)
      return
    }

    setIsLoading(true)

    const payload = {
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password.trim(),
      role: Role.PLATFORM_ADMIN,
    }

    try {
      const res = await AppSdk.postData('/api/admin/create-admin', payload)

      if (res.error) {
        toast.error(res.error || 'Something went wrong')
        return
      }

      toast.success('Platform admin created successfully')
      reset()
      setError('')
      // router.push('/admin/users')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 md:px-8 w-full max-w-xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </button>
        <h1 className="text-3xl font-bold tracking-tight">
          Create Platform Admin
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create a new platform administrator with full system access
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Full name</label>
          <input
            placeholder="John Doe"
            {...register('name', { required: true })}
            className="w-full rounded-xl border border-border/40 bg-background px-4 py-3 text-sm outline-none focus:border-primary/40"
          />
          {errors.name && (
            <span className="text-xs text-destructive">Required</span>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Email</label>
          <input
            placeholder="admin@email.com"
            {...register('email', { required: true })}
            className="w-full rounded-xl border border-border/40 bg-background px-4 py-3 text-sm outline-none focus:border-primary/40"
          />
          {errors.email && (
            <span className="text-xs text-destructive">Required</span>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Password</label>
          <div className="relative">
            <input
              type={passType}
              placeholder="••••••••"
              {...register('password', { required: true })}
              className="w-full rounded-xl border border-border/40 bg-background px-4 py-3 pr-12 text-sm outline-none focus:border-primary/40"
            />
            <button
              type="button"
              onClick={() =>
                setPassType(passType === 'password' ? 'text' : 'password')
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {passType === 'password' ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">
            Confirm password
          </label>
          <div className="relative">
            <input
              type={confirmPassType}
              placeholder="••••••••"
              {...register('confirmPassword', {
                required: true,
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              className="w-full rounded-xl border border-border/40 bg-background px-4 py-3 pr-12 text-sm outline-none focus:border-primary/40"
            />
            <button
              type="button"
              onClick={() =>
                setConfirmPassType(
                  confirmPassType === 'password' ? 'text' : 'password'
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {confirmPassType === 'password' ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {error && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="
            w-full rounded-2xl
            border border-border/40
            bg-foreground
            px-4 py-3
            text-sm font-semibold
            text-background
            transition
            hover:opacity-90
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-primary/40
            disabled:opacity-70
          "
        >
          {isLoading ? (
            <Spinner className="h-5 w-5 mx-auto" />
          ) : (
            'Create Admin'
          )}
        </button>
      </form>
    </div>
  )
}

export default CreateAdminUser
