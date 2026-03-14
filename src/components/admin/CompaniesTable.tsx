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
import { companyIndustries } from '@/src/utils/constants'
import { DataTable, DataTableBody, DataTableCell, DataTableHeadCell, DataTableHeader, DataTableRow } from '../shared/TableComponents'

type CompaniesTableProps = {
  filteredCompanies: Company[],
  handleApprove: (id: string) => Promise<void>,
  loadingAction: string | null,
  rejectCompanyId: string | null,
  setDeleteCompanyId: React.Dispatch<React.SetStateAction<string | null>>,
  setRejectCompanyId: React.Dispatch<React.SetStateAction<string | null>>,
  disabled?: boolean
}

const CompaniesTable = ({
  filteredCompanies,
  handleApprove,
  loadingAction,
  rejectCompanyId,
  setDeleteCompanyId,
  setRejectCompanyId,
  disabled
}: CompaniesTableProps) => {
  return (
    <DataTable className={clsx("w-full text-sm", disabled && 'opacity-60 cursor-not-allowed')}>
      <DataTableHeader >
        <DataTableRow>
          <DataTableHeadCell>Company</DataTableHeadCell>
          <DataTableHeadCell>Industry</DataTableHeadCell>
          <DataTableHeadCell>Location</DataTableHeadCell>
          <DataTableHeadCell>Status</DataTableHeadCell>
          <DataTableHeadCell className="text-right">Actions</DataTableHeadCell>
        </DataTableRow>
      </DataTableHeader>
      <DataTableBody>
        {filteredCompanies.map((company: Company) => {
          const companyIndustry =
            companyIndustries.find((ind) => ind.value === company.industry)?.label

          const location = company.city
            ? `${company.city}, ${company.country}`
            : company.country

          return (
            <DataTableRow
              key={company.id}
              className='w-full hover:bg-muted/30 transition'
            >
              <DataTableCell>
                <div className="font-medium capitalize">{company.name}</div>
                <div className="text-xs text-muted-foreground">
                  {company.contactEmail}
                </div>
              </DataTableCell>
              <DataTableCell className="capitalize">{companyIndustry}</DataTableCell>
              <DataTableCell>{location} </DataTableCell>
              <DataTableCell>
                <span
                  className={clsx(
                    'inline-flex items-center gap-1 px-3 py-1.25 rounded-full text-xs font-medium',
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
              </DataTableCell>
              <DataTableCell className="text-right">
                <div className="inline-flex items-center gap-3">
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
                          !!rejectCompanyId || disabled
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
                          !!loadingAction && loadingAction !== `reject-${company.id}` || disabled
                        }
                        className="text-destructive! hover:underline text-xs border-none w-fit p-0! bg-transparent"
                      >
                        {loadingAction === `reject-${company.id}`
                          ? 'Rejecting...'
                          : 'Reject'}
                      </Button>

                    </>
                  )}

                  <Button
                    className="p-0! border-none text-destructive! bg-transparent hover:text-destructive/80"
                    disabled={loadingAction === `delete-${company.id}` || disabled}
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
              </DataTableCell>
            </DataTableRow>
          )
        }
        )}
      </DataTableBody>
    </DataTable>
  )
}

export default CompaniesTable