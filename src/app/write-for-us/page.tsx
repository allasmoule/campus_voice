import Link from "next/link";
import { AdTop, AdMid, AdBottom } from "@/components/ads/PageAds";

export const metadata = {
  title: "Write for Us",
  description: "Contribute to TheCampusVoice. Share your higher education experience anonymously.",
};

export default function WriteForUsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-3">Write for Us</h1>
      <p className="text-xl text-gray-600 mb-8">
        Your experience in higher education deserves to be heard. Here&apos;s how to contribute.
      </p>

      <AdTop page="write" />

      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">What We Publish</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-2"><span className="text-blue-700 font-bold">→</span> First-person narratives about campus experiences</li>
            <li className="flex gap-2"><span className="text-blue-700 font-bold">→</span> Opinion pieces on higher education issues</li>
            <li className="flex gap-2"><span className="text-blue-700 font-bold">→</span> Stories about classroom dynamics, mentorship, and institutional culture</li>
            <li className="flex gap-2"><span className="text-blue-700 font-bold">→</span> Reflections on career development and academic life</li>
            <li className="flex gap-2"><span className="text-blue-700 font-bold">→</span> Wellness and mental health experiences in academia</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Guidelines</h2>
          <div className="bg-gray-50 rounded-xl p-6 space-y-3 text-sm text-gray-700">
            <p><strong>Length:</strong> 300–1,500 words</p>
            <p><strong>Tone:</strong> Authentic, reflective, experience-based</p>
            <p><strong>Language:</strong> Use &quot;I felt...&quot; and &quot;My experience was...&quot; — not accusations or naming individuals</p>
            <p><strong>Privacy:</strong> Do not include names, identifying details, or specific department/course numbers that could identify individuals</p>
            <p><strong>Categories:</strong> News, Opinion, Campus Life, Careers, Wellness, or Voices</p>
          </div>
        </div>

        <AdMid page="write" />

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Submission Process</h2>
          <ol className="space-y-3 text-gray-700">
            <li className="flex gap-3"><span className="bg-blue-700 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span> Write your story following the guidelines above</li>
            <li className="flex gap-3"><span className="bg-blue-700 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span> Submit through our anonymous submission form — no account needed</li>
            <li className="flex gap-3"><span className="bg-blue-700 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span> Our editorial team reviews for safety and guidelines compliance</li>
            <li className="flex gap-3"><span className="bg-blue-700 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0">4</span> Approved stories are published on the platform</li>
          </ol>
        </div>

        <div className="text-center pt-4">
          <Link
            href="/submit"
            className="inline-block bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-800 transition"
          >
            Submit Your Story
          </Link>
          <p className="text-sm text-gray-500 mt-3">Completely anonymous. No login required.</p>
        </div>
      </section>

      <AdBottom page="write" />
    </main>
  );
}
