import Link from 'next/link';
import {
  Briefcase,
  Search,
  ShieldCheck,
  Workflow,
  UserCircle,
  MapPin,
  ArrowRight,
  Circle
} from 'lucide-react';

const featuredJobs = [
  { id: 1, title: 'Frontend Engineer', company: 'TechNova', location: 'Remote', type: 'Full-time', tag: 'High Growth' },
  { id: 2, title: 'Backend Developer', company: 'CloudCore', location: 'Bangalore', type: 'Full-time', tag: 'Urgent' },
  { id: 3, title: 'UI/UX Designer', company: 'Designify', location: 'Mumbai', type: 'Hybrid', tag: 'New' },
  { id: 4, title: 'Product Lead', company: 'Aura', location: 'Remote', type: 'Full-time', tag: 'Remote' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight hover:opacity-80 transition">
            HireFlow<span className="text-primary">.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-muted-foreground/80">
            <Link href="#recent-jobs" className="hover:text-primary transition-colors">Browse Jobs</Link>
            <Link href="/signup" className="hover:text-primary transition-colors">For Companies
            </Link>
            <Link
              href="/login"
              className="bg-primary/10 text-primary px-4 py-1 rounded-full hover:bg-primary/30 hover:scale-105 hover:border-primary transition-all duration-300 border border-primary/30"
            >Sign In</Link>

          </nav>
        </div>
      </header>

      <section className="relative px-6 pt-24 pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full bg-muted/50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground border border-muted/30">
            <Circle className="fill-success text-success w-2 h-2" />
            Empowering 5,000+ Careers
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground/90">
            Find your next <br />
            <span className="text-muted-foreground/40 italic font-serif">meaningful</span> role.
          </h1>

          <p className="mt-8 text-lg text-muted-foreground/70 leading-relaxed font-light">
            A curated job board for the next generation of engineers. <br className="hidden md:block" />
            No spam, no ghosting, just direct connections.
          </p>

          <div className="mt-12 flex max-w-xl mx-auto items-center gap-2 rounded-2xl bg-card p-2 shadow-sm border border-border/30">
            <div className="flex flex-1 items-center gap-2 px-4">
              <Search className="w-4 h-4 text-muted-foreground/50" />
              <input
                placeholder="Job title or keyword..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/40"
              />
            </div>
            <button className="rounded-xl bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-90 transition">
              Search
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 border-t border-border/30">
        <div className="grid gap-16 md:grid-cols-3">
          <FeatureIcon
            icon={<ShieldCheck className="w-5 h-5" />}
            title="Verified"
            desc="Only vetted companies can post."
          />
          <FeatureIcon
            icon={<Workflow className="w-5 h-5" />}
            title="Direct"
            desc="Speak directly with hiring managers."
          />
          <FeatureIcon
            icon={<UserCircle className="w-5 h-5" />}
            title="Private"
            desc="Your data is never sold to recruiters."
          />
        </div>
      </section>

      <section className="bg-muted/30 py-24 border-t border-border/30 " id='recent-jobs'>
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-semibold tracking-tight">Recent Openings</h2>
            <Link href="/jobs" className="text-sm font-medium text-primary hover:opacity-70 transition">
              View All Roles
            </Link>
          </div>

          <div className="space-y-3 " >
            {featuredJobs.map((job) => (
              <Link
                key={job.id}
                href='/login'
                className="group flex items-center justify-between rounded-2xl border border-border/20 bg-card p-5 hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300"
              >
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-muted/50 text-muted-foreground font-bold group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                    {job.company[0]}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-foreground/90">{job.title}</h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground/60">
                      <span className="font-medium text-muted-foreground/80">{job.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                      <span className="bg-muted px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">{job.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="hidden md:block text-[11px] font-bold text-primary/60 uppercase tracking-widest">{job.tag}</span>
                  <div className="rounded-full p-2 bg-muted/50 group-hover:bg-primary group-hover:text-black/50 group-hover:scale-125 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-border/20 text-center">
        <p className="text-[13px] text-muted-foreground/50">
          © {new Date().getFullYear()} HireFlow. Minimalist Hiring.
        </p>
      </footer>
    </main >
  );
}

function FeatureIcon({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center md:items-start md:text-left gap-4">
      <div className="text-primary/70 bg-primary/5 p-3 rounded-2xl">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-semibold tracking-tight">{title}</h4>
        <p className="mt-2 text-sm text-muted-foreground/60 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}