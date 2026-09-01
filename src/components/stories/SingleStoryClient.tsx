"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ReadingProgress from "@/components/ui/ReadingProgress";
import ShareButtons from "@/components/ui/ShareButtons";
import StoryCard from "@/components/stories/StoryCard";
import StoryReactions from "@/components/stories/StoryReactions";
import { AdTop, AdMid, AdBottom } from "@/components/ads/PageAds";
import type { Story } from "@/types/story";

interface Props {
  slug: string;
  initialStory?: Story | null;
  sampleStories: Story[];
}

export default function SingleStoryClient({ slug, initialStory, sampleStories }: Props) {
  const [story, setStory] = useState<Story | null>(initialStory || null);
  const [loading, setLoading] = useState(!initialStory);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    if (initialStory) return;
    let cancelled = false;
    fetch(`/backend/stories.php?slug=${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.story) {
          const s = data.story;
          setStory({
            id: String(s.id || s.slug),
            title: s.title,
            slug: s.slug,
            excerpt: s.excerpt,
            content: s.content,
            category: s.category,
            categoryColor: s.categoryColor || "#1D4ED8",
            imageUrl: s.imageUrl || "",
            readTime: Number(s.readTime) || 3,
            createdAt: s.createdAt,
            status: "PUBLISHED",
          });
        } else {
          setNotFoundState(true);
        }
      })
      .catch(() => {
        if (!cancelled) setNotFoundState(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, initialStory]);

  if (loading) {
    return <main className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-500">Loading story…</main>;
  }

  if (notFoundState || !story) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Story Not Found</h1>
        <p className="text-gray-500 mb-6">The story you are looking for does not exist or has been removed.</p>
        <Link href="/stories" className="text-blue-700 hover:underline text-sm font-medium">
          ← Back to All Stories
        </Link>
      </main>
    );
  }

  const relatedStories = sampleStories
    .filter((s) => s.status === "PUBLISHED" && s.id !== story.id && s.category === story.category)
    .slice(0, 2);

  const moreStories =
    relatedStories.length < 2
      ? [
          ...relatedStories,
          ...sampleStories
            .filter((s) => s.status === "PUBLISHED" && s.id !== story.id && s.category !== story.category)
            .slice(0, 2 - relatedStories.length),
        ]
      : relatedStories;

  useEffect(() => {
    if (!story) return;
    document.title = `${story.title} | TheCampusVoice`;

    const shareImageUrl = story.imageUrl || "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1200&h=630&fit=crop";
    const shareUrl = `https://thecampusvoice.info/stories/view?slug=${encodeURIComponent(story.slug)}`;

    const setMeta = (property: string, content: string, isName = false) => {
      const selector = isName ? `meta[name="${property}"]` : `meta[property="${property}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        if (isName) el.name = property;
        else el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("description", story.excerpt, true);
    setMeta("og:title", story.title);
    setMeta("og:description", story.excerpt);
    setMeta("og:image", shareImageUrl);
    setMeta("og:url", shareUrl);
    setMeta("og:type", "article");
    setMeta("twitter:card", "summary_large_image", true);
    setMeta("twitter:title", story.title, true);
    setMeta("twitter:description", story.excerpt, true);
    setMeta("twitter:image", shareImageUrl, true);
  }, [story]);

  return (
    <>
      <ReadingProgress />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/stories" className="text-blue-700 hover:underline text-sm mb-6 inline-block">
          ← Back to Stories
        </Link>

        <div>
          <span
            className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full text-white mb-4"
            style={{ backgroundColor: story.categoryColor }}
          >
            {story.category}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{story.title}</h1>

        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              {new Date(story.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>·</span>
            <span>{story.readTime} min read</span>
          </div>
          <ShareButtons title={story.title} slug={story.slug} />
        </div>

        {story.imageUrl && (
          <img src={story.imageUrl} alt={story.title} className="w-full h-72 object-cover rounded-xl mb-8" />
        )}

        <AdTop page="story" />

        <article className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          {story.content.includes("<p>") || story.content.includes("<br>") ? (
            <div dangerouslySetInnerHTML={{ __html: story.content }} />
          ) : (
            story.content.split("\n").map((p, i) => <p key={i}>{p}</p>)
          )}
        </article>

        <AdMid page="story" />

        <StoryReactions slug={story.slug} />

        <div className="mt-6 pt-4 flex items-center justify-between">
          <ShareButtons title={story.title} slug={story.slug} />
        </div>

        {moreStories.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-gray-900 mb-5">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {moreStories.map((s) => (
                <StoryCard key={s.id || s.slug} story={s} />
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

        <AdBottom page="story" />
      </main>
    </>
  );
}
