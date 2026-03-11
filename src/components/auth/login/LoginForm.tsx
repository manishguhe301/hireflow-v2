import React from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { FormInput } from '../../ui/FormInput'
import { Button } from '../../ui/Button'
import { isValidEmail } from '@/src/utils/helper'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import Link from 'next/link'

type Inputs = {
  email: string
  password: string
}

const LoginForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const router = useRouter();
  const searchParams = useSearchParams()
  const callbackURL = searchParams.get('callbackUrl')
  const [isLoading, setIsLoading] = useState(false)

  const handleFormSubmit: SubmitHandler<Inputs> = async (data) => {
    const email = data.email.trim().toLowerCase()
    const password = data.password.trim()

    if (!isValidEmail(data.email)) {
      toast.error('Invalid email format')
      return
    }

    setIsLoading(true)

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (!res || res.error) {
        toast.error('Invalid email or password')
        return
      }

      toast.success('Login successful')
      reset()

      router.replace(callbackURL || '/redirect')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition lg:hidden"
      >
        ← Back to Home
      </Link>

      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl font-bold tracking-tight">
          Login
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormInput
          label="Email"
          type="email"
          placeholder="john@email.com"
          register={register('email', {
            required: 'Email is required',
            setValueAs: (value) => value.toLowerCase().trim(),
            validate: (value) =>
              isValidEmail(value) || 'Invalid email format',
          })}
          error={errors.email}
          focused
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

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full py-3"
        >
          Login
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-foreground hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default LoginForm