import React, { useState } from 'react'
import { Briefcase } from 'lucide-react'
import { formatRelativeTime, getLabel } from '@/src/utils/helper'
import clsx from 'clsx'
import { ApplicationStatus } from '@prisma/client'
import Link from 'next/link'
import { Button } from '../../ui/Button'
import WithdrawModal from './WithdrawModal'
import { APPLICATIONS_TABS } from '@/src/utils/constants'
import { DataTable, DataTableBody, DataTableCell, DataTableHeadCell, DataTableHeader, DataTableRow } from '../../shared/TableComponents'
import { ApplicationWithPagination } from '@/src/types'

export const STATUS_STYLE: Record<ApplicationStatus, string> = {
  APPLIED: 'bg-blue-500/10 text-blue-600',
  REVIEWING: 'bg-yellow-500/10 text-yellow-600',
  SHORTLISTED: 'bg-purple-500/10 text-purple-600',
  INTERVIEW_SCHEDULED: 'bg-indigo-500/10 text-indigo-600',
  OFFERED: 'bg-green-500/10 text-green-600',
  HIRED: 'bg-emerald-500/10 text-emerald-600',
  REJECTED: 'bg-red-500/10 text-red-600',
  ON_HOLD: 'bg-gray-500/10 text-gray-600',
}

const ApplicationsTable = ({ data, refetch, disabled }:
  {
    data: ApplicationWithPagination | null
    refetch: () => void
    disabled?: boolean
  }) => {
  const [isWithDrawModalOpen, setIsWithDrawModalOpen] = useState(false)
  const [withdrawApplicationId, setWithdrawApplicationId] = useState<string | null>(null)

  if (!data) return null
  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
      <DataTable className={clsx("w-full text-sm max-sm:w-[1400px]", disabled && 'opacity-60 cursor-not-allowed')}>
        <DataTableHeader className="bg-muted/50 border-b border-border/60 text-xs uppercase tracking-wide text-muted-foreground">
          <DataTableRow>
            <DataTableHeadCell>Job</DataTableHeadCell>
            <DataTableHeadCell>Status</DataTableHeadCell>
            <DataTableHeadCell>Applied</DataTableHeadCell>
            <DataTableHeadCell>Last Updated</DataTableHeadCell>
            <DataTableHeadCell className=" text-right">Actions</DataTableHeadCell>
          </DataTableRow>
        </DataTableHeader>
        <DataTableBody>
          {data.applications.length === 0 && (
            <DataTableRow>
              <DataTableCell colSpan={5} className="text-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <Briefcase className="h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    You haven&apos;t applied to any jobs yet
                  </p>

                  <Link href="/jobs">
                    <Button size="sm" className="mt-4">
                      Browse Jobs
                    </Button>
                  </Link>
                </div>
              </DataTableCell>
            </DataTableRow>
          )}

          {data.applications.map((app) => (
            <DataTableRow
              key={app.id}
              className="hover:bg-muted/30 transition"
            >
              <DataTableCell >
                <div className="font-medium">
                  {app.job.title}
                </div>
                <Button variant='ghost' className='p-0!' disabled={disabled}>
                  <Link
                    href={disabled ? '#' : `/company-details/${app.job.company.id}`} className="text-xs text-muted-foreground hover:underline hover:text-primary hover:opacity-90 hover:underline-offset-2 hover:font-medium transition-all duration-300"
                  >
                    {app.job.company.name}
                  </Link>
                </Button>
              </DataTableCell>

              <DataTableCell >
                <span
                  className={clsx(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    STATUS_STYLE[app.status],
                  )}
                >
                  {getLabel(APPLICATIONS_TABS, app.status)}
                </span>
              </DataTableCell>

              <DataTableCell className="text-xs text-muted-foreground">
                {formatRelativeTime(app.createdAt)}
              </DataTableCell>

              <DataTableCell className="text-xs text-muted-foreground">
                {formatRelativeTime(app.updatedAt)}
              </DataTableCell>

              <DataTableCell className="px-6! py-6! text-right flex items-center justify-end gap-2">
                <Link
                  href={disabled ? '#' : `/jobs/${app.job.slug}`}
                  className={clsx("text-primary text-xs hover:underline font-semibold", app.status === 'REJECTED' && 'py-1')}
                >
                  View Job & Status
                </Link>
                {!['REJECTED', 'HIRED', 'OFFERED'].includes(app.status) &&
                  <Button
                    className=" text-xs hover:underline"
                    size='sm'
                    variant='danger'
                    disabled={disabled}
                    onClick={() => {
                      setWithdrawApplicationId(app.id)
                      setIsWithDrawModalOpen(true)
                    }}
                  >
                    Withdraw Application
                  </Button>}
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>
      <WithdrawModal
        isWithDrawModalOpen={isWithDrawModalOpen}
        id={withdrawApplicationId}
        onSuccess={refetch}
        onClose={() => {
          setWithdrawApplicationId(null)
          setIsWithDrawModalOpen(false)
        }}
      />
    </div >
  )
}

export default ApplicationsTable

