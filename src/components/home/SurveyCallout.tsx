import Link from "next/link";

export default function SurveyCallout() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left - Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1D4ED8] mb-3">
                Campus Climate Research
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                Help Us Understand<br />Academic Experiences
              </h2>
              <p className="text-gray-600 mt-4 text-sm leading-relaxed max-w-md">
                Take our confidential survey designed with research-grade methodology.
                Your anonymous responses contribute to a broader understanding of campus climate,
                equity, and belonging in higher education.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/survey"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1D4ED8] text-white text-sm font-semibold rounded-lg hover:bg-[#1E40AF] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Take the Survey
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-white transition-colors"
                >
                  Learn More
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-4 text-[11px] text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  100% Anonymous
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  5 Minutes
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Research-Driven
                </span>
              </div>
            </div>

            {/* Right - Visual */}
            <div className="hidden lg:flex items-center justify-center p-8 relative">
              <div className="grid grid-cols-2 gap-4 max-w-xs">
                {[
                  { q: "I felt respected", pct: "72%", color: "#059669" },
                  { q: "Safe to disagree", pct: "58%", color: "#D97706" },
                  { q: "Fair evaluation", pct: "67%", color: "#2563EB" },
                  { q: "Sense of belonging", pct: "61%", color: "#7C3AED" },
                ].map((item) => (
                  <div key={item.q} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="text-2xl font-bold" style={{ color: item.color }}>{item.pct}</div>
                    <div className="text-[10px] text-gray-500 mt-1 leading-tight">{item.q}</div>
                    <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: item.pct, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
