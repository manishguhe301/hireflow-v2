import React from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { ProfileFormInputs } from './ProfileSetup'

const Step3Documents = ({ register, errors }: {
  register: UseFormRegister<ProfileFormInputs>,
  errors: FieldErrors<ProfileFormInputs>
}) => {
  return (
    <div>Step3Documents</div>
  )
}

export default Step3Documents