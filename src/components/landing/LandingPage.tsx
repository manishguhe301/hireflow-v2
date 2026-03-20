'use client'
import Link from 'next/link';
import {
  ArrowRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { AppSdk } from '@/src/utils/AppSdk';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import LandingPageSkeleton from '../skeletons/LandingPageSkeleton';
import { Button } from '../ui/Button';
import { features } from '@/src/utils/constants';
import HeroPill from './landing-components/HeroPill';
import { DirCompanyType, DirJobType } from '@/src/types';
import LatestJobs from './landing-components/LatestJobs';
import CompaniesSection from './landing-components/CompaniesSection';
import HowItWorksSection from './landing-components/HowItWorksSection';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session?.user) return
    const role = session.user.role
    const dest = role === 'PLATFORM_ADMIN' ? '/admin'
      : role === 'COMPANY_ADMIN' ? '/company'
        : '/jobs'
    router.replace(dest)
  }, [session])

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
  const companies: DirCompanyType[] = data?.companies ?? []

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

      <CompaniesSection companies={companies} />

      <HowItWorksSection />

      <LatestJobs jobs={jobs} />
    </main >
  );
}