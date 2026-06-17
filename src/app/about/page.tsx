import Link from "next/link";
import Image from "next/image";
import { AdTop, AdMid, AdBottom } from "@/components/ads/PageAds";

export const metadata = {
  title: "About",
  description: "Understanding higher education through lived experience. Learn about TheCampusVoice mission.",
};

const values = [
  {
    icon: "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88",
    title: "Anonymous & Confidential",
    desc: "No login required. No IP logging. No identifying data collected — your privacy is absolute.",
    color: "#dc2626",
    bg: "#fef2f2",
  },
  {
    icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z",
    title: "Experience-Based",
    desc: "We collect personal experiences (\"I felt...\"), not accusations (\"They did...\") — centering your narrative.",
    color: "#2563eb",
    bg: "#eff6ff",
  },
  {
    icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6",
    title: "Research-Driven",
    desc: "Structured survey instruments designed to produce actionable institutional insights and real data.",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    icon: "M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z",
    title: "Equity-Centered",
    desc: "Amplifying voices often unheard in higher education — students, adjuncts, staff, and marginalized communities.",
    color: "#059669",
    bg: "#ecfdf5",
  },
  {
    icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    title: "Legally Responsible",
    desc: "Built-in safeguards protect both contributors and the individuals they reference — moderated for safety.",
    color: "#d97706",
    bg: "#fffbeb",
  },
  {
    icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
    title: "Transparent Platform",
    desc: "Every feature is designed to center the human experience with the highest standards of research ethics.",
    color: "#0891b2",
    bg: "#ecfeff",
  },
];

const timeline = [
  { phase: "Phase 1", title: "Narrative Repository", desc: "Curated anonymous stories, submission forms, and the public-facing platform.", status: "live" },
  { phase: "Phase 2", title: "Climate Data Platform", desc: "Structured surveys, aggregated insights, institutional dashboards.", status: "building" },
  { phase: "Phase 3", title: "Private Network", desc: "Invite-only verified community for deeper dialogue and collaboration.", status: "planned" },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: "380px" }}>
        <Image
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&h=700&fit=crop"
          alt="University campus"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0f1b3d 0%, #0f1b3de6 40%, #0f1b3daa 60%, #0f1b3d66 80%, #0f1b3d44 100%)" }} />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 flex items-center" style={{ minHeight: "380px" }}>
          <div className="max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-300 mb-4">About Us</p>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.8rem] font-extrabold text-white leading-tight">
              Understanding Higher Education Through{" "}
              <span className="relative inline-block">
                Lived Experience
                <svg className="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  <path d="M2 6C30 2 70 1 100 2.5C130 4 170 5 198 2" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="text-white/60 mt-4 text-sm leading-relaxed max-w-md">
              A confidential, research-driven platform capturing how students, faculty, and staff truly experience academic environments.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "150+", label: "Stories Shared" },
              { value: "500+", label: "Survey Responses" },
              { value: "40+", label: "Institutions" },
              { value: "100%", label: "Anonymous" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-extrabold text-[#0f1b3d]">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <AdTop page="about" />

        {/* Mission */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1D4ED8] mb-2">Our Mission</p>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              Real stories from real people can drive meaningful change
            </h2>
            <p className="text-sm text-gray-600 mt-4 leading-relaxed">
              TheCampusVoice provides a safe, anonymous space where members of the academic community can share their authentic experiences — from classroom dynamics and mentorship to institutional culture and career development.
            </p>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              Every story is moderated for safety while preserving the voice and perspective of the contributor. We exist because higher education needs honest feedback to become more equitable, transparent, and human.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden h-64 lg:h-80">
            <Image
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop"
              alt="Students collaborating"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </section>

        {/* Values */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1D4ED8] mb-2">Our Values</p>
            <h2 className="text-2xl font-bold text-gray-900">Built on principles that matter</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v) => (
              <div key={v.title} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 group">
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 transition-colors"
                  style={{ backgroundColor: v.bg }}
                >
                  <svg className="w-5 h-5" style={{ color: v.color }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={v.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{v.title}</h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <AdMid page="about" />

        {/* How It Works */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1D4ED8] mb-2">How It Works</p>
            <h2 className="text-2xl font-bold text-gray-900">Three simple steps to share your story</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Write Your Story", desc: "Share your experience anonymously. No login, no tracking — just your voice.", icon: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" },
              { step: "02", title: "We Moderate", desc: "Our system filters names and accusations while preserving your authentic experience.", icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" },
              { step: "03", title: "Drive Change", desc: "Published stories and aggregated data inform research and institutional improvement.", icon: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" },
            ].map((s) => (
              <div key={s.step} className="relative bg-[#f8fafc] border border-gray-100 rounded-xl p-6 text-center">
                <span className="text-4xl font-black text-[#1D4ED8]/10">{s.step}</span>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1D4ED8]/10 mt-2 mb-3">
                  <svg className="w-6 h-6 text-[#1D4ED8]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{s.title}</h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1D4ED8] mb-2">Our Roadmap</p>
            <h2 className="text-2xl font-bold text-gray-900">Building the future of campus feedback</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {timeline.map((t) => (
              <div key={t.phase} className="bg-white border border-gray-200 rounded-xl p-6 relative overflow-hidden">
                <span className={`absolute top-4 right-4 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  t.status === "live" ? "bg-green-100 text-green-700" :
                  t.status === "building" ? "bg-blue-100 text-blue-700" :
                  "bg-gray-100 text-gray-500"
                }`}>
                  {t.status === "live" ? "Live" : t.status === "building" ? "In Progress" : "Planned"}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8]">{t.phase}</span>
                <h3 className="font-bold text-gray-900 mt-1">{t.title}</h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quote */}
        <section className="mt-16 bg-[#0f1b3d] rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-5 left-10 w-40 h-40 rounded-full bg-blue-400 blur-3xl" />
            <div className="absolute bottom-5 right-10 w-32 h-32 rounded-full bg-purple-400 blur-3xl" />
          </div>
          <div className="relative">
            <svg className="w-10 h-10 text-white/20 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
            </svg>
            <p className="text-white text-lg sm:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              &ldquo;Higher education thrives when every voice is heard. We&apos;re building the infrastructure for honest, safe, and impactful campus feedback.&rdquo;
            </p>
            <p className="text-white/50 text-sm mt-4">— TheCampusVoice Team</p>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-2xl p-8 sm:p-10 text-center">
          <h2 className="text-xl font-bold text-gray-900">Ready to Make Your Voice Heard?</h2>
          <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
            Whether you want to share a story, take our research survey, or learn more about campus experiences — start here.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link href="/submit" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D4ED8] text-white font-semibold rounded-lg hover:bg-[#1E40AF] transition-colors">
              Share Your Story
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link href="/survey" className="inline-flex items-center px-6 py-3 border-2 border-[#1D4ED8] text-[#1D4ED8] font-semibold rounded-lg hover:bg-[#1D4ED8] hover:text-white transition-colors">
              Take the Survey
            </Link>
          </div>
        </section>

        <AdBottom page="about" />
      </div>
    </main>
  );
}
