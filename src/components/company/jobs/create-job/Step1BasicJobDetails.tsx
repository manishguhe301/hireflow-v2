'use client'
import React from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { JobFormInputs } from './CreateJobForm'

const Step1BasicJobDetails = ({
  register,
  errors,
}: {
  register: UseFormRegister<JobFormInputs>
  errors: FieldErrors<JobFormInputs>
}) => {
  return (
    <div>Step1BasicJobDetails</div>
  )
}

export default Step1BasicJobDetails