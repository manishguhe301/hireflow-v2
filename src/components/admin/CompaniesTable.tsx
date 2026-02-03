import { STATUS_STYLE } from '@/src/utils/helper'
import clsx from 'clsx'
import {
  CheckCircle,
  XCircle,
  Trash2,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/Button'
import { Spinner } from '../elements/Loader'
import { Company } from '@prisma/client'
import { companyIndustries } from '@/src/utils/mock'

type CompaniesTableProps = {
  filteredCompanies: Company[],
  handleApprove: (id: string) => Promise<void>,
  loadingAction: string | null,
  rejectCompanyId: string | null,
  setDeleteCompanyId: React.Dispatch<React.SetStateAction<string | null>>,
  setRejectCompanyId: React.Dispatch<React.SetStateAction<string | null>>,
}

const CompaniesTable = ({
  filteredCompanies,
  handleApprove,
  loadingAction,
  rejectCompanyId,
  setDeleteCompanyId,
  setRejectCompanyId,
}: CompaniesTableProps) => {
  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/40 border-b border-border/60">
        <tr>
          <th className="px-6 py-4 text-left">Company</th>
          <th className="px-6 py-4 text-left">Industry</th>
          <th className="px-6 py-4 text-left">Location</th>
          <th className="px-6 py-4 text-left">Status</th>
          <th className="px-6 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredCompanies.map((company: Company) => {
          const companyIndustry = companyIndustries.filter((ind) => ind.value === company.industry)[0]?.label
          return (
            <tr
              key={company.id}
              className='w-full hover:bg-muted/30 transition'
            >
              <td className="px-6 py-4">
                <div className="font-medium capitalize">{company.name}</div>
                <div className="text-xs text-muted-foreground">
                  {company.contactEmail}
                </div>
              </td>
              <td className="px-6 py-4">{companyIndustry}</td>
              <td className="px-6 py-4">{company.country}</td>
              <td className="px-6 py-4">
                <span
                  className={clsx(
                    'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium',
                    company.status === 'PENDING'
                      ? 'bg-warning/10 text-warning'
                      : company.status === 'APPROVED'
                        ? 'bg-success/10 text-success'
                        : 'bg-destructive/10 text-destructive'

                  )}
                >
                  {company.status === 'PENDING' && <Clock className="h-3 w-3" />}
                  {company.status === 'APPROVED' && <CheckCircle className="h-3 w-3" />}
                  {company.status === 'REJECTED' && <XCircle className="h-3 w-3" />}
                  {company.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="inline-flex items-center gap-2">
                  <Link
                    href={`/admin/companies/${company.id}`}
                    className="text-muted-foreground hover:underline text-xs"
                  >
                    View Details
                  </Link>

                  {company.status === 'PENDING' && (
                    <>
                      <Button
                        onClick={() => handleApprove(company.id)}
                        disabled={
                          loadingAction === `approve-${company.id}` ||
                          !!rejectCompanyId
                        }
                        className="text-success hover:underline text-xs border-none w-fit p-0! bg-transparent!"
                      >
                        {loadingAction === `approve-${company.id}`
                          ? 'Approving...'
                          : 'Approve'}
                      </Button>

                      <Button
                        onClick={() => {
                          setDeleteCompanyId(null)
                          setRejectCompanyId(company.id)
                        }}
                        disabled={
                          !!loadingAction && loadingAction !== `reject-${company.id}`
                        }
                        className="text-destructive! hover:underline text-xs border-none w-fit p-0! bg-transparent"
                      >
                        {loadingAction === `reject-${company.id}`
                          ? 'Rejecting...'
                          : 'Reject'}
                      </Button>

                    </>
                  )}

                  {/* {company.status === 'APPROVED' && (
                  <Button
                    onClick={() => {
                      setDeleteCompanyId(null)
                      setRejectCompanyId(company.id)
                    }}
                    className="text-destructive! hover:underline text-xs border-none w-fit p-0! bg-transparent" disabled={
                      !!loadingAction && loadingAction !== `reject-${company.id}`
                    }                              >
                    {loadingAction === `reject-${company.id}` ?
                      'Rejecting...' : 'Reject'}
                  </Button>
                )} */}

                  <Button
                    className="p-0! border-none text-destructive! bg-transparent hover:text-destructive/80"
                    disabled={loadingAction === `delete-${company.id}`}
                    onClick={() => {
                      setRejectCompanyId(null)
                      setDeleteCompanyId(company.id)
                    }}
                  >
                    {loadingAction === `delete-${company.id}` ? (
                      <Spinner className="h-4 w-4" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>

                </div>
              </td>
            </tr>
          )
        }
        )}
      </tbody>
    </table>
  )
}

export default CompaniesTable