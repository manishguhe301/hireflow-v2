'use client'
import React from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { JobFormInputs } from './CreateJobForm'

const Step2JobRequirements = ({
  register,
  errors,
}: {
  register: UseFormRegister<JobFormInputs>
  errors: FieldErrors<JobFormInputs>
}) => {
  return (
    <div>Step2JobRequirements</div>
  )
}

export default Step2JobRequirements