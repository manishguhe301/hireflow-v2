import React from 'react'
import { Briefcase } from 'lucide-react'
import { formatRelativeTime, formatSalary, getLabel } from '@/src/utils/helper'
import { employmentTypes, experienceLevels, workModes } from '@/src/utils/utils'
import clsx from 'clsx'
import { ApplicationStatus } from '@prisma/client'
import Link from 'next/link'
import { ApplicationWithPagination } from './ApplicationsPage'

const STATUS_STYLE: Record<ApplicationStatus, string> = {
  APPLIED: 'bg-blue-500/10 text-blue-600',
  REVIEWING: 'bg-yellow-500/10 text-yellow-600',
  SHORTLISTED: 'bg-purple-500/10 text-purple-600',
  INTERVIEW_SCHEDULED: 'bg-indigo-500/10 text-indigo-600',
  OFFERED: 'bg-green-500/10 text-green-600',
  HIRED: 'bg-emerald-500/10 text-emerald-600',
  REJECTED: 'bg-red-500/10 text-red-600',
}

const ApplicationsTable = ({ data }:
  { data: ApplicationWithPagination | null }) => {

  if (!data) return null
  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 border-b border-border/60">
          <tr>
            <th className="px-6 py-4 text-left">Job</th>
            <th className="px-6 py-4 text-left">Details</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-left">Applied</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.applications.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <Briefcase className="h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No applications found
                  </p>
                </div>
              </td>
            </tr>
          )}

          {data.applications.map((app) => (
            <tr
              key={app.id}
              className="hover:bg-muted/30 transition"
            >
              <td className="px-6 py-4">
                <div className="font-medium">
                  {app.job.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {app.job.company.name}
                </div>
              </td>

              <td className="px-6 py-4 text-xs text-muted-foreground">
                {getLabel(workModes, app.job.workMode)} •{' '}
                {getLabel(employmentTypes, app.job.employmentType)} •{' '}
                {getLabel(
                  experienceLevels,
                  app.job.experienceLevel,
                )}
                {app.job.salaryMin &&
                  app.job.salaryMax && (
                    <>
                      {' '}
                      •{' '}
                      {formatSalary(
                        app.job.salaryMin,
                        app.job.salaryMax,
                      )}
                    </>
                  )}
              </td>

              <td className="px-6 py-4">
                <span
                  className={clsx(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    STATUS_STYLE[app.status],
                  )}
                >
                  {app.status}
                </span>
              </td>

              <td className="px-6 py-4 text-xs text-muted-foreground">
                {formatRelativeTime(app.createdAt)}
              </td>

              <td className="px-6 py-4 text-right">
                <Link
                  href={`/jobs/${app.job.slug}`}
                  className="text-primary text-xs hover:underline"
                >
                  View Job
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ApplicationsTable