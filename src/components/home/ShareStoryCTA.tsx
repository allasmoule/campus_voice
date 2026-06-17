import Link from "next/link";

export default function ShareStoryCTA() {
  return (
    <section className="bg-[#F9FAFB] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#1D4ED8]/10 mb-5">
            <svg className="w-7 h-7 text-[#1D4ED8]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Your Experience Matters
          </h2>
          <p className="text-gray-600 mt-3 text-sm leading-relaxed max-w-lg mx-auto">
            Every story shared helps build a more transparent, equitable higher education system.
            Your voice contributes to research that drives real institutional change.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D4ED8] text-white font-semibold rounded-lg hover:bg-[#1E40AF] transition-colors"
            >
              Share Your Story
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/write-for-us"
              className="inline-flex items-center px-6 py-3 border-2 border-[#1D4ED8] text-[#1D4ED8] font-semibold rounded-lg hover:bg-[#1D4ED8] hover:text-white transition-colors"
            >
              Writing Guidelines
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            No login required · No IP tracking · Fully anonymous · Moderated for safety
          </p>
        </div>
      </div>
    </section>
  );
}
