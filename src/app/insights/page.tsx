import Link from "next/link";
import { AdTop, AdMid, AdBottom } from "@/components/ads/PageAds";

export const metadata = {
  title: "Insights",
  description: "Aggregated data and insights from campus experiences across higher education.",
};

export default function InsightsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Campus Insights</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Aggregated, anonymized data from campus experiences — powering research and driving institutional change.
        </p>
      </div>

      <AdTop page="insights" />

      {/* Coming Soon Preview */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 text-center mb-12">
        <div className="text-6xl mb-6">📊</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Data Dashboard Coming Soon</h2>
        <p className="text-gray-600 max-w-lg mx-auto mb-6">
          We&apos;re building interactive dashboards that will visualize anonymized survey data across
          institutions, roles, and academic areas. Help us get there by contributing your experience.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/survey" className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
            Take the Survey
          </Link>
          <Link href="/submit" className="border border-blue-700 text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-white transition">
            Share a Story
          </Link>
        </div>
      </div>

      <AdMid page="insights" />

      {/* Preview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Stories Shared", value: "150+", icon: "📝" },
          { label: "Institutions Represented", value: "40+", icon: "🏛️" },
          { label: "Survey Responses", value: "500+", icon: "📋" },
          { label: "Categories Covered", value: "6", icon: "📂" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <AdBottom page="insights" />
    </main>
  );
}
