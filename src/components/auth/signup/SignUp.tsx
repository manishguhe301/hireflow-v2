'use client'

import { isPasswordValid, isValidEmail, showError } from '@/src/utils/helper'
import { Role } from '@prisma/client'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import Link from 'next/link'
import { toast } from 'sonner'
import { AppSdk } from '@/src/utils/AppSdk'
import { useRouter } from 'next/navigation'
import { FormInput } from '../../ui/FormInput'
import { FormRadioGroup } from '../../ui/FormRadioGroup'
import { FormRadioCard } from '../../ui/FormRadioCard'
import { Button } from '../../ui/Button'

type Inputs = {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: Role
}


const SignUp = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: Role.JOB_SEEKER,
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

    const user = {
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password.trim(),
      role: data.role.trim()
    }

    try {
      const res = await AppSdk.postData('/api/auth/signup', user)

      if (res.error) {
        toast.error(res.error || 'Something went wrong. Please try again.')
        return;
      }

      let countdown = 3

      const toastId = toast.success(`Redirecting to login in ${countdown}s...`)

      const interval = setInterval(() => {
        countdown -= 1

        if (countdown > 0) {
          toast.success(`Account created successfully. Redirecting to login in ${countdown}s...`, {
            id: toastId,
          })
        } else {
          clearInterval(interval)
          toast.dismiss(toastId)
          router.push('/login')
        }
      }, 1000)

      reset()
      setError('')
    }
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      console.error(error);
      toast.error(error?.error || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
            Join HireFlow
            <span className="block text-primary mt-2">today.</span>
          </h1>

          <p className="mt-6 text-muted-foreground max-w-md">
            A verified job platform with three-tier system ensuring quality hiring for both companies and job seekers.
          </p>

          <div className="mt-12 space-y-8">
            <div className="flex gap-4">
              <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                01
              </div>
              <div>
                <h4 className="font-semibold">Verified companies only</h4>
                <p className="text-sm text-muted-foreground">
                  Every company is manually approved by platform admins.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                02
              </div>
              <div>
                <h4 className="font-semibold">Real-time tracking</h4>
                <p className="text-sm text-muted-foreground">
                  Track your applications from &quot;Applied&quot; to &quot;Hired&quot; with complete transparency.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                03
              </div>
              <div>
                <h4 className="font-semibold">Complete profiles</h4>
                <p className="text-sm text-muted-foreground">
                  Build detailed profiles with resume, skills, experience, and certifications.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} HireFlow
        </p>
      </aside>

      <section className="lg:col-span-3 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition lg:hidden"
          >
            ← Back to Home
          </Link>
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
              <FormInput
                label='Full Name'
                placeholder='John Doe'
                type='text'
                register={register('name', { required: true })}
                error={errors.name}
              />
              <FormInput
                label="Email"
                type="email"
                placeholder="john@email.com"
                register={register('email', { required: true })}
                error={errors.email}
              />
            </div>
            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              register={register('password', { required: true })}
              error={errors.password}
            />
            <FormInput
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              register={register('confirmPassword', {
                required: true, validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              error={errors.confirmPassword}
            />


            <FormRadioGroup
              label="What best describes you?"
              error={errors.role}
            >
              <FormRadioCard
                value={Role.JOB_SEEKER}
                title="Job Seeker"
                description="Discover and apply to relevant roles"
                register={register('role', { required: true })}
              />

              <FormRadioCard
                value={Role.COMPANY_ADMIN}
                title="Company Admin"
                description="Post jobs and manage applicants"
                register={register('role', { required: true })}
              />
            </FormRadioGroup>


            {error && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <Button
              type='submit'
              isLoading={isLoading}
            >
              Create account
            </Button>
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
