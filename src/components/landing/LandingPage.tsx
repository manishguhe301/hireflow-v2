import Link from 'next/link';
import {
  Briefcase,
  ShieldCheck,
  Workflow,
  UserCircle,
  MapPin,
  ArrowRight,
} from 'lucide-react';

const featuredJobs = [
  { id: 1, title: 'Frontend Engineer', company: 'TechNova', location: 'Remote', type: 'Full-time', tag: 'High Growth' },
  { id: 2, title: 'Backend Developer', company: 'CloudCore', location: 'Bangalore', type: 'Full-time', tag: 'Urgent' },
  { id: 3, title: 'UI/UX Designer', company: 'Designify', location: 'Mumbai', type: 'Hybrid', tag: 'New' },
  { id: 4, title: 'Product Lead', company: 'Aura', location: 'Remote', type: 'Full-time', tag: 'Remote' },
];

const companies = [
  { id: 1, name: "TechNova" },
  { id: 2, name: "CloudCore" },
  { id: 3, name: "Designify" },
  { id: 4, name: "Aura" },
  { id: 5, name: "ByteLabs" },
  { id: 6, name: "NextZen" },
];


export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            HireFlow<span className="text-primary">.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#jobs" className="hover:text-primary transition">Jobs</Link>
            <Link href="#companies" className="hover:text-primary transition">Companies</Link>
            <Link href="#how-it-works" className="hover:text-primary transition">How it works</Link>
            <Link
              href="/login"
              className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-primary hover:bg-primary/20 transition"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-28 grid gap-16 md:grid-cols-2 items-center">
          <div>
            <span className="inline-block mb-6 rounded-full border border-border/40 bg-muted/40 px-4 py-1 text-xs tracking-widest text-muted-foreground">
              TRUSTED BY 5,000+ PROFESSIONALS
            </span>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Connect with verified companies.
              <span className="block text-primary">Build your career.</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground/80 max-w-xl">
              HireFlow is a three-tier platform connecting job seekers with manually verified companies.
              Experience transparent hiring with real-time application tracking.
            </p>

            <div className="mt-10 flex gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#jobs"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium hover:bg-muted/40 transition"
              >
                Browse Jobs
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
              <div className="rounded-2xl border border-border/30 bg-card p-6">
                <Briefcase className="w-6 h-6 text-primary mb-4" />
                <h3 className="font-semibold">Quality Jobs</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Curated opportunities from verified companies only.
                </p>
              </div>
              <div className="rounded-2xl border border-border/30 bg-card p-6">
                <ShieldCheck className="w-6 h-6 text-primary mb-4" />
                <h3 className="font-semibold">Verified Companies</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Platform admin approval ensures every employer is legitimate.
                </p>
              </div>
              <div className="rounded-2xl border border-border/30 bg-card p-6">
                <Workflow className="w-6 h-6 text-primary mb-4" />
                <h3 className="font-semibold">Application Tracking</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Track your applications from &quot;Applied&quot; to &quot;Hired&quot; in real-time.
                </p>
              </div>
              <div className="rounded-2xl border border-border/30 bg-card p-6">
                <UserCircle className="w-6 h-6 text-primary mb-4" />
                <h3 className="font-semibold">Complete Profiles</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Build detailed profiles with resume, skills, and experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/30" id='companies'>
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-semibold tracking-tight">
              Verified companies on HireFlow
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
              Every company is manually reviewed and approved by our platform admins before they can post jobs
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {companies.map(company => (
              <div
                key={company.id}
                className="group flex flex-col items-center justify-center rounded-2xl border border-border/30 bg-card p-6 hover:border-primary/30 transition"
              >
                <div className="relative mb-4">
                  <div className="absolute inset-0 rounded-full border border-primary/30 blur-[0.5px]" />
                  <div className="relative h-12 w-12 rounded-full bg-muted flex items-center justify-center font-semibold text-muted-foreground ring-0.5 ring-background backdrop-blur">
                    {company.name[0]}
                  </div>
                </div>

                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-border/30">
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
            <div className="rounded-2xl border border-border/30 bg-card p-8 hover:border-primary/30 transition group">
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

              <div className="pt-4 border-t border-border/20">
                <span className="text-xs font-medium text-primary/70 uppercase tracking-wider">
                  For Candidates
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border/30 bg-card p-8 hover:border-primary/30 transition group">
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

              <div className="pt-4 border-t border-border/20">
                <span className="text-xs font-medium text-primary/70 uppercase tracking-wider">
                  For Employers
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border/30 bg-card p-8 hover:border-primary/30 transition group">
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

              <div className="pt-4 border-t border-border/20">
                <span className="text-xs font-medium text-primary/70 uppercase tracking-wider">
                  Quality Control
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-border/30 bg-muted/30 p-6">
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


      <section id="jobs" className="border-t border-border/30 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex items-end justify-between mb-14">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Latest Jobs</h2>
              <p className="mt-2 text-sm text-muted-foreground ">
                Browse active opportunities from verified companies
              </p>
            </div>
            <Link href="/jobs" className="text-sm text-primary hover:opacity-70 max-sm:hidden">
              View all jobs
            </Link>
          </div>

          <div className="grid gap-4">
            {featuredJobs.map(job => (
              <Link
                key={job.id}
                href="/login"
                className="group rounded-2xl border border-border/30 bg-card p-6 transition hover:border-primary/30 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-5">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full border border-primary/30 blur-[0.5px]" />
                      <div className="relative h-12 w-12 rounded-full bg-muted flex items-center justify-center font-semibold text-muted-foreground ring-0.5 ring-background backdrop-blur">
                        {job.company[0]}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>{job.company}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job.location}
                        </span>
                        <span className="rounded bg-muted px-2 py-0.5 uppercase tracking-wide max-sm:hidden">
                          {job.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="hidden md:inline-block text-[11px] font-semibold uppercase tracking-widest text-primary/70">
                      {job.tag}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-border/30">
        <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-3">
          <div>
            <h4 className="font-semibold">HireFlow.</h4>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              A verified job platform with three-tier system ensuring quality hiring for both companies and job seekers.
            </p>
          </div>

          <div>
            <h5 className="text-sm font-semibold mb-3">Platform</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/jobs" className="hover:text-primary">Browse Jobs</Link></li>
              <li><Link href="/signup" className="hover:text-primary">Sign Up</Link></li>
              <li><Link href="/login" className="hover:text-primary">Login</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-semibold mb-3">Company</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">About</Link></li>
              <li><Link href="#" className="hover:text-primary">Privacy</Link></li>
              <li><Link href="#" className="hover:text-primary">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/20 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} HireFlow. Verified hiring for modern teams.
        </div>
      </footer>
    </main>
  );
}