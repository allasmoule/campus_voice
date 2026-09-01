import Link from "next/link";
import { formatDate } from "@/lib/utils";

export interface SubmittedStory {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  imageUrl?: string | null;
  category: string;
  categoryColor: string;
  readTime: number;
  createdAt: string;
}

export default function SubmittedStoryCard({ story }: { story: SubmittedStory }) {
  return (
    <Link href={`/stories/view?slug=${encodeURIComponent(story.slug)}`} className="group flex flex-col">
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-lg flex items-center justify-center bg-gray-100"
        style={!story.imageUrl ? { backgroundColor: `${story.categoryColor}1A` } : undefined}
      >
        {story.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: story.categoryColor }}>
            {story.category}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 pt-3">
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
