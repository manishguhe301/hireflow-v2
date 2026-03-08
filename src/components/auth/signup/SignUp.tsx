'use client'
import Link from 'next/link'
import SignUpForm from './SignUpForm'

const SignUp = () => {
  return (
    <main className="min-h-screen bg-background text-foreground grid lg:grid-cols-5">
      <aside className="hidden lg:flex lg:col-span-2 flex-col justify-between px-20 py-16 border-r border-border/60 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
        </div>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition"
        >
          ← Back to Home
        </Link>

        <div>
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            Join HireFlow
            <span className="block text-primary mt-2">today.</span>
          </h1>

          <p className="mt-6 text-muted-foreground max-w-md">
            A verified job platform with three-tier system ensuring quality hiring for both companies and job seekers.
          </p>

          <div className="mt-12 space-y-8">
            <div className="flex gap-4">
              <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                01
              </div>
              <div>
                <h4 className="font-semibold">Verified companies only</h4>
                <p className="text-sm text-muted-foreground">
                  Every company is manually approved by platform admins.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                02
              </div>
              <div>
                <h4 className="font-semibold">Real-time tracking</h4>
                <p className="text-sm text-muted-foreground">
                  Track your applications from &quot;Applied&quot; to &quot;Hired&quot; with complete transparency.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                03
              </div>
              <div>
                <h4 className="font-semibold">Complete profiles</h4>
                <p className="text-sm text-muted-foreground">
                  Build detailed profiles with resume, skills, experience, and certifications.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} HireFlow<span className="text-primary">.</span>
        </p>
      </aside>

      <section className="lg:col-span-3 flex items-center justify-center px-6 py-16">
        <SignUpForm />
      </section>
    </main>
  );
}

export default SignUp
