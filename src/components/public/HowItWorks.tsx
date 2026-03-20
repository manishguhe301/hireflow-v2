'use client'

import Link from 'next/link'
import {
  UserCircle,
  ShieldCheck,
  Workflow,
  ArrowRight,
  FileCheck,
  Search,
  Send,
  Building2,
  Briefcase,
  CheckCircle
} from 'lucide-react'

import { Button } from '@/src/components/ui/Button'
import WorkflowSection from './WorkFlowSection'
import HeroPill from '../landing/landing-components/HeroPill'
import { useRedirectIfLoggedIn } from '@/src/store/hooks/useRedirectIfLoggedIn'

export type Step = {
  icon: React.ReactNode
  title: string
  desc: string
}

const roles: Step[] = [
  {
    icon: <UserCircle className="w-7 h-7 text-primary" />,
    title: 'Job Seekers',
    desc: 'Create your professional profile, explore verified jobs, and track every application in real time.'
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-primary" />,
    title: 'Company Admins',
    desc: 'Register your company, get verified by platform admins, and manage job postings and applicants.'
  },
  {
    icon: <Workflow className="w-7 h-7 text-primary" />,
    title: 'Platform Admins',
    desc: 'Review companies, maintain hiring quality, and ensure transparency across the platform.'
  }
]

const companySteps: Step[] = [
  {
    icon: <Building2 className="w-7 h-7 text-primary" />,
    title: 'Register Company',
    desc: 'Create a company admin account and submit your company profile with business details.'
  },
  {
    icon: <FileCheck className="w-7 h-7 text-primary" />,
    title: 'Admin Verification',
    desc: 'Platform admins review submitted documents and approve legitimate companies.'
  },
  {
    icon: <Briefcase className="w-7 h-7 text-primary" />,
    title: 'Post Jobs',
    desc: 'Approved companies can create job listings visible to all job seekers.'
  },
  {
    icon: <Send className="w-7 h-7 text-primary" />,
    title: 'Hire Candidates',
    desc: 'Review applications, shortlist candidates, schedule interviews, and hire.'
  }
]

const jobSeekerSteps: Step[] = [
  {
    icon: <UserCircle className="w-7 h-7 text-primary" />,
    title: 'Create Profile',
    desc: 'Sign up and build your professional profile with resume, skills, and experience.'
  },
  {
    icon: <Search className="w-7 h-7 text-primary" />,
    title: 'Explore Jobs',
    desc: 'Browse jobs from verified companies using powerful filters.'
  },
  {
    icon: <Send className="w-7 h-7 text-primary" />,
    title: 'Apply Easily',
    desc: 'Submit applications quickly using your saved resume.'
  },
  {
    icon: <CheckCircle className='w-7 h-7 text-primary' />,
    title: 'Track Progress',
    desc: 'Follow your application status from review to interview and offer.'
  }
]

export default function HowItWorks() {
  useRedirectIfLoggedIn()
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden isolate border-b border-border/60">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute left-1/2 top-[-120px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/15 blur-[160px]" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-28 text-center">
          <HeroPill>
            HIRING MADE TRANSPARENT
          </HeroPill>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            How HireFlow<span className="text-primary">.</span> Works
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            HireFlow connects job seekers with verified companies through a
            structured hiring ecosystem designed for transparency and efficiency.
          </p>
        </div>
      </section>
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight">
              Three Roles Powering HireFlow
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {roles.map(({ icon, title, desc }: Step) => (
              <div
                key={title}
                className="rounded-2xl border border-border/60 bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
              >
                <div className="mb-6">
                  <div className="relative inline-flex">
                    <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl" />
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                      {icon}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WorkflowSection
        title="Company Hiring Workflow"
        subtitle="How companies register and hire through HireFlow"
        steps={companySteps}
      />
      <WorkflowSection
        title="Job Seeker Journey"
        subtitle="How candidates find jobs and track applications"
        steps={jobSeekerSteps}
      />
      <section>
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Ready to start with HireFlow<span className="text-primary">.</span>?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Join thousands of professionals and companies building better
            careers and hiring experiences.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/signup">
              <Button className='flex flex-row items-center'>
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/explore/jobs">
              <Button variant="outline">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

