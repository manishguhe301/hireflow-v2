'use client'

import { isPasswordValid, isValidEmail, showError } from '@/src/utils/helper'
import { Role } from '@prisma/client'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Spinner } from '../../elements/Loader'
import Link from 'next/link'

type Inputs = {
  name: string
  email: string
  password: string
  role: Role
}

const SignUp = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: Role.JOB_SEEKER,
    },
  })

  const [error, setError] = useState('')
  const [passType, setPassType] = useState<'password' | 'text'>('password')
  const [isLoading, setIsLoading] = useState(false)

  const handleFormSubmit: SubmitHandler<Inputs> = (data) => {
    if (!isValidEmail(data.email)) {
      showError('Invalid email format', setError)
      return
    }

    if (!isPasswordValid(data.password)) {
      showError('Password must be at least 8 characters', setError)
      return
    }

    console.log('Signup data:', data)
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 relative">
      <Link
        href="/"
        className="absolute top-6 left-6 text-sm text-muted-foreground hover:text-foreground transition"
      >
        ← Back to Home
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-border/30 bg-card p-8 shadow-sm">
        <Link href="/" className="block text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            HireFlow<span className="text-primary">.</span>
          </h1>
        </Link>

        <h2 className="text-xl font-semibold tracking-tight">
          Create your account
        </h2>
        <p className="mt-1 text-sm text-muted-foreground/70">
          Join HireFlow and start your journey
        </p>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="mt-8 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground">Name</label>
            <input
              placeholder="John Doe"
              {...register('name', { required: true })}
              className="rounded-md border border-border/40 bg-background px-3 py-2 text-sm outline-none focus:border-primary/40"
            />
            {errors.name && (
              <span className="text-xs text-destructive">Name is required</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground">Email</label>
            <input
              type="email"
              placeholder="johndoe@gmail.com"
              {...register('email', { required: true })}
              className="rounded-md border border-border/40 bg-background px-3 py-2 text-sm outline-none focus:border-primary/40"
            />
            {errors.email && (
              <span className="text-xs text-destructive">Email is required</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-muted-foreground">Password</label>

            <div className="relative">
              <input
                type={passType}
                placeholder={passType === 'password' ? '••••••••' : 'J0hn@Doe#:123'}
                {...register('password', { required: true })}
                className="w-full rounded-md border border-border/40 bg-background px-3 py-2 pr-10 text-sm outline-none focus:border-primary/40"
              />

              <button
                type="button"
                onClick={() =>
                  setPassType(passType === 'password' ? 'text' : 'password')
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {passType === 'password' ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            {errors.password && (
              <span className="text-xs text-destructive">
                Password is required
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Role</label>

            <label className="flex items-center gap-3 rounded-md border border-border/40 px-3 py-2 text-sm cursor-pointer has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5">
              <input
                type="radio"
                value={Role.JOB_SEEKER}
                {...register('role')}
                className="h-4 w-4 accent-primary"
              />
              Job Seeker
            </label>

            <label className="flex items-center gap-3 rounded-md border border-border/40 px-3 py-2 text-sm cursor-pointer has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5">
              <input
                type="radio"
                value={Role.COMPANY_ADMIN}
                {...register('role')}
                className="h-4 w-4 accent-primary"
              />
              Company Admin
            </label>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90 transition disabled:opacity-70"
          >
            {isLoading ? <Spinner className="h-5 w-5" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground py-3">
          Already have an account?{' '}
          <Link href="/login" className="text-foreground hover:underline">
            Login instead
          </Link>
        </p>
      </div>
    </main>
  );

}

export default SignUp
