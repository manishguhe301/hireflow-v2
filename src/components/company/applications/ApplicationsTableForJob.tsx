import {
  FileText,
  MessageCircle,
} from "lucide-react"
import { Applications } from "./JobApplicants"
import { formatRelativeTime, getLabel } from "@/src/utils/helper"
import { STATUS_STYLE } from "../../job-seeker/profile/ApplicationsTable"
import Link from "next/link"
import clsx from "clsx"
import { useParams, useRouter } from "next/navigation"
import { Button } from "../../ui/Button"
import { Spinner } from "../../elements/Loader"
import { useState } from "react"
import { AppSdk } from "@/src/utils/AppSdk"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { APPLICATIONS_TABS } from "@/src/utils/constants"
import { DataTable, DataTableBody, DataTableCell, DataTableHeadCell, DataTableHeader, DataTableRow } from "../../shared/TableComponents"

interface ApplicationTableProps {
  applications: Applications[],
  selectAllApplicants: () => void,
  selectedApplicants: string[]
  applicationsLength: number
  checkBoxHandler: (appId: string) => void
  isBulkProcessing?: boolean
  jobId?: string
}

const ApplicationsTableForJob = ({
  applications,
  selectAllApplicants,
  selectedApplicants,
  applicationsLength,
  checkBoxHandler,
  isBulkProcessing,
  jobId
}: ApplicationTableProps) => {
  const { slug } = useParams()
  const lengthSelected = selectedApplicants.length
  const [creatingFor, setCreatingFor] = useState<string | null>(null);
  const router = useRouter()
  const queryClient = useQueryClient();

  const isIndeterminate =
    lengthSelected > 0 && lengthSelected < applicationsLength

  const handleMessageClick = async (jobSeekerId: string) => {
    setCreatingFor(jobSeekerId);
    try {
      const res = await AppSdk.postData('/api/chat/conversations/create', {
        jobSeekerId,
        jobId,
      });

      if (res.error) {
        toast.error(res.error);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ['conversations'] });

      router.push(`/company/chat?conversation=${res.conversationId}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to start conversation');
    } finally {
      setCreatingFor(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
      <DataTable className="w-full text-sm max-sm:w-[1100px]">
        <DataTableHeader className="bg-muted/50 border-b border-border/60 text-xs uppercase tracking-wide text-muted-foreground">
          <DataTableRow>
            <DataTableHeadCell className="flex flex-row items-center gap-4">
              <input
                type="checkbox"
                id="isCurrent"
                ref={(el) => {
                  if (el) {
                    el.indeterminate = isIndeterminate
                  }
                }}
                className="h-4 w-4 rounded border-border/40 accent-primary focus:ring-2 focus:ring-primary/30"
                onChange={selectAllApplicants}
                checked={lengthSelected === applicationsLength}
                disabled={applicationsLength === 0 || isBulkProcessing}
              />
              Applicant
            </DataTableHeadCell>
            <DataTableHeadCell >Location</DataTableHeadCell>
            <DataTableHeadCell >Status</DataTableHeadCell>
            <DataTableHeadCell  >Applied</DataTableHeadCell>
            <DataTableHeadCell className="text-right">Actions</DataTableHeadCell>
          </DataTableRow>
        </DataTableHeader>

        <DataTableBody>
          {applications.length === 0 && (
            <DataTableRow>
              <DataTableCell colSpan={6} className="text-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No applicants found
                  </p>
                </div>
              </DataTableCell>
            </DataTableRow>
          )}

          {applications.map((app) => {
            const profile = app.user.profile

            return (
              <DataTableRow
                key={app.id}
                className={clsx("hover:bg-muted/30 transition",
                  (isBulkProcessing) && "pointer-events-none opacity-50",
                  selectedApplicants.includes(app.id) && "bg-muted"
                )}
              >
                <DataTableCell className="flex flex-row items-center gap-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border/40 accent-primary focus:ring-2 focus:ring-primary/30"
                    onChange={() => checkBoxHandler(app.id)}
                    checked={selectedApplicants.includes(app.id)}
                    disabled={isBulkProcessing}
                  />
                  <div className=" flex items-center gap-3">
                    {profile?.avatar ? (
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          // className="h-10 w-10 rounded-full object-cover border-border"
                          className={clsx(
                            "h-10 w-10 rounded-full object-cover border-border transition-opacity duration-300",
                          )}
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center" >
                        {profile?.name && profile.name[0]}
                      </div>
                    )}

                    <div>
                      <p className="font-medium">
                        {profile?.name || app.user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {profile?.professionalTitle || '—'}
                      </p>
                    </div>
                  </div>
                </DataTableCell>
                <DataTableCell className="text-xs text-muted-foreground">
                  {profile?.city
                    ? `${profile.city}, ${profile.country}`
                    : profile?.country || '—'}
                </DataTableCell>

                <DataTableCell className="px-6 py-5">
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
                <DataTableCell className="px-6 py-7 text-right flex items-center justify-end gap-3">
                  <Link
                    href={`/company/applications/${slug}/${app.id}`}
                    className={clsx("text-primary text-xs font-semibold hover:underline",
                      (isBulkProcessing) && "pointer-events-none opacity-50"
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Resume & Profile
                  </Link>
                  <Button
                    onClick={() => handleMessageClick(app.user.id)}
                    disabled={creatingFor === app.user.id}
                    variant="outline"
                    size="sm"
                    className="p-2!"
                    aria-label="Initialize chat"
                  >
                    {creatingFor === app.user.id ? <Spinner className="w-4 h-4" /> :
                      <MessageCircle className="h-4 w-4" />
                    }
                  </Button>
                </DataTableCell>
              </DataTableRow>
            )
          })}
        </DataTableBody>
      </DataTable>
    </div>
  )
}
export default ApplicationsTableForJob