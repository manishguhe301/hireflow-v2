'use client'

import { useRedirectIfLoggedIn } from "@/src/store/hooks/useRedirectIfLoggedIn"
import PageTop from "./PageTop"

export default function Privacy() {
  useRedirectIfLoggedIn()
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <PageTop
        desc="Your privacy matters to us. This page explains how HireFlow
            collects, uses, and protects your information."
      >
        Privacy Policy
      </PageTop>
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-4xl px-6 py-24 space-y-12">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you use HireFlow, we collect information required to provide
              the platform&apos;s services. This may include:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Account information such as name, email address, and role.</li>
              <li>Profile data including resumes, work experience, and skills.</li>
              <li>Company information submitted by company administrators.</li>
              <li>Job applications submitted by candidates.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              The information we collect is used to operate and improve the
              HireFlow platform. This includes:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Providing job search and hiring functionality.</li>
              <li>Allowing companies to review candidate applications.</li>
              <li>Sending important notifications related to applications.</li>
              <li>Maintaining platform security and preventing misuse.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              HireFlow uses modern security practices to protect your
              information from unauthorized access, misuse, or disclosure.
              We continuously improve our security measures to ensure
              platform safety.
            </p>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Data Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">
              HireFlow does not sell your personal data. Information is only
              shared when necessary to provide platform functionality,
              such as allowing companies to review applications submitted
              by candidates.
            </p>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Policy Updates</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time to reflect
              improvements to the platform or changes in regulations.
              Updates will be reflected on this page.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}