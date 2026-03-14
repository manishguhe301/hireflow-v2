import { useState } from "react"
import { DataTable, DataTableBody, DataTableCell, DataTableHeadCell, DataTableHeader, DataTableRow } from '../../shared/TableComponents'
import { FileText } from "lucide-react"
import { formatDate, formatRelativeTime, getLabel } from '@/src/utils/helper'
import Link from 'next/link'
import clsx from 'clsx'
import { JOB_STATUSES } from '@/src/utils/constants'

interface JobRow {
  id: string
  title: string
  slug: string
  status: string
  createdAt: string
  applicationDeadline: string
  _count: {
    applications: number
  }
}


interface CompanyApplicationsResponse {
  jobs: JobRow[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const CompanyApplicationsTable = ({ data }: { data: CompanyApplicationsResponse }) => {
  const [now] = useState(() => Date.now())

  const getIsDeadlinePassed = (deadline: string) => {
    return deadline && new Date(deadline).getTime() < now
  }


  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
      <DataTable className="w-full text-sm">
        <DataTableHeader className="bg-muted/50 border-b border-border/60 text-xs uppercase tracking-wide text-muted-foreground">
          <DataTableRow>
            <DataTableHeadCell>Job Title</DataTableHeadCell>
            <DataTableHeadCell>Created At</DataTableHeadCell>
            <DataTableHeadCell> Application Deadline</DataTableHeadCell>
            <DataTableHeadCell>Applications</DataTableHeadCell>
            <DataTableHeadCell className="text-right">Actions</DataTableHeadCell>
          </DataTableRow>
        </DataTableHeader>
        <DataTableBody>
          {data.jobs.length === 0 && (
            <DataTableRow>
              <td colSpan={5} className="text-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No applications found
                  </p>
                </div>
              </td>
            </DataTableRow>
          )}
          {data.jobs.map((job) => {
            const isDeadlinePassed = getIsDeadlinePassed(job.applicationDeadline)
            return (
              <DataTableRow
                key={job.id}
                className="hover:bg-muted/30 transition border-b border-border/40 last:border-none"
              >
                <DataTableCell >
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">{job.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {getLabel(JOB_STATUSES, job.status)}
                    </span>
                  </div>
                </DataTableCell>

                <DataTableCell className="text-xs text-muted-foreground">
                  {job.createdAt
                    ? formatRelativeTime(job.createdAt)
                    : '—'}
                </DataTableCell>


                <DataTableCell className='font-semibold'
                >
                  <span
                    className={clsx(
                      "text-xs px-2 py-1 rounded-full font-medium",
                      isDeadlinePassed
                        ? "bg-red-500/10 text-destructive"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {job.applicationDeadline
                      ? formatDate(job.applicationDeadline)
                      : '—'}
                  </span>
                </DataTableCell>

                <DataTableCell >
                  <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-semibold">
                    {job._count.applications}
                  </span>
                </DataTableCell>

                <DataTableCell className=" text-right">
                  <Link
                    href={`/company/applications/${job.slug}`}
                    className="text-primary text-sm hover:underline font-semibold"
                  >
                    View →
                  </Link>
                </DataTableCell>
              </DataTableRow>
            )
          }
          )}
        </DataTableBody>
      </DataTable>
    </div>
  )
}

export default CompanyApplicationsTable