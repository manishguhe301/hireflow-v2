'use client'

import { isPasswordValid, isValidEmail, showError } from '@/src/utils/helper'
import { Role } from '@prisma/client'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'
import { AppSdk } from '@/src/utils/AppSdk'
import { useRouter } from 'next/navigation'
import { FormInput } from '../ui/FormInput'
import { Button } from '../ui/Button'

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
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 mb-6 p-0!"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>

        <h1 className="text-3xl font-bold tracking-tight">
          Create Platform Admin
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create a new platform administrator with full system access
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormInput
          label="Full name"
          placeholder="John Doe"
          register={register('name', { required: true })}
          error={errors.name}
          disabled={isLoading}
          focused
        />


        <FormInput
          label="Email"
          type="email"
          placeholder="admin@email.com"
          register={register('email', { required: true })}
          error={errors.email}
          disabled={isLoading}
        />


        <FormInput
          label="Password"
          type="password"
          placeholder="••••••••"
          register={register('password', { required: true })}
          error={errors.password}
          disabled={isLoading}
        />


        <FormInput
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          register={register('confirmPassword', {
            required: true,
            validate: (value) =>
              value === password || 'Passwords do not match',
          })}
          error={errors.confirmPassword}
          disabled={isLoading}
        />


        {error && (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          className='w-full py-3'
        >
          Create Admin
        </Button>
      </form>
    </div>
  )
}

export default CreateAdminUser
