'use client'
import Link from 'next/link'
import LoginForm from './LoginForm'

const Login = () => {
  return (
    <main className="min-h-screen bg-background text-foreground grid lg:grid-cols-5">
      <aside className="hidden lg:flex lg:col-span-2 flex-col justify-between px-20 py-16 border-r border-border/60 bg-muted/30">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition"
        >
          ← Back to Home
        </Link>

        <div>
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            Welcome back to HireFlow
            <span className="block text-primary mt-2">sign in.</span>
          </h1>

          <p className="mt-6 text-muted-foreground max-w-md">
            Sign in to access your dashboard, manage applications, and continue your hiring or job search journey.
          </p>

          <div className="mt-12 space-y-8">
            {['01', '02', '03'].map((n, i) => (
              <div key={n} className="flex gap-4">
                <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                  {n}
                </div>
                <div>
                  <h4 className="font-semibold">
                    {[
                      'Secure access',
                      'Continue where you left off',
                      'Trusted hiring platform',
                    ][i]}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {[
                      'Your account is protected with role-based access and verified authentication.',
                      'Resume applications, job postings, and profile updates seamlessly.',
                      'Join a verified ecosystem of approved companies and genuine candidates.',
                    ][i]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} HireFlow<span className="text-primary">.</span>
        </p>
      </aside>

      <section className="lg:col-span-3 flex items-center justify-center px-6 py-16">
        <LoginForm />
      </section>
    </main>

  )
}

export default Login