import React from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { ProfileFormInputs } from './ProfileSetup'

const Step2Contact = ({ register, errors }: {
  register: UseFormRegister<ProfileFormInputs>,
  errors: FieldErrors<ProfileFormInputs>
}) => {
  return (
    <div>Step2Contact</div>
  )
}

export default Step2Contact