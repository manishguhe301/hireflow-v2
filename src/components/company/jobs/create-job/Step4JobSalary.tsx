'use client'
import React from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { JobFormInputs } from './CreateJobForm'

const Step4JobSalary = ({
  register,
  errors,
}: {
  register: UseFormRegister<JobFormInputs>
  errors: FieldErrors<JobFormInputs>
}) => {
  return (
    <div>Step4JobSalary</div>
  )
}

export default Step4JobSalary