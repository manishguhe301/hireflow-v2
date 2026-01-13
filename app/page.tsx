export default function HomePage() {
  return (
    <main className="bg-black text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Hire Faster. <span className="text-indigo-500">Get Hired Smarter.</span>
          </h1>

          <p className="mt-6 text-lg text-gray-400 max-w-3xl mx-auto">
            JobFlow connects top talent with verified companies through a structured,
            transparent, and efficient hiring platform.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <button className="rounded-lg bg-indigo-600 px-6 py-3 font-medium hover:bg-indigo-700 transition">
              Find Jobs
            </button>
            <button className="rounded-lg border border-gray-700 px-6 py-3 font-medium hover:bg-gray-900 transition">
              Post a Job
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Active Jobs", value: "10,000+" },
            { label: "Verified Companies", value: "2,500+" },
            { label: "Job Seekers", value: "500K+" },
            { label: "Successful Hires", value: "120K+" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* USER JOURNEYS */}
      <section className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-3xl font-bold text-center">
            Built for Every Hiring Role
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Job Seeker */}
            <div className="rounded-xl border border-gray-800 p-6 hover:border-indigo-600 transition">
              <h3 className="text-xl font-semibold">Job Seekers</h3>
              <p className="mt-3 text-gray-400">
                Create a powerful profile, apply in one click, and track every application
                with full transparency.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li>• Smart job recommendations</li>
                <li>• Resume & profile management</li>
                <li>• Application status tracking</li>
              </ul>
            </div>

            {/* Company Admin */}
            <div className="rounded-xl border border-gray-800 p-6 hover:border-indigo-600 transition">
              <h3 className="text-xl font-semibold">Companies</h3>
              <p className="mt-3 text-gray-400">
                Hire confidently with verified company profiles and a structured
                application review system.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li>• Post & manage jobs</li>
                <li>• Review applicants efficiently</li>
                <li>• Analytics & hiring insights</li>
              </ul>
            </div>

            {/* Platform Admin */}
            <div className="rounded-xl border border-gray-800 p-6 hover:border-indigo-600 transition">
              <h3 className="text-xl font-semibold">Platform Admin</h3>
              <p className="mt-3 text-gray-400">
                Maintain platform integrity with full oversight over companies,
                users, and system activity.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li>• Company approval workflow</li>
                <li>• User & role management</li>
                <li>• Platform-wide analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-gray-800 bg-gradient-to-b from-black to-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-3xl font-bold text-center">How JobFlow Works</h2>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                desc: "Job seekers and companies create rich profiles to stand out.",
              },
              {
                step: "02",
                title: "Connect & Apply",
                desc: "Apply to jobs or receive applications with structured workflows.",
              },
              {
                step: "03",
                title: "Track & Hire",
                desc: "Monitor application status, interviews, and hiring decisions.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <p className="text-indigo-500 font-bold text-lg">{item.step}</p>
                <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Transform Hiring?
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Whether you&apos;re looking for your next opportunity or your next hire,
            JobFlow gives you the tools to succeed.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <button className="rounded-lg bg-indigo-600 px-8 py-3 font-medium hover:bg-indigo-700 transition">
              Get Started
            </button>
            <button className="rounded-lg border border-gray-700 px-8 py-3 font-medium hover:bg-gray-900 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} JobFlow. All rights reserved.
      </footer>
    </main>
  );
}
