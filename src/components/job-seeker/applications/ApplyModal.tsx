'use client'

import Modal from '@/src/components/ui/Modal'
import { FileUpload } from '@/src/components/ui/FileUpload'
import { FormTextarea } from '@/src/components/ui/FormTextarea'
import { Button } from '@/src/components/ui/Button'
import { useProfile } from '@/src/store/hooks/useProfile'
import { Building2, MapPin, Briefcase } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { getLabel } from '@/src/utils/helper'
import { workModes, employmentTypes } from '@/src/utils/constants'
import { useState } from 'react'
import { toast } from 'sonner'
import { Spinner } from '../../elements/Loader'
import clsx from 'clsx'
import { useQueryClient } from '@tanstack/react-query'

type ApplyFormInputs = {
  coverLetter: string
  customResume: FileList
}

type ApplyModalProps = {
  open: boolean
  onClose: () => void
  job: {
    id: string
    title: string
    slug: string
    workMode: string
    employmentType: string
    company: {
      name: string
      logo: string | null
    }
    country: string
    city: string | null
  }
  onSuccess: () => void
}

export default function ApplyModal({ open, onClose, job, onSuccess }: ApplyModalProps) {
  const { jobSeekerProfile } = useProfile()
  const profileResumeUrl = jobSeekerProfile?.resumeUrl
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()


  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplyFormInputs>({
    defaultValues: {
      coverLetter: '',
    },
  })

  const location = job.city ? `${job.city}, ${job.country}` : job.country
  const customResumeFile = watch('customResume')

  const handleClose = () => {
    reset()
    onClose()
    setIsSubmitting(false)
    toast.dismiss()
  }

  const onSubmit = async (data: ApplyFormInputs) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('jobId', job.id)

      if (data.coverLetter) {
        formData.append('coverLetter', data.coverLetter)
      }

      if (data.customResume?.[0]) {
        formData.append('customResume', data.customResume[0])
      } else if (profileResumeUrl) {
        formData.append('resumeUrl', profileResumeUrl)
      } else {
        toast.error('Please upload a resume to apply')
        return
      }

      const res = await fetch('/api/applications', {
        method: 'POST',
        body: formData,
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error(result.error || 'Failed to submit application')
        return
      }
      queryClient.invalidateQueries({ queryKey: ['company-applications'] })
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-activity'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-recommended'] })
      queryClient.invalidateQueries({ queryKey: ['applications'] })

      toast.success(result.message || 'Application submitted successfully!')
      reset()
      onSuccess()
      handleClose()
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={
      () => {
        if (!isSubmitting) {
          reset()
          onClose()
        }
      }
    }
      className="max-w-2xl max-h-[90%] overflow-y-scroll"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Apply for this position</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Review your details before submitting your application
          </p>
        </div>

        <div className="rounded-xl border border-border/40 bg-muted/30 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className=" relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border/40 bg-muted overflow-hidden">
              {job.company?.logo ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={job.company?.logo}
                    alt={job.company.name}
                    className={clsx(
                      "h-full w-full object-cover transition-opacity duration-300",
                    )}
                  />
                </>
              ) : (
                <Building2 className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-base leading-tight line-clamp-1">
                {job.title}
              </h3>
              <p className="text-sm text-muted-foreground">{job.company.name}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {location}
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" />
              {getLabel(workModes, job.workMode)} •{' '}
              {getLabel(employmentTypes, job.employmentType)}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {!profileResumeUrl && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
              <p className="text-xs text-amber-600 dark:text-amber-400">
                No resume found in your profile. Please upload one below to apply.
              </p>
            </div>
          )}


          <FileUpload
            label="Upload Resume or Use Existing One"
            name="customResume"
            register={register}
            error={errors.customResume}
            accept=".pdf,application/pdf"
            maxSizeMB={5}
            description="PDF up to 5MB"
            existingFileUrl={profileResumeUrl}
            disabled={isSubmitting}
          />
          {profileResumeUrl && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-3">
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                ⚠️ You can only maintain one resume in your profile.
                Updating it will affect all your past and future job applications.
              </p>

            </div>
          )}

        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Cover Letter</h4>
            <span className="text-xs text-muted-foreground">Optional</span>
          </div>
          <FormTextarea
            label=""
            placeholder="Write a brief cover letter explaining why you're a great fit for this role…"
            register={register('coverLetter')}
            error={errors.coverLetter}
            rows={5}
            maxLength={300}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className='w-full'
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!profileResumeUrl && !customResumeFile?.[0] || isSubmitting}
            className='w-full'
          >
            {isSubmitting ? <Spinner className='w-4 h-4' /> : 'Submit Application'}
          </Button>
        </div>
      </form>
    </Modal >
  )
}