import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "440px" }}>
      {/* Full background campus image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1562774053-701939374585?w=1600&h=800&fit=crop')",
        }}
      />
      {/* Left-heavy gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, #0f1b3d 0%, #0f1b3de6 35%, #0f1b3daa 55%, #0f1b3d44 70%, transparent 85%)",
        }}
      />

      <div
        className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-14 sm:py-16 lg:py-20 flex items-center"
        style={{ minHeight: "440px" }}
      >
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-300 mb-5">
            Your Campus. Your Voice.
          </p>
          <h1 className="text-[2.5rem] sm:text-[2.8rem] lg:text-[3.2rem] font-extrabold text-white leading-[1.12]">
            Real stories.
            <br />
            <span className="whitespace-nowrap">
              Real students, Real{" "}
              <span className="relative inline-block">
                Professors.
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 6C30 2 70 1 100 2.5C130 4 170 5 198 2"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
            <br />
            Real impact.
          </h1>
          <p className="mt-5 text-[14px] text-gray-300 max-w-sm leading-relaxed">
            TheCampusVoice is the go-to source for news, opinions, and stories
            that matter to college students.
          </p>
          <Link
            href="/stories"
            className="mt-7 inline-flex items-center px-5 py-2.5 rounded-md bg-[#1D4ED8] text-white text-sm font-semibold hover:bg-[#1E40AF] transition-colors"
          >
            Explore Stories
          </Link>
        </div>

        {/* Flag ribbon - right side */}
        <div className="hidden lg:block absolute right-5 top-1/2 -translate-y-1/2">
          <div className="relative">
            {/* Ribbon body */}
            <div className="bg-[#0c1a3a] border border-white/20 px-4 py-5 flex flex-col items-center gap-2 shadow-2xl"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 90%, 0 100%)",
                paddingBottom: "28px",
              }}
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/90 text-center leading-tight">
                YOUR<br />VOICE.
              </span>
              <div className="w-6 h-px bg-white/30" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/90 text-center leading-tight">
                YOUR<br />CAMPUS.
              </span>
              <div className="w-6 h-px bg-white/30" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/90 text-center leading-tight">
                YOUR<br />FUTURE.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
