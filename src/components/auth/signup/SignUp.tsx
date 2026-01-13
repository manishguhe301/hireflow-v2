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
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-black p-8">
        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        <p className="mt-1 text-sm text-gray-400">
          Join JobFlow and start your journey
        </p>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="mt-8 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Name</label>
            <input
              placeholder="John Doe"
              {...register('name', { required: true })}
              className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-white/30"
            />
            {errors.name && (
              <span className="text-xs text-red-400">Name is required</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Email</label>
            <input
              placeholder="johndoe@gmail.com"
              {...register('email', { required: true })}
              className="rounded-md border border-white/10 bg-black px-3 py-2 text-white outline-none focus:border-white/30"
            />
            {errors.email && (
              <span className="text-xs text-red-400">Email is required</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Password</label>

            <div className="relative">
              <input
                type={passType}
                placeholder={passType === 'password' ? '••••••••' : "J0hn@Doe#:123"}
                {...register('password', { required: true })}
                className="w-full rounded-md border border-white/10 bg-black px-3 py-2 pr-10 text-white outline-none focus:border-white/30"
              />

              <button
                type="button"
                onClick={() =>
                  setPassType(passType === 'password' ? 'text' : 'password')
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {passType === 'password' ? (
                  <Eye size={18} />
                ) : (
                  <EyeOff size={18} />
                )}
              </button>
            </div>

            {errors.password && (
              <span className="text-xs text-red-400">
                Password is required
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Role</label>

            <label className="flex items-center gap-3 rounded-md border border-white/10 px-3 py-2 text-sm text-gray-300 cursor-pointer has-checked:border-white has-checked:bg-white/10">
              <input
                type="radio"
                value={Role.JOB_SEEKER}
                {...register('role')}
                className="h-4 w-4 accent-white"
              />
              Job Seeker
            </label>

            <label className="flex items-center gap-3 rounded-md border border-white/10 px-3 py-2 text-sm text-gray-300 cursor-pointer has-[:checked]:border-white has-[:checked]:bg-white/10">
              <input
                type="radio"
                value={Role.COMPANY_ADMIN}
                {...register('role')}
                className="h-4 w-4 accent-white"
              />
              Company Admin
            </label>

          </div>

          {error && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="mt-4 rounded-md bg-white px-4 py-2 font-semibold text-black hover:bg-gray-200 transition"
            disabled={isLoading}
          >
            {isLoading ? <Spinner className='h-5 w-5' /> : ' Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 py-2">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline">
            Login instead
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
