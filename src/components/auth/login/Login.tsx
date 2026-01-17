'use client'

import { isValidEmail, showError } from '@/src/utils/helper'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Spinner } from '../../elements/Loader'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

type Inputs = {
  email: string
  password: string
}

const Login = () => {
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
  const router = useRouter()
  const [passType, setPassType] = useState<'password' | 'text'>('password')
  const [isLoading, setIsLoading] = useState(false)

  const handleFormSubmit: SubmitHandler<Inputs> = async (data) => {
    const email = data.email.trim()
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

      router.replace('/redirect')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
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
            Welcome back to HireFlow
            <span className="block text-primary mt-2">sign in.</span>
          </h1>

          <p className="mt-6 text-muted-foreground max-w-md">
            Sign in to access your dashboard, manage applications, and continue your hiring or job search journey.
          </p>


          <div className="mt-12 space-y-8">
            <div className="flex gap-4">
              <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                01
              </div>
              <div>
                <h4 className="font-semibold">Secure access</h4>
                <p className="text-sm text-muted-foreground">
                  Your account is protected with role-based access and verified authentication.
                </p>

              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                02
              </div>
              <div>
                <h4 className="font-semibold">Continue where you left off</h4>
                <p className="text-sm text-muted-foreground">
                  Resume applications, job postings, and profile updates seamlessly.
                </p>

              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                03
              </div>
              <div>
                <h4 className="font-semibold">Trusted hiring platform</h4>
                <p className="text-sm text-muted-foreground">
                  Join a verified ecosystem of approved companies and genuine candidates.
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
              Login
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>

          </div>

          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <div className="space-y-1">
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">Email</label>
                <input
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
              {isLoading ? <Spinner className="h-5 w-5 mx-auto" /> : 'Login'}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-foreground hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Login