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
    <main className="min-h-screen bg-background text-foreground grid lg:grid-cols-5">
      <aside className="hidden lg:flex lg:col-span-2 flex-col justify-between px-20 py-16 border-r border-border/30 bg-muted/20">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition"
        >
          ← Back to Home
        </Link>

        <div>
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            Hiring, done
            <span className="block text-primary mt-2">the right way.</span>
          </h1>

          <p className="mt-6 text-muted-foreground max-w-md">
            HireFlow is a focused job platform where quality candidates meet
            serious companies. No noise. No shortcuts.
          </p>

          <div className="mt-12 space-y-8">
            <div className="flex gap-4">
              <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                01
              </div>
              <div>
                <h4 className="font-semibold">Curated opportunities</h4>
                <p className="text-sm text-muted-foreground">
                  Roles reviewed for clarity, pay range, and intent.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                02
              </div>
              <div>
                <h4 className="font-semibold">Direct access</h4>
                <p className="text-sm text-muted-foreground">
                  Apply directly to teams that are actively hiring.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                03
              </div>
              <div>
                <h4 className="font-semibold">Privacy-first</h4>
                <p className="text-sm text-muted-foreground">
                  Your profile stays private until you apply.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} HireFlow
        </p>
      </aside>

      <section className="lg:col-span-3 flex items-center justify-center px-6 py-16">        <div className="w-full max-w-lg">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight">
              Create your account
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Choose your role and get started in under a minute
            </p>
          </div>

          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-4">
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
                  type="email"
                  placeholder="john@email.com"
                  {...register('email', { required: true })}
                  className="w-full rounded-xl border border-border/40 bg-background px-4 py-3 text-sm outline-none focus:border-primary/40"
                />
                {errors.email && (
                  <span className="text-xs text-destructive">Required</span>
                )}
              </div>
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
                  {passType === 'password' ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-destructive">Required</span>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm text-muted-foreground">
                What best describes you?
              </label>

              <label className="flex items-start gap-4 rounded-2xl border border-border/40 px-4 py-4 cursor-pointer has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5">
                <input
                  type="radio"
                  value={Role.JOB_SEEKER}
                  {...register('role')}
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <div>
                  <p className="font-medium">Job Seeker</p>
                  <p className="text-sm text-muted-foreground">
                    Discover and apply to relevant roles
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-4 rounded-2xl border border-border/40 px-4 py-4 cursor-pointer has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5">
                <input
                  type="radio"
                  value={Role.COMPANY_ADMIN}
                  {...register('role')}
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <div>
                  <p className="font-medium">Company Admin</p>
                  <p className="text-sm text-muted-foreground">
                    Post jobs and manage applicants
                  </p>
                </div>
              </label>
            </div>

            {error && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background hover:opacity-90 transition disabled:opacity-70"
            >
              {isLoading ? <Spinner className="h-5 w-5 mx-auto" /> : 'Create account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-foreground hover:underline">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default SignUp
