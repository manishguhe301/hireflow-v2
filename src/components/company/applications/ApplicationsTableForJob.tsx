import { FileText, Trash2 } from "lucide-react"
import { Applications } from "./JobApplicants"
import { APPLICATIONS_TABS, formatRelativeTime, getLabel } from "@/src/utils/helper"
import { yearsOfExperiences } from "@/src/utils/utils"
import { STATUS_STYLE } from "../../job-seeker/profile/ApplicationsTable"
import Link from "next/link"
import { Button } from "../../ui/Button"
import clsx from "clsx"
import { ExperienceLevel } from "@prisma/client"
import { Spinner } from "../../elements/Loader"

const ApplicationsTableForJob = ({
  applications,
  fetchApplications
}: {
  applications: Applications[],
  fetchApplications: () => void
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card">
      <table className="w-full text-sm max-sm:w-[1100px]">
        <thead className="bg-muted/40 border-b border-border/60">
          <tr>
            <th className="px-6 py-4 text-left">Applicant</th>
            <th className="px-6 py-4 text-left">Experience</th>
            <th className="px-6 py-4 text-left">Location</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-left">Applied</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {applications.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No applicants found
                  </p>
                </div>
              </td>
            </tr>
          )}

          {applications.map((app) => {
            const profile = app.user.profile

            return (
              <tr
                key={app.id}
                className="hover:bg-muted/30 transition"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {profile?.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="h-10 w-10 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted" />
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
                </td>

                <td className="px-6 py-4 text-xs text-muted-foreground">
                  {getLabel(yearsOfExperiences, profile?.yearsOfExperience as ExperienceLevel) || '—'}
                </td>

                <td className="px-6 py-4 text-xs text-muted-foreground">
                  {profile?.city
                    ? `${profile.city}, ${profile.country}`
                    : profile?.country || '—'}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={clsx(
                      'px-3 py-1 rounded-full text-xs font-medium',
                      STATUS_STYLE[app.status],
                    )}
                  >
                    {getLabel(APPLICATIONS_TABS, app.status)}
                  </span>
                </td>

                <td className="px-6 py-4 text-xs text-muted-foreground">
                  {formatRelativeTime(app.createdAt)}
                </td>
                <td className="px-6 py-7 text-right flex items-center justify-end gap-3">
                  <Link
                    href={`/company/applications/${app.id}`}
                    className="text-primary text-xs font-semibold hover:underline"
                  >
                    View Resume & Profile
                  </Link>
                  <Button
                    className={clsx("p-0! bg-transparent! border-none text-destructive! hover:text-destructive/80",
                      // loadingAction && 'pointer-events-none opacity-50'
                    )}
                  // disabled={loadingAction === `delete-${job.id}`}
                  // onClick={() => setDeleteJobId(job.id)}
                  >
                    {false ? (
                      <Spinner className="h-4 w-4" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
export default ApplicationsTableForJob