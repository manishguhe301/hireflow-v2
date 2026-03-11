'use client'

export default function Terms() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <section className="relative overflow-hidden isolate">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute left-1/2 top-[-120px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/15 blur-[160px]" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-28 text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These terms govern the use of the HireFlow platform. By using
            HireFlow, you agree to follow the rules and guidelines described here.
          </p>
        </div>
      </section>
      <section className="border-t border-border/60">
        <div className="mx-auto max-w-4xl px-6 py-24 space-y-12">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Platform Usage</h2>
            <p className="text-muted-foreground leading-relaxed">
              HireFlow provides a platform where job seekers and verified
              companies can connect. Users must provide accurate information
              when creating accounts, profiles, or job listings.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Any misuse of the platform, including fraudulent activity,
              impersonation, or posting misleading job listings, may result
              in account suspension or removal.
            </p>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Job Seeker Responsibilities</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide accurate and truthful information in profiles and resumes.</li>
              <li>Apply only to jobs that match your qualifications and interests.</li>
              <li>Maintain respectful communication with companies.</li>
              <li>Do not misuse the application system or spam companies.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Company Responsibilities</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide legitimate business information when registering.</li>
              <li>Submit accurate job listings with clear requirements.</li>
              <li>Use applicant data only for recruitment purposes.</li>
              <li>Respect candidate privacy and communication standards.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Company Verification</h2>
            <p className="text-muted-foreground leading-relaxed">
              HireFlow verifies company registrations before allowing them
              to post jobs. Platform administrators reserve the right to
              approve or reject company profiles to maintain platform quality.
            </p>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Platform Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              HireFlow reserves the right to remove content, suspend accounts,
              or restrict access if platform rules are violated or if activity
              threatens the integrity of the platform.
            </p>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold">Updates to These Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service may be updated periodically to reflect
              improvements to the platform or legal requirements.
              Continued use of HireFlow indicates acceptance of the updated terms.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}