import { Company, Job } from '@prisma/client'
import React from 'react'

type CompanyPublicViewProps = {
  company: Company,
  jobs: Job[]
}

const CompanyPublicView = ({
  company, jobs
}: CompanyPublicViewProps) => {
  return (
    <div>CompanyPublicView</div>
  )
}

export default CompanyPublicView