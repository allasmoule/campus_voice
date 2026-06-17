import Link from "next/link";
import { AdTop, AdMid, AdBottom } from "@/components/ads/PageAds";

export const metadata = {
  title: "About",
  description: "Understanding higher education through lived experience. Learn about TheCampusVoice mission.",
};

export default function AboutPage() {
  return (
    <>
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About TheCampusVoice</h1>

      <AdTop page="about" />

      <section className="prose prose-lg max-w-none text-gray-700">
        <p className="text-xl text-gray-600 mb-8">
          Understanding Higher Education Through Lived Experience
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
        <p>
          TheCampusVoice is a confidential, research-driven platform capturing how students, faculty,
          and staff truly experience academic environments. We believe that real stories from real people
          can drive meaningful change in higher education.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What We Do</h2>
        <p>
          We provide a safe, anonymous space where members of the academic community can share their
          authentic experiences — from classroom dynamics and mentorship to institutional culture and
          career development. Every story is moderated for safety while preserving the voice and
          perspective of the contributor.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Approach</h2>
        <ul className="space-y-3">
          <li><strong>Anonymous & Confidential:</strong> No login required. No IP logging. No identifying data collected.</li>
          <li><strong>Experience-Based:</strong> We collect personal experiences (&quot;I felt...&quot;), not accusations (&quot;They did...&quot;).</li>
          <li><strong>Research-Driven:</strong> Our structured survey instruments are designed to produce actionable institutional insights.</li>
          <li><strong>Equity-Centered:</strong> We amplify voices that are often unheard in higher education conversations.</li>
          <li><strong>Legally Responsible:</strong> Built-in safeguards protect both contributors and the individuals they reference.</li>
        </ul>

        <AdMid page="about" />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Values</h2>
        <p>
          We believe in transparency, equity, and the power of narrative. Every feature of this platform
          is designed to center the human experience while maintaining the highest standards of research
          ethics and legal responsibility.
        </p>

        <div className="bg-blue-50 rounded-xl p-6 mt-8 text-center">
          <p className="text-gray-700 mb-3 font-medium">Ready to make your voice heard?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/submit" className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
              Share Your Story
            </Link>
            <Link href="/survey" className="border border-blue-700 text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
              Take the Survey
            </Link>
          </div>
        </div>
      </section>

      <AdBottom page="about" />
    </main>
    </>
  );
}
