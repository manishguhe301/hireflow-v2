import { ArrowRight, ShieldCheck, UserCircle, Workflow } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const HowItWorksSection = () => {
  return (
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
  )
}

export default HowItWorksSection