'use client'
import Link from 'next/link';
import {
  ShieldCheck,
  Workflow,
  UserCircle,
  MapPin,
  ArrowRight,
  Building2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DirJobType } from '../public/jobs-dir/JobsDirectory';
import { formatRelativeTime, getLabel, isNewJob } from '@/src/utils/helper';
import { employmentTypes, jobCategories } from '@/src/utils/constants';
import { Company } from '../public/companies-dir/CompaniesDirectory';
import { AppSdk } from '@/src/utils/AppSdk';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import LandingPageSkeleton from '../skeletons/LandingPageSkeleton';
import { Button } from '../ui/Button';
import { features } from '@/src/utils/constants';
import HeroPill from './landing-components/HeroPill';

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['homepage-data'],
    queryFn: async () => {
      const [jobsRes, companiesRes] = await Promise.all([
        AppSdk.getData(`/api/jobs?limit=4`, null),
        AppSdk.getData(`/api/companies?limit=6`, null),
      ])

      if (jobsRes.error) throw new Error(jobsRes.error)
      if (companiesRes.error) throw new Error(companiesRes.error)

      return {
        jobs: jobsRes.jobs,
        companies: companiesRes.companies
      }
    },
    staleTime: 1000 * 60 * 10
  })

  const jobs: DirJobType[] = data?.jobs ?? []
  const companies: Company[] = data?.companies ?? []

  useEffect(() => {
    if (error) {
      toast.error('Failed to load landing data')
    }
  }, [error])

  useEffect(() => {
    //eslint-disable-next-line
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (isLoading) {
    return (
      <LandingPageSkeleton />
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <section className="relative overflow-hidden isolate">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute left-1/2 top-[-120px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/15 blur-[160px]" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-28 grid gap-16 md:grid-cols-2 items-center">
          <div>
            <HeroPill>
              TRUSTED BY 5,000+ PROFESSIONALS
            </HeroPill>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Connect with verified companies.
              <span className="block text-primary">Build your career.</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              HireFlow<span className="text-primary">.</span> is a three-tier platform connecting job seekers with manually verified companies.
              Experience transparent hiring with real-time application tracking.
            </p>

            <div className="mt-10 flex gap-4">
              <Link href="/signup" className='flex items-center justify-center  gap-2 '>
                <Button size="md" className='flex items-center justify-center' >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link href="/explore/jobs" className='flex items-center justify-center  gap-2'>
                <Button variant="outline" size="md">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title}
                className="rounded-2xl border border-border/60 bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/30"              >
                <Icon className="w-6 h-6 text-primary mb-4" />
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60" id='companies'>
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-semibold tracking-tight">
              Verified companies on HireFlow<span className="text-primary">.</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
              Every company is manually reviewed and approved by our platform admins before they can post jobs
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {companies.map(company => (
              <Link
                href={`/explore/companies/${company.id}`}
                key={company.id}
                className="group flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
              >
                <div className="relative mb-4">
                  <div className="absolute inset-0 rounded-full border border-primary/30 blur-[0.5px]" />
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border/40 bg-muted overflow-hidden sm:h-12 sm:w-12">
                    {company?.logo ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={company?.logo}
                          alt={`${company.name} logo`}
                          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105" />
                      </>
                    ) : (
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                </div>

                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition">
                  {company.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight">
              How it works
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
              A three-tier system designed for quality hiring and meaningful careers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border/60 bg-card p-8 hover:border-primary/30 transition group">
              <div className="mb-6">
                <div className="relative inline-flex">
                  <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <UserCircle className="w-7 h-7 text-primary" />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3">Job Seekers</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Sign up and create your comprehensive profile with resume, work experience, skills, and certifications. Browse verified jobs, apply with one click, and track every application status in real-time.
              </p>

              <div className="pt-4 border-t border-border/60">
                <span className="text-xs font-medium text-primary/70 uppercase tracking-wider">
                  For Candidates
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-8 hover:border-primary/30 transition group">
              <div className="mb-6">
                <div className="relative inline-flex">
                  <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <ShieldCheck className="w-7 h-7 text-primary" />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3">Company Admins</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Submit your company profile with business documents for platform admin approval. Once verified, post unlimited jobs, review applications, and manage the entire hiring workflow.
              </p>

              <div className="pt-4 border-t border-border/60">
                <span className="text-xs font-medium text-primary/70 uppercase tracking-wider">
                  For Employers
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-8 hover:border-primary/30 transition group">
              <div className="mb-6">
                <div className="relative inline-flex">
                  <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <Workflow className="w-7 h-7 text-primary" />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3">Platform Admins</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Review and approve company registrations with business verification. Monitor platform activity, manage users, and ensure quality standards across all job postings and applications.
              </p>

              <div className="pt-4 border-t border-border/60">
                <span className="text-xs font-medium text-primary/70 uppercase tracking-wider">
                  Quality Control
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-border/60 bg-muted/30 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold mb-1">Ready to get started?</h4>
                <p className="text-sm text-muted-foreground">
                  Join as a job seeker or register your company today
                </p>
              </div>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition whitespace-nowrap"
              >
                Sign Up Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>


      <section id="jobs" className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex items-end justify-between mb-14">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Latest Jobs</h2>
              <p className="mt-2 text-sm text-muted-foreground ">
                Browse active opportunities from verified companies
              </p>
            </div>
            <Link href="/explore/jobs" className="text-sm text-primary hover:opacity-70 max-sm:hidden">
              View all jobs
            </Link>
          </div>

          <div className="grid gap-4">
            {
              jobs.length === 0 ?
                <div>
                  <div className="flex justify-center py-24" >
                    <span className="text-sm text-muted-foreground">No jobs found</span>
                  </div>

                </div> : jobs.map((job: DirJobType) => (
                  <Link
                    key={job.id}
                    href={`/explore/jobs/${job.slug}`}
                    className="group rounded-2xl border border-border/60 bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-5">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full border border-primary/30 blur-[0.5px]" />
                          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/40 bg-muted overflow-hidden sm:h-12 sm:w-12">
                            {job.company?.logo ? (
                              <>
                                <img
                                  src={job.company?.logo}
                                  alt={job.company.name}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </>
                            ) : (
                              <Building2 className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {job.title}
                            {isNewJob(job.createdAt) && (
                              <span className="rounded-md bg-primary/15 px-2 py-[2px] text-[10px] font-semibold text-primary">
                                NEW
                              </span>
                            )}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground/80">
                              {job.company.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {job.city ? `${job.city}, ${job.country}` : job.country}
                            </span>
                            <span className="rounded bg-muted px-2 py-0.5 uppercase tracking-wide max-sm:hidden">
                              {getLabel(jobCategories, job.category)}
                            </span>
                            <span className="flex items-center gap-1">
                              {formatRelativeTime(job.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="hidden md:inline-block text-[11px] font-semibold uppercase tracking-widest text-primary/70">
                          {getLabel(employmentTypes, job.employmentType)}
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>
    </main >
  );
}