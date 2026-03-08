'use client'
import { useSession } from 'next-auth/react'
import { SimilarJob } from '../JobDetailsForApplicant'
import { useRouter } from 'next/navigation'
import { Briefcase, Clock, MapPin } from 'lucide-react'
import { formatRelativeTime, getLabel } from '@/src/utils/helper'
import { employmentTypes, experienceLevels, workModes } from '@/src/utils/utils'

const SimilarJobs = ({ similarJobs }: { similarJobs: SimilarJob[] }) => {
  const router = useRouter()
  const { data: session } = useSession()


  return (
    <div className="space-y-6 border-t border-border/40 pt-10">
      <h3 className="text-xl font-semibold">Similar Jobs</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarJobs.map((similar) => (
          <div
            key={similar.id}
            className="group rounded-2xl border border-border/40 bg-card p-5 space-y-3   cursor-pointer transition-all duration-200 hover:border-primary/40 hover:shadow-lg"
            onClick={() => router.push(
              session?.user.id ? `/jobs/${similar.slug}` :
                `/explore/jobs/${similar.slug}`
            )}
          >
            <div className="space-y-1">
              <h3 className="text-base font-semibold leading-tight break-words group-hover:text-primary">
                {similar.title}
              </h3>

              <p className="text-sm text-muted-foreground">{similar.company.name}</p>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="break-words"> {similar.city ? `${similar.city}, ${similar.country}` : similar.country}</span>
              </div>

              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>
                  {getLabel(workModes, similar.workMode)} • {getLabel(employmentTypes, similar.employmentType)}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{getLabel(experienceLevels, similar.experienceLevel)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(similar.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SimilarJobs