import { APPLICATIONS_TABS } from '@/src/utils/constants'
import { getLabel } from '@/src/utils/helper'
import { FileText } from 'lucide-react'
import React from 'react'
import { Button } from '../../ui/Button'
import { ApplicationStatus } from '@prisma/client'

interface NoApplicationsProps {
  activeTab: "ALL" | ApplicationStatus
  search: string
  setActiveTab: React.Dispatch<React.SetStateAction<"ALL" | ApplicationStatus>>
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

const NoApplications = ({
  activeTab,
  search,
  setActiveTab,
  setSearch
}: NoApplicationsProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
      <FileText className="h-10 w-10 text-muted-foreground" />

      <p className="text-lg font-medium">
        No applicants found
      </p>

      <p className="text-sm text-muted-foreground max-w-md">
        {activeTab !== 'ALL' && search
          ? `No applicants match the "${getLabel(
            APPLICATIONS_TABS,
            activeTab,
          )}" status with search term "${search}". `
          : activeTab !== 'ALL'
            ? `No applicants found under "${getLabel(
              APPLICATIONS_TABS,
              activeTab,
            )}" status. `
            : search
              ? `No applicants match the search term "${search}". `
              : `There are no applicants for this job yet. `}
        try adjusting your filters to find what you&apos;re looking for.
      </p>

      {(activeTab !== 'ALL' || search) && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setActiveTab('ALL')
            setSearch('')
          }}
        >
          Clear Filters
        </Button>
      )}
    </div>
  )
}

export default NoApplications