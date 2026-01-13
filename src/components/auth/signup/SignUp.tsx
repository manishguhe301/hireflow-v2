'use client'
import { isPasswordValid, isValidEmail, showError } from '@/src/utils/helper'
import { Role } from '@prisma/client'
import { Eye, EyeClosed, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

type Inputs = {
  name: string
  email: string
  password: string
  role: string
}



const SignUp = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: ''
    }
  })
  const [error, setError] = useState('')
  const [passType, setPassType] = useState('password')

  const handleFormSubmit: SubmitHandler<Inputs> = (data) => {
    if (!isValidEmail(data.email)) {
      showError('Invalid email format', setError)
      return;
    }
    if (!isPasswordValid(data.password)) {
      showError('Password must be at least 8 characters', setError)
      return;
    }
    if (!data.role) {
      showError('Role is required', setError)
      return
    }
    console.log(data);
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className='flex flex-col gap-2'
      >
        <div className='flex flex-col gap-2'>
          <label>Name</label>
          <input
            placeholder='John Doe'
            {...register("name", { required: true })}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && <span>Name is required</span>}
        </div>
        <div className='flex flex-col gap-2'>
          <label>Email</label>
          <input
            placeholder='johndoe@gmail.com'
            {...register("email", { required: true })}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && <span>Email is required</span>}
        </div>
        <div className='flex flex-col gap-2'>
          <label>Password</label>
          <input
            placeholder='johndoe@221133:#23'
            type={passType}
            {...register("password", { required: true })}
            aria-invalid={errors.password ? "true" : "false"}
          />
          {passType === 'password' ?
            <Eye className='cursor-pointer' onClick={() => setPassType('text')} /> :
            <EyeOff className='cursor-pointer' onClick={() => setPassType('password')} />
          }
          {errors.password && <span>Password is required</span>}
        </div>
        <div className='flex flex-col gap-2'>
          <label>Role</label>
          <div className='flex items-center gap-2'>
            <input
              type='radio'
              defaultChecked
              value={Role.JOB_SEEKER}
              {...register("role")}
            />
            <label htmlFor={Role.JOB_SEEKER}>Job Seeker</label>
          </div>
          <div className='flex items-center gap-2'>
            <input
              type='radio'
              value={Role.COMPANY_ADMIN}
              {...register("role")}
            />
            <label htmlFor={Role.JOB_SEEKER}>Company Admin</label>
          </div>
        </div>
        {error && <span>{error}</span>}
        <input type="submit" />
      </form>
    </div>
  )
}

export default SignUp