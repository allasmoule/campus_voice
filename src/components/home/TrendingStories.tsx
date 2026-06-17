import Link from "next/link";
import StoryCard from "@/components/stories/StoryCard";
import { sampleStories } from "@/lib/sample-stories";

export default function TrendingStories() {
  const trending = sampleStories.slice(0, 4);

  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Trending on Campus
          </h2>
          <Link
            href="/stories"
            className="text-xs font-medium text-[#1D4ED8] hover:underline"
          >
            View all stories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-stagger">
          {trending.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
