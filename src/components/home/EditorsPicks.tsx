import Link from "next/link";
import { sampleStories } from "@/lib/sample-stories";

export default function EditorsPicks() {
  const featured = sampleStories.filter((s) => s.status === "PUBLISHED").slice(4, 7);
  if (featured.length < 3) return null;

  const main = featured[0];
  const side = featured.slice(1, 3);

  return (
    <section className="bg-[#F9FAFB] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Editor&apos;s Picks
            </h2>
            <p className="text-sm text-gray-500 mt-1">Curated stories that matter</p>
          </div>
          <Link href="/stories" className="text-xs font-medium text-[#1D4ED8] hover:underline">
            See all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Main featured story — takes 3 columns */}
          <Link href={`/stories/${main.slug}`} className="lg:col-span-3 group">
            <div className="relative overflow-hidden rounded-xl h-[340px]">
              <img
                src={main.imageUrl}
                alt={main.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
                  {main.category}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1 leading-tight">
                  {main.title}
                </h3>
                <p className="text-sm text-white/70 mt-2 line-clamp-2">{main.excerpt}</p>
              </div>
            </div>
          </Link>

          {/* Side stories — takes 2 columns */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {side.map((story) => (
              <Link key={story.id} href={`/stories/${story.slug}`} className="group flex gap-4 items-start">
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  className="w-28 h-20 object-cover rounded-lg shrink-0 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="flex-1 min-w-0">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: story.categoryColor }}
                  >
                    {story.category}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 mt-0.5 leading-snug group-hover:text-[#1D4ED8] transition-colors line-clamp-2">
                    {story.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{story.excerpt}</p>
                  <p className="text-[10px] text-gray-400 mt-1.5">{story.readTime} min read</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
