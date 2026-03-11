'use client'

import Link from 'next/link'
import { Workflow, Users, ArrowRight, Building2 } from 'lucide-react'
import { Button } from '@/src/components/ui/Button'

export default function About() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <section className="relative overflow-hidden isolate">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute left-1/2 top-[-120px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/15 blur-[160px]" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-28 text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            About HireFlow<span className="text-primary">.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            HireFlow connects talented professionals with verified companies
            through a transparent and structured hiring process.
          </p>
        </div>
      </section>
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Our Mission
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Hiring today is often inefficient and unclear. Candidates apply
              to jobs without knowing what happens next, while companies
              struggle to manage hundreds of applications.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              HireFlow was built to create a transparent hiring experience
              where companies are verified and candidates can track their
              applications through every stage.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="rounded-2xl border border-border/60 bg-card p-6 flex gap-4">
              <Building2 className="w-8 h-8 text-primary shrink-0" />
              <div>
                <p className="font-semibold">Verified Companies</p>
                <p className="text-sm text-muted-foreground">
                  Every company is manually reviewed before posting jobs to prevent fake listings.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-6 flex gap-4">
              <Workflow className="w-8 h-8 text-primary shrink-0" />
              <div>
                <p className="font-semibold">Transparent Hiring</p>
                <p className="text-sm text-muted-foreground">
                  Candidates can track the full application journey from applied to offer.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-6 flex gap-4">
              <Users className="w-8 h-8 text-primary shrink-0" />
              <div>
                <p className="font-semibold">Structured Hiring Workflow</p>
                <p className="text-sm text-muted-foreground">
                  Companies manage applicants through clear stages like reviewing,
                  shortlisted, interview, and hired.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Why HireFlow Exists
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Many job platforms allow anyone to post listings without verification,
            which leads to fake jobs, poor communication, and a frustrating
            experience for candidates.
          </p>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            HireFlow was created to build a trustworthy hiring environment where
            companies are verified, applications are tracked, and both sides of the
            hiring process stay informed.
          </p>
        </div>
      </section>
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Start your journey with HireFlow
          </h2>
          <p className="mt-3 text-muted-foreground">
            Join as a job seeker or register your company today.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/signup">
              <Button className='flex items-center'>
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