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
      {/* Left-heavy gradient: dark navy on left, fading to show campus on right */}
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
        <div className="max-w-lg">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-blue-300 mb-5">
            Your Campus. Your Voice.
          </p>
          <h1 className="text-[2.5rem] sm:text-[2.8rem] lg:text-[3.2rem] font-extrabold text-white leading-[1.08]">
            Real stories.
            <br />
            Real students,{" "}
            <span className="relative inline-block">
              Real Professors.
              <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#1D4ED8] rounded-full" />
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
      </div>
    </section>
  );
}
