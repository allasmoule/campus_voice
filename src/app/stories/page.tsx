import { sampleStories } from "@/lib/sample-stories";
import StoryCard from "@/components/stories/StoryCard";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";
import { AdTop, AdMid, AdBottom } from "@/components/ads/PageAds";

export const metadata = {
  title: "Stories",
  description: "Browse real stories from students, faculty, and staff across higher education.",
};

export default function StoriesPage() {
  const stories = sampleStories.filter((s) => s.status === "PUBLISHED");
  const firstHalf = stories.slice(0, Math.ceil(stories.length / 2));
  const secondHalf = stories.slice(Math.ceil(stories.length / 2));

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">All Stories</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real experiences from across higher education — unfiltered, anonymous, and research-driven.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <Link
            href="/stories"
            className="px-4 py-2 rounded-full text-sm font-medium bg-blue-700 text-white"
          >
            All
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </main>

      <AdTop page="stories" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {firstHalf.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>

      <AdMid page="stories" />

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {secondHalf.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>

      <AdBottom page="stories" />
    </>
  );
}
