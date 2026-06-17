import Link from "next/link";
import type { Story } from "@/types/story";
import { formatDate } from "@/lib/utils";

export default function StoryCard({ story }: { story: Story }) {
  return (
    <Link
      href={`/stories/${story.slug}`}
      className="group flex flex-col"
    >
      {/* Image — rounded corners matching mockup */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 rounded-lg">
        <img
          src={story.imageUrl}
          alt={story.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 pt-3">
        {/* Category badge — colored text, no background */}
        <span
          className="inline-block self-start text-[10px] font-bold uppercase tracking-wider"
          style={{ color: story.categoryColor }}
        >
          {story.category}
        </span>

        <h3 className="mt-1 text-[14px] font-bold text-gray-900 group-hover:text-[#1D4ED8] transition-colors leading-snug line-clamp-2">
          {story.title}
        </h3>

        <p className="mt-1 text-[12px] text-gray-500 line-clamp-2 flex-1 leading-relaxed">
          {story.excerpt}
        </p>

        <div className="mt-2.5 flex items-center gap-2 text-[11px] text-gray-400">
          <time>{formatDate(story.createdAt)}</time>
          <span>&middot;</span>
          <span>{story.readTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
