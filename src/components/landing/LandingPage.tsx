import Link from "next/link";

const featuredJobs = [
  {
    id: 1,
    title: "Frontend Engineer",
    company: "TechNova",
    location: "Remote",
    type: "Full-time",
    experience: "Mid Level",
  },
  {
    id: 2,
    title: "Backend Developer (Node.js)",
    company: "CloudCore",
    location: "Bangalore, India",
    type: "Full-time",
    experience: "Senior",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Designify",
    location: "Hybrid · Mumbai",
    type: "Contract",
    experience: "Mid Level",
  },
  {
    id: 4,
    title: "Product Manager",
    company: "ScaleOps",
    location: "Remote",
    type: "Full-time",
    experience: "Lead",
  },
];

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            JobFlow
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            <Link href="/jobs" className="hover:text-white transition">
              Jobs
            </Link>
            <Link href="/login" className="hover:text-white transition">
              For Companies
            </Link>
            <Link href="/login" className="hover:text-white transition">
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-white px-4 py-2 text-black font-medium hover:bg-gray-200 transition"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Hire Smarter. <span className="text-gray-400">Get Hired Faster.</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-400">
            JobFlow connects verified companies with qualified talent through a
            powerful, approval-based hiring platform built for scale.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/jobs"
              className="rounded-md bg-white px-6 py-3 text-black font-semibold hover:bg-gray-200 transition"
            >
              Explore Jobs
            </Link>
            <Link
              href="/signup"
              className="rounded-md border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
            >
              Post a Job
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <span>✔ Verified Companies</span>
            <span>✔ Role-Based Hiring</span>
            <span>✔ End-to-End Application Tracking</span>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-3xl font-bold text-center">
            Built for Real-World Hiring
          </h2>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            <FeatureCard
              title="Verified Companies Only"
              description="Every company goes through an admin approval process, ensuring genuine opportunities."
            />
            <FeatureCard
              title="Advanced Application Tracking"
              description="Track applications through every stage — from applied to hired."
            />
            <FeatureCard
              title="Powerful Profiles"
              description="Rich candidate profiles with resumes, skills, experience, and preferences."
            />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/5">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Featured Jobs</h2>
            <Link
              href="/login"
              className="text-sm text-gray-300 hover:text-white transition"
            >
              View all jobs →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {featuredJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-lg border border-white/10 bg-black p-6 hover:border-white/20 transition"
              >
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="mt-1 text-gray-400">{job.company}</p>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-300">
                  <span className="rounded-full bg-white/10 px-3 py-1">
                    {job.location}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1">
                    {job.type}
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1">
                    {job.experience}
                  </span>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-sm font-medium text-white hover:underline"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="text-4xl font-bold">
            Ready to Transform Your Hiring?
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Whether you are looking for your next opportunity or building a
            world-class team, JobFlow is built for you.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-md bg-white px-6 py-3 text-black font-semibold hover:bg-gray-200 transition"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span>© {new Date().getFullYear()} JobFlow. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-white transition">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default LandingPage

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black p-6">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-gray-400">{description}</p>
    </div>
  );
}