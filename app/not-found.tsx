import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
          <AlertTriangle className="h-10 w-10 text-white" />
        </div>

        <h1 className="mt-8 text-5xl font-extrabold tracking-tight">
          404
        </h1>

        <h2 className="mt-4 text-xl font-semibold">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-400">
          The page you are looking for doesn’t exist, was moved, or is no longer
          available.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-black font-semibold hover:bg-gray-200 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back home
          </Link>
        </div>
        <p className="mt-10 text-sm text-gray-500">
          HireFlow — Verified hiring, simplified.
        </p>
      </div>
    </main>
  );
}
