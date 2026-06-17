import { sampleStories } from "@/lib/sample-stories";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import ReadingProgress from "@/components/ui/ReadingProgress";
import ShareButtons from "@/components/ui/ShareButtons";
import StoryCard from "@/components/stories/StoryCard";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = sampleStories.find((s) => s.slug === slug);
  if (!story) return { title: "Story Not Found" };
  return { title: story.title, description: story.excerpt };
}

export function generateStaticParams() {
  return sampleStories.map((s) => ({ slug: s.slug }));
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = sampleStories.find((s) => s.slug === slug && s.status === "PUBLISHED");

  if (!story) notFound();

  const relatedStories = sampleStories
    .filter((s) => s.status === "PUBLISHED" && s.id !== story.id && s.category === story.category)
    .slice(0, 2);

  const moreStories = relatedStories.length < 2
    ? [
        ...relatedStories,
        ...sampleStories
          .filter((s) => s.status === "PUBLISHED" && s.id !== story.id && s.category !== story.category)
          .slice(0, 2 - relatedStories.length),
      ]
    : relatedStories;

  return (
    <>
      <ReadingProgress />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/stories" className="text-blue-700 hover:underline text-sm mb-6 inline-block">
          ← Back to Stories
        </Link>

        <span
          className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full text-white mb-4"
          style={{ backgroundColor: story.categoryColor }}
        >
          {story.category}
        </span>

        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{story.title}</h1>

        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{new Date(story.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span>·</span>
            <span>{story.readTime} min read</span>
          </div>
          <ShareButtons title={story.title} slug={story.slug} />
        </div>

        {story.imageUrl && (
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-72 object-cover rounded-xl mb-8"
          />
        )}

        <article className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          {story.content.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>

        {/* Share again at bottom */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
          <ShareButtons title={story.title} slug={story.slug} />
        </div>

        {/* Related Stories */}
        {moreStories.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-gray-900 mb-5">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {moreStories.map((s) => (
                <StoryCard key={s.id} story={s} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 p-6 bg-blue-50 rounded-xl text-center">
          <p className="text-gray-700 mb-3">Have a similar experience to share?</p>
          <Link
            href="/submit"
            className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Share Your Story Anonymously
          </Link>
        </div>
      </main>
    </>
  );
}
