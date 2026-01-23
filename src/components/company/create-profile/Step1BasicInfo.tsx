import React from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { ProfileFormInputs } from './ProfileSetup'

const Step1BasicInfo = ({ register, errors }: {
  register: UseFormRegister<ProfileFormInputs>,
  errors: FieldErrors<ProfileFormInputs>
}) => {
  return (
    <div>Step1BasicInfo</div>
  )
}

export default Step1BasicInfo