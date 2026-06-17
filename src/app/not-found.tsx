import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="text-8xl font-extrabold text-[#1D4ED8] mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="px-6 py-3 rounded-lg bg-[#1D4ED8] text-white font-semibold hover:bg-[#1E40AF] transition"
        >
          Go Home
        </Link>
        <Link
          href="/stories"
          className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
        >
          Browse Stories
        </Link>
      </div>
    </main>
  );
}
