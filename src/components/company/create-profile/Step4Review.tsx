import React from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { ProfileFormInputs } from './ProfileSetup'

const Step4Review = ({ register, errors }: {
  register: UseFormRegister<ProfileFormInputs>,
  errors: FieldErrors<ProfileFormInputs>
}) => {
  return (
    <div>Step4Review</div>
  )
}

export default Step4Review