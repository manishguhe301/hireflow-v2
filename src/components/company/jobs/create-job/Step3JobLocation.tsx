'use client'
import React from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { JobFormInputs } from './CreateJobForm'

const Step3JobLocation = ({
  register,
  errors,
}: {
  register: UseFormRegister<JobFormInputs>
  errors: FieldErrors<JobFormInputs>
}) => {
  return (
    <div>Step3JobLocation</div>
  )
}

export default Step3JobLocation